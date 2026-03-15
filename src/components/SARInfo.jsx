import React, { useState } from 'react'

// Sample SAR images - replace these with actual SAR images from your dataset
const sarImages = [
  {
    id: 1,
    src: '/images/sar-sample-1.jpg', // You can replace with actual SAR images
    title: 'Coastal SAR Image',
    description: 'Ships detected near coastline with high resolution SAR imaging',
    fallback: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=300&fit=crop&sat=-100&con=50'
  },
  {
    id: 2,
    src: '/images/sar-sample-2.jpg',
    title: 'Open Ocean SAR',
    description: 'Multiple vessels detected in open water conditions',
    fallback: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&sat=-100&con=50'
  },
  {
    id: 3,
    src: '/images/sar-sample-3.jpg',
    title: 'Port Area SAR',
    description: 'Dense ship traffic in port environment with clear SAR signatures',
    fallback: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop&sat=-100&con=50'
  },
  {
    id: 4,
    src: '/images/sar-sample-4.jpg',
    title: 'Weather Independent',
    description: 'SAR imaging through clouds and adverse weather conditions',
    fallback: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&sat=-100&con=50'
  }
]

function ImageGallery() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [imageErrors, setImageErrors] = useState({})

  const handleImageError = (imageId, fallbackSrc) => {
    setImageErrors(prev => ({ ...prev, [imageId]: fallbackSrc }))
  }

  const getImageSrc = (image) => {
    return imageErrors[image.id] || image.src || image.fallback
  }

  return (
    <div>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {sarImages.map((image) => (
          <div 
            key={image.id}
            onClick={() => setSelectedImage(image)}
            style={{ 
              border: '1px solid var(--border)', 
              borderRadius: 4,
              background: 'var(--bg3)', 
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--teal)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <div style={{ 
              height: 200, 
              position: 'relative',
              overflow: 'hidden'
            }}>
              <img 
                src={getImageSrc(image)}
                alt={image.title}
                onError={() => handleImageError(image.id, image.fallback)}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'grayscale(70%) contrast(1.2)', // SAR-like appearance
                }}
              />
              <div style={{
                position: 'absolute',
                top: 8,
                right: 8,
                background: 'rgba(0, 229, 200, 0.9)',
                color: '#020d10',
                padding: '4px 8px',
                borderRadius: 2,
                fontFamily: 'var(--font-hud)',
                fontSize: '0.6rem',
                fontWeight: 700,
                letterSpacing: '0.1em'
              }}>
                SAR
              </div>
              {/* Overlay to simulate SAR data characteristics */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '30%',
                background: 'linear-gradient(transparent, rgba(0, 229, 200, 0.1))',
                pointerEvents: 'none'
              }} />
            </div>
            <div style={{ padding: '1rem' }}>
              <h4 style={{ 
                fontFamily: 'var(--font-hud)', 
                fontSize: '0.8rem', 
                color: 'var(--teal)',
                marginBottom: '0.5rem',
                letterSpacing: '0.05em'
              }}>
                {image.title}
              </h4>
              <p style={{ 
                fontSize: '0.85rem', 
                color: 'var(--text-dim)', 
                lineHeight: 1.4,
                margin: 0
              }}>
                {image.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for enlarged image */}
      {selectedImage && (
        <div 
          onClick={() => setSelectedImage(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            cursor: 'pointer'
          }}
        >
          <div style={{
            maxWidth: '90vw',
            maxHeight: '90vh',
            background: 'var(--bg2)',
            border: '1px solid var(--border)',
            borderRadius: 4,
            overflow: 'hidden'
          }}>
            <img 
              src={getImageSrc(selectedImage)} 
              alt={selectedImage.title}
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '70vh',
                objectFit: 'contain',
                filter: 'grayscale(70%) contrast(1.2)'
              }}
            />
            <div style={{ padding: '1rem' }}>
              <h3 style={{ 
                fontFamily: 'var(--font-hud)', 
                color: 'var(--teal)',
                marginBottom: '0.5rem'
              }}>
                {selectedImage.title}
              </h3>
              <p style={{ color: 'var(--text-dim)', margin: 0 }}>
                {selectedImage.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function SARInfo() {
  return (
    <section style={{ 
      padding: '6rem 2rem',
      background: 'var(--bg)',
      borderTop: '1px solid var(--border)'
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ marginBottom: '4rem' }}>
          <div style={{ 
            fontFamily: 'var(--font-hud)', 
            fontSize: '0.6rem', 
            letterSpacing: '0.3em', 
            color: 'var(--amber)', 
            marginBottom: 12, 
            display: 'flex', 
            alignItems: 'center', 
            gap: 10 
          }}>
            <span style={{ width: 20, height: 1, background: 'var(--amber)', display: 'inline-block' }}/>
            SYNTHETIC APERTURE RADAR
          </div>
          <h2 style={{ 
            fontFamily: 'var(--font-hud)', 
            fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', 
            fontWeight: 800, 
            letterSpacing: '-0.01em',
            marginBottom: '2rem'
          }}>
            WHAT IS <span style={{ color: 'var(--teal)' }}>SAR?</span>
          </h2>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '4rem',
          alignItems: 'start',
          marginBottom: '4rem'
        }}>
          <div>
            <p style={{ 
              fontSize: '1.1rem', 
              color: 'var(--text-dim)', 
              lineHeight: 1.8,
              marginBottom: '2rem'
            }}>
              Synthetic Aperture Radar (SAR) is a form of radar that uses the motion of the radar antenna over a target region to provide finer spatial resolution than conventional beam-scanning radars.
            </p>
            
            <p style={{ 
              fontSize: '1rem', 
              color: 'var(--text-dim)', 
              lineHeight: 1.7,
              marginBottom: '2rem'
            }}>
              SAR systems can operate day and night and penetrate through clouds, smoke, and light rain, making them ideal for maritime surveillance and ship detection applications.
            </p>

            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '1rem' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ 
                  width: 8, 
                  height: 8, 
                  background: 'var(--teal)', 
                  borderRadius: '50%' 
                }}/>
                <span style={{ 
                  fontFamily: 'var(--font-hud)', 
                  fontSize: '0.8rem', 
                  color: 'var(--text)',
                  letterSpacing: '0.05em'
                }}>
                  All-weather imaging capability
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ 
                  width: 8, 
                  height: 8, 
                  background: 'var(--teal)', 
                  borderRadius: '50%' 
                }}/>
                <span style={{ 
                  fontFamily: 'var(--font-hud)', 
                  fontSize: '0.8rem', 
                  color: 'var(--text)',
                  letterSpacing: '0.05em'
                }}>
                  Day and night operation
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ 
                  width: 8, 
                  height: 8, 
                  background: 'var(--teal)', 
                  borderRadius: '50%' 
                }}/>
                <span style={{ 
                  fontFamily: 'var(--font-hud)', 
                  fontSize: '0.8rem', 
                  color: 'var(--text)',
                  letterSpacing: '0.05em'
                }}>
                  High-resolution surface imaging
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ 
                  width: 8, 
                  height: 8, 
                  background: 'var(--teal)', 
                  borderRadius: '50%' 
                }}/>
                <span style={{ 
                  fontFamily: 'var(--font-hud)', 
                  fontSize: '0.8rem', 
                  color: 'var(--text)',
                  letterSpacing: '0.05em'
                }}>
                  Penetrates clouds and weather
                </span>
              </div>
            </div>
          </div>

          <div style={{ 
            border: '1px solid var(--border)', 
            borderRadius: 4,
            background: 'var(--bg2)', 
            padding: '2rem',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute', 
              top: -10, 
              left: 16,
              fontFamily: 'var(--font-hud)', 
              fontSize: '0.55rem',
              letterSpacing: '0.2em', 
              color: 'var(--teal)',
              background: 'var(--bg2)', 
              padding: '0 8px'
            }}>
              SAR ADVANTAGES
            </div>
            
            <div style={{ 
              marginTop: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem'
            }}>
              <div>
                <div style={{ 
                  fontFamily: 'var(--font-hud)', 
                  fontSize: '0.7rem', 
                  color: 'var(--amber)',
                  letterSpacing: '0.1em',
                  marginBottom: '0.5rem'
                }}>
                  WEATHER INDEPENDENCE
                </div>
                <p style={{ 
                  fontSize: '0.85rem', 
                  color: 'var(--text-dim)', 
                  lineHeight: 1.5,
                  margin: 0
                }}>
                  Unlike optical sensors, SAR can image through clouds, fog, and precipitation
                </p>
              </div>
              
              <div>
                <div style={{ 
                  fontFamily: 'var(--font-hud)', 
                  fontSize: '0.7rem', 
                  color: 'var(--amber)',
                  letterSpacing: '0.1em',
                  marginBottom: '0.5rem'
                }}>
                  24/7 OPERATION
                </div>
                <p style={{ 
                  fontSize: '0.85rem', 
                  color: 'var(--text-dim)', 
                  lineHeight: 1.5,
                  margin: 0
                }}>
                  Active radar system works day and night without external illumination
                </p>
              </div>
              
              <div>
                <div style={{ 
                  fontFamily: 'var(--font-hud)', 
                  fontSize: '0.7rem', 
                  color: 'var(--amber)',
                  letterSpacing: '0.1em',
                  marginBottom: '0.5rem'
                }}>
                  HIGH RESOLUTION
                </div>
                <p style={{ 
                  fontSize: '0.85rem', 
                  color: 'var(--text-dim)', 
                  lineHeight: 1.5,
                  margin: 0
                }}>
                  Synthetic aperture technique provides meter-level resolution from space
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SAR Image Gallery */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ 
            fontFamily: 'var(--font-hud)', 
            fontSize: '0.6rem', 
            letterSpacing: '0.3em', 
            color: 'var(--amber)', 
            marginBottom: 12, 
            display: 'flex', 
            alignItems: 'center', 
            gap: 10 
          }}>
            <span style={{ width: 20, height: 1, background: 'var(--amber)', display: 'inline-block' }}/>
            SAMPLE SAR IMAGERY
          </div>
          <h3 style={{ 
            fontFamily: 'var(--font-hud)', 
            fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)', 
            fontWeight: 800, 
            letterSpacing: '-0.01em',
            marginBottom: '2rem'
          }}>
            SAR IMAGE <span style={{ color: 'var(--teal)' }}>GALLERY</span>
          </h3>
          <p style={{ 
            fontSize: '1rem', 
            color: 'var(--text-dim)', 
            lineHeight: 1.6,
            marginBottom: '2rem',
            maxWidth: 800
          }}>
            Explore sample SAR images showing various maritime scenarios. These images demonstrate the capability of SAR sensors to detect ships in different environmental conditions and locations.
          </p>
        </div>

        <ImageGallery />

        {/* Technical Specifications */}
        <div style={{ 
          marginTop: '4rem',
          border: '1px solid var(--border)', 
          borderRadius: 4,
          background: 'var(--bg2)', 
          padding: '2rem',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute', 
            top: -10, 
            left: 16,
            fontFamily: 'var(--font-hud)', 
            fontSize: '0.55rem',
            letterSpacing: '0.2em', 
            color: 'var(--teal)',
            background: 'var(--bg2)', 
            padding: '0 8px'
          }}>
            HRSID DATASET SPECIFICATIONS
          </div>
          
          <div style={{ 
            marginTop: '1rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontFamily: 'var(--font-hud)', 
                fontSize: '1.5rem', 
                color: 'var(--teal)',
                fontWeight: 700,
                marginBottom: '0.5rem'
              }}>9,246</div>
              <div style={{ 
                fontFamily: 'var(--font-hud)', 
                fontSize: '0.6rem', 
                color: 'var(--text-dim)',
                letterSpacing: '0.1em'
              }}>TOTAL IMAGES</div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontFamily: 'var(--font-hud)', 
                fontSize: '1.5rem', 
                color: 'var(--amber)',
                fontWeight: 700,
                marginBottom: '0.5rem'
              }}>800×800</div>
              <div style={{ 
                fontFamily: 'var(--font-hud)', 
                fontSize: '0.6rem', 
                color: 'var(--text-dim)',
                letterSpacing: '0.1em'
              }}>PIXEL RESOLUTION</div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontFamily: 'var(--font-hud)', 
                fontSize: '1.5rem', 
                color: 'var(--teal)',
                fontWeight: 700,
                marginBottom: '0.5rem'
              }}>C-Band</div>
              <div style={{ 
                fontFamily: 'var(--font-hud)', 
                fontSize: '0.6rem', 
                color: 'var(--text-dim)',
                letterSpacing: '0.1em'
              }}>RADAR FREQUENCY</div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontFamily: 'var(--font-hud)', 
                fontSize: '1.5rem', 
                color: 'var(--amber)',
                fontWeight: 700,
                marginBottom: '0.5rem'
              }}>1-3m</div>
              <div style={{ 
                fontFamily: 'var(--font-hud)', 
                fontSize: '0.6rem', 
                color: 'var(--text-dim)',
                letterSpacing: '0.1em'
              }}>SPATIAL RESOLUTION</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}