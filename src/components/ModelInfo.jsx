import React from 'react'

export default function ModelInfo() {
    return (
        <section style={{
            padding: '6rem 2rem',
            background: 'var(--bg2)',
            borderTop: '1px solid var(--border)',
            borderBottom: '1px solid var(--border)'
        }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                <div style={{ marginBottom: '3rem' }}>
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
                        <span style={{ width: 20, height: 1, background: 'var(--amber)', display: 'inline-block' }} />
                        MODEL SPECIFICATIONS
                    </div>
                    <h2 style={{
                        fontFamily: 'var(--font-hud)',
                        fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
                        fontWeight: 800,
                        letterSpacing: '-0.01em'
                    }}>
                        TECHNICAL <span style={{ color: 'var(--teal)' }}>OVERVIEW</span>
                    </h2>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '2rem'
                }}>
                    <div style={{
                        border: '1px solid var(--border)',
                        borderRadius: 4,
                        background: 'var(--bg3)',
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
                            background: 'var(--bg3)',
                            padding: '0 8px'
                        }}>
                            ARCHITECTURE
                        </div>
                        <div style={{ marginTop: '1rem' }}>
                            <div style={{
                                fontFamily: 'var(--font-hud)',
                                fontSize: '0.8rem',
                                color: 'var(--text)',
                                marginBottom: '0.5rem'
                            }}>
                                Faster R-CNN + ResNet-50 FPN
                            </div>
                            <p style={{
                                fontSize: '0.9rem',
                                color: 'var(--text-dim)',
                                lineHeight: 1.6
                            }}>
                                Detectron2-based Faster R-CNN with ResNet-50 backbone and Feature Pyramid Network, fine-tuned specifically for SAR ship detection on HRSID dataset.
                            </p>
                        </div>
                    </div>

                    <div style={{
                        border: '1px solid var(--border)',
                        borderRadius: 4,
                        background: 'var(--bg3)',
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
                            background: 'var(--bg3)',
                            padding: '0 8px'
                        }}>
                            TRAINING DATA
                        </div>
                        <div style={{ marginTop: '1rem' }}>
                            <div style={{
                                fontFamily: 'var(--font-hud)',
                                fontSize: '0.8rem',
                                color: 'var(--text)',
                                marginBottom: '0.5rem'
                            }}>
                                9.2K+ HRSID SAR Images
                            </div>
                            <p style={{
                                fontSize: '0.9rem',
                                color: 'var(--text-dim)',
                                lineHeight: 1.6
                            }}>
                                Trained on High-Resolution SAR Images Dataset (HRSID) with 2,914 training images, 728 validation images, and 5,604 test images from various maritime scenarios.
                            </p>
                        </div>
                    </div>

                    <div style={{
                        border: '1px solid var(--border)',
                        borderRadius: 4,
                        background: 'var(--bg3)',
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
                            background: 'var(--bg3)',
                            padding: '0 8px'
                        }}>
                            PERFORMANCE
                        </div>
                        <div style={{ marginTop: '1rem' }}>
                            <div style={{
                                fontFamily: 'var(--font-hud)',
                                fontSize: '0.8rem',
                                color: 'var(--text)',
                                marginBottom: '0.5rem'
                            }}>
                                AP@0.5: 63.0% | AP@0.75: 45.3%
                            </div>
                            <p style={{
                                fontSize: '0.9rem',
                                color: 'var(--text-dim)',
                                lineHeight: 1.6
                            }}>
                                Evaluated on HRSID validation set with 5,000 training iterations. Model achieves strong performance across different ship sizes and maritime conditions.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}