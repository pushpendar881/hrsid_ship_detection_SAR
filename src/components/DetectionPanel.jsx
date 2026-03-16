import React, { useState, useRef, useCallback } from 'react'
import { dbHelpers } from '../lib/supabase'

const HF_SPACE = 'https://pushpendar-hrsid-ship-detection-sar.hf.space'

async function callGradioAPI(imageFile, threshold) {
  // Convert file to base64 data URL
  const toBase64 = f => new Promise((res, rej) => {
    const r = new FileReader()
    r.onload = () => res(r.result)
    r.onerror = rej
    r.readAsDataURL(f)
  })
  const b64DataUrl = await toBase64(imageFile)

  // Use Gradio REST API - send base64 string directly for PIL image input
  const res = await fetch(`${HF_SPACE}/run/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fn_index: 0,
      data: [b64DataUrl, threshold, 'web_user'],
    }),
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  const json = await res.json()
  return json.data // [annotated_image, info_text]
}

// Parse detection info to extract structured data
function parseDetectionInfo(info) {
  if (!info) return { shipCount: 0, confidenceScores: [], boundingBoxes: [] }
  
  const shipCountMatch = info.match(/Detected (\d+) ship/)
  const shipCount = shipCountMatch ? parseInt(shipCountMatch[1]) : 0
  
  const scoreMatch = info.match(/Confidence scores: (.+)/)
  const confidenceScores = scoreMatch
    ? scoreMatch[1].split(',').map(s => parseFloat(s.trim()))
    : []
  
  // Extract bounding boxes from lines like "Ship 1: [x1, y1, x2, y2]"
  const boxLines = info.split('\n').filter(l => l.trim().startsWith('Ship'))
  const boundingBoxes = boxLines.map(line => {
    const match = line.match(/\[([^\]]+)\]/)
    if (match) {
      return match[1].split(',').map(n => parseFloat(n.trim()))
    }
    return []
  }).filter(box => box.length === 4)
  
  return { shipCount, confidenceScores, boundingBoxes }
}

function UploadZone({ onFile, file, preview }) {
  const inputRef = useRef()
  const [dragging, setDragging] = useState(false)

  const onDrop = useCallback(e => {
    e.preventDefault(); setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f && f.type.startsWith('image/')) onFile(f)
  }, [onFile])

  return (
    <div
      onClick={() => inputRef.current.click()}
      onDragOver={e => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      style={{
        border: `2px dashed ${dragging ? 'var(--teal)' : 'var(--border2)'}`,
        borderRadius: 4, padding: '2rem',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: '1rem', cursor: 'pointer', minHeight: 220,
        background: dragging ? 'rgba(0,229,200,0.05)' : 'var(--bg2)',
        transition: 'all 0.2s', position: 'relative', overflow: 'hidden',
      }}
    >
      <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }}
        onChange={e => { if (e.target.files[0]) onFile(e.target.files[0]) }} />

      {preview ? (
        <img src={preview} alt="preview" style={{
          maxWidth: '100%', maxHeight: 200, objectFit: 'contain', borderRadius: 2,
        }}/>
      ) : (
        <>
          <div style={{ fontSize: '2.5rem', opacity: 0.5 }}>📡</div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-hud)', fontSize: '0.7rem', letterSpacing: '0.15em', color: 'var(--teal)', marginBottom: 6 }}>
              DROP SAR IMAGE HERE
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
              or click to browse · PNG, JPG, TIFF
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function HUDBox({ children, label, style }) {
  return (
    <div style={{
      border: '1px solid var(--border)', borderRadius: 4,
      background: 'var(--bg2)', position: 'relative',
      ...style,
    }}>
      {label && (
        <div style={{
          position: 'absolute', top: -10, left: 16,
          fontFamily: 'var(--font-hud)', fontSize: '0.55rem',
          letterSpacing: '0.2em', color: 'var(--teal)',
          background: 'var(--bg2)', padding: '0 8px',
        }}>{label}</div>
      )}
      {children}
    </div>
  )
}

function ParsedResults({ info }) {
  if (!info) return null

  const lines = info.split('\n').filter(Boolean)
  const header = lines[0] // "✅ Detected N ship(s)"
  const scoreMatch = info.match(/Confidence scores: (.+)/)
  const scores = scoreMatch
    ? scoreMatch[1].split(',').map(s => parseFloat(s.trim()))
    : []
  const boxLines = lines.filter(l => l.trim().startsWith('Ship'))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Header */}
      <div style={{
        fontFamily: 'var(--font-hud)', fontSize: '0.8rem',
        color: scores.length > 0 ? 'var(--teal)' : 'var(--amber)',
        letterSpacing: '0.05em',
      }}>{header}</div>

      {/* Confidence bars */}
      {scores.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <div style={{ fontFamily: 'var(--font-hud)', fontSize: '0.55rem', letterSpacing: '0.2em', color: 'var(--text-dim)' }}>
            CONFIDENCE SCORES
          </div>
          {scores.map((s, i) => (
            <div key={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontFamily: 'var(--font-hud)', fontSize: '0.6rem', color: 'var(--text-dim)' }}>
                  SHIP {String(i + 1).padStart(2, '0')}
                </span>
                <span style={{ fontFamily: 'var(--font-hud)', fontSize: '0.65rem', color: s > 0.8 ? 'var(--teal)' : s > 0.6 ? 'var(--amber)' : 'var(--red)' }}>
                  {(s * 100).toFixed(1)}%
                </span>
              </div>
              <div style={{ height: 4, background: 'var(--bg3)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${s * 100}%`,
                  background: s > 0.8 ? 'var(--teal)' : s > 0.6 ? 'var(--amber)' : 'var(--red)',
                  borderRadius: 2, transition: 'width 0.8s ease',
                  boxShadow: `0 0 8px ${s > 0.8 ? 'var(--teal)' : 'var(--amber)'}`,
                }}/>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* BBoxes */}
      {boxLines.length > 0 && (
        <div>
          <div style={{ fontFamily: 'var(--font-hud)', fontSize: '0.55rem', letterSpacing: '0.2em', color: 'var(--text-dim)', marginBottom: 8 }}>
            BOUNDING BOXES
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {boxLines.map((line, i) => (
              <div key={i} style={{
                fontFamily: 'var(--font-hud)', fontSize: '0.6rem',
                color: 'var(--text-dim)', background: 'var(--bg3)',
                padding: '6px 10px', borderLeft: '2px solid var(--teal)',
                letterSpacing: '0.05em',
              }}>{line.trim()}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function DetectionPanel() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [threshold, setThreshold] = useState(0.5)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null) // { image, info }
  const [error, setError] = useState(null)
  const [progress, setProgress] = useState('')

  const handleFile = f => {
    setFile(f)
    setResult(null)
    setError(null)
    const url = URL.createObjectURL(f)
    setPreview(url)
  }

  const handleDetect = async () => {
    if (!file) return
    setLoading(true); setError(null); setResult(null)
    setProgress('Connecting to HF Space...')
    
    const startTime = Date.now()
    
    try {
      setProgress('Running inference...')
      const data = await callGradioAPI(file, threshold)
      
      const processingTime = Date.now() - startTime
      
      // data[0] = annotated image (could be {name, data} or base64 string)
      // data[1] = info text
      let imgSrc = null
      const raw = data[0]
      if (raw && typeof raw === 'object' && raw.data) {
        imgSrc = raw.data.startsWith('data:') ? raw.data : `data:image/png;base64,${raw.data}`
      } else if (typeof raw === 'string') {
        imgSrc = raw.startsWith('data:') ? raw : `data:image/png;base64,${raw}`
      } else if (raw && raw.url) {
        imgSrc = raw.url.startsWith('http') ? raw.url : `${HF_SPACE}/file=${raw.url}`
      }
      
      const detectionInfo = parseDetectionInfo(data[1] || '')
      
      // Save to database
      setProgress('Saving to database...')
      const savedDetection = await dbHelpers.saveDetection({
        image_name: file.name,
        image_url: imgSrc,
        image_hash: await generateImageHash(file),
        ship_count: detectionInfo.shipCount,
        confidence_scores: detectionInfo.confidenceScores,
        bounding_boxes: detectionInfo.boundingBoxes,
        processing_time_ms: processingTime,
        confidence_threshold: threshold,
        metadata: {
          file_size: file.size,
          file_type: file.type,
          original_name: file.name
        }
      })
      
      if (savedDetection) {
        console.log('Detection saved to database:', savedDetection.id)
      }
      
      setResult({ image: imgSrc, info: data[1] || '' })
      setProgress('')
    } catch (err) {
      setError(`Detection failed: ${err.message}. Make sure the HF Space is awake (it may take ~30s to wake up on first request).`)
      setProgress('')
    }
    setLoading(false)
  }

  // Generate a simple hash for the image file
  const generateImageHash = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer()
      const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 16)
    } catch (error) {
      console.error('Error generating hash:', error)
      return `${file.name}_${file.size}_${Date.now()}`
    }
  }

  return (
    <section id="detect" style={{ padding: '6rem 2rem', maxWidth: 1100, margin: '0 auto' }}>
      {/* Section header */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ fontFamily: 'var(--font-hud)', fontSize: '0.6rem', letterSpacing: '0.3em', color: 'var(--amber)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 20, height: 1, background: 'var(--amber)', display: 'inline-block' }}/>
          DETECTION CONSOLE
        </div>
        <h2 style={{ fontFamily: 'var(--font-hud)', fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 800, letterSpacing: '-0.01em' }}>
          RUN <span style={{ color: 'var(--teal)' }}>INFERENCE</span>
        </h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Left: Input */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <HUDBox label="INPUT IMAGE" style={{ padding: '1.5rem' }}>
            <UploadZone onFile={handleFile} file={file} preview={preview} />
            {file && (
              <div style={{ marginTop: 10, fontFamily: 'var(--font-hud)', fontSize: '0.55rem', color: 'var(--text-dim)', letterSpacing: '0.1em' }}>
                ▸ {file.name} · {(file.size / 1024).toFixed(1)} KB
              </div>
            )}
          </HUDBox>

          <HUDBox label="PARAMETERS" style={{ padding: '1.5rem' }}>
            <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-hud)', fontSize: '0.6rem', letterSpacing: '0.1em', color: 'var(--text-dim)' }}>
                CONFIDENCE THRESHOLD
              </span>
              <span style={{ fontFamily: 'var(--font-hud)', fontSize: '0.75rem', color: 'var(--teal)' }}>
                {threshold.toFixed(2)}
              </span>
            </div>
            <input type="range" min={0.1} max={0.9} step={0.05} value={threshold}
              onChange={e => setThreshold(parseFloat(e.target.value))}
              style={{
                width: '100%', accentColor: 'var(--teal)',
                cursor: 'pointer', height: 4,
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              <span style={{ fontFamily: 'var(--font-hud)', fontSize: '0.5rem', color: 'var(--text-dim)' }}>0.10</span>
              <span style={{ fontFamily: 'var(--font-hud)', fontSize: '0.5rem', color: 'var(--text-dim)' }}>0.90</span>
            </div>
          </HUDBox>

          <button onClick={handleDetect} disabled={!file || loading}
            style={{
              width: '100%', padding: '1rem',
              background: !file || loading ? 'var(--bg3)' : 'var(--teal)',
              color: !file || loading ? 'var(--text-dim)' : '#020d10',
              border: 'none', cursor: !file || loading ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-hud)', fontSize: '0.75rem', fontWeight: 700,
              letterSpacing: '0.2em',
              clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
              transition: 'all 0.2s',
            }}
          >
            {loading ? `⟳ ${progress || 'PROCESSING...'}` : '▶ DETECT SHIPS'}
          </button>

          {error && (
            <div style={{
              padding: '1rem', background: 'rgba(255,69,69,0.1)',
              border: '1px solid rgba(255,69,69,0.3)', borderRadius: 4,
              fontSize: '0.8rem', color: 'var(--red)', lineHeight: 1.6,
            }}>{error}</div>
          )}
        </div>

        {/* Right: Output */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <HUDBox label="DETECTION RESULT" style={{ padding: '1.5rem', minHeight: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                <div style={{
                  width: 48, height: 48, border: '2px solid var(--border)',
                  borderTopColor: 'var(--teal)', borderRadius: '50%',
                  animation: 'spin-slow 0.8s linear infinite',
                }}/>
                <span style={{ fontFamily: 'var(--font-hud)', fontSize: '0.6rem', color: 'var(--text-dim)', letterSpacing: '0.15em' }}>
                  {progress}
                </span>
              </div>
            ) : result?.image ? (
              <img src={result.image} alt="detection result"
                style={{ maxWidth: '100%', maxHeight: 300, objectFit: 'contain', borderRadius: 2 }}/>
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--text-dim)' }}>
                <div style={{ fontSize: '2rem', marginBottom: 8, opacity: 0.3 }}>🛰️</div>
                <span style={{ fontFamily: 'var(--font-hud)', fontSize: '0.6rem', letterSpacing: '0.15em' }}>
                  AWAITING INPUT
                </span>
              </div>
            )}
          </HUDBox>

          <HUDBox label="ANALYSIS" style={{ padding: '1.5rem', flex: 1 }}>
            {result?.info
              ? <ParsedResults info={result.info} />
              : (
                <div style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-hud)', fontSize: '0.6rem', letterSpacing: '0.1em' }}>
                  — NO DATA —
                </div>
              )
            }
          </HUDBox>
        </div>
      </div>
    </section>
  )
}
