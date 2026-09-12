import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'

const wigCatalog = {
  straight: {
    name: 'Bone Straight',
    tone: 'Sleek and polished',
    reason: 'A clean silhouette creates balance and a refined finish.',
    color: '#f5dfe9',
  },
  curly: {
    name: 'Curly Glam',
    tone: 'Full and playful',
    reason: 'Volume softens the face and creates a fresh glam profile.',
    color: '#f0d3e5',
  },
  bob: {
    name: 'Classic Bob',
    tone: 'Structured and modern',
    reason: 'A sharp frame complements balanced facial structure beautifully.',
    color: '#efdeeb',
  },
  wave: {
    name: 'Luxury Waves',
    tone: 'Soft and elegant',
    reason: 'Gentle movement and depth create a graceful premium look.',
    color: '#e6d2e0',
  },
}

function escapeSvg(svg) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

function makeWigSvg(type, color) {
  const shapes = {
    straight: `
      <path d="M66 25 C90 12, 130 10, 152 25 L175 146 C181 183, 181 220, 160 260 L146 306 L89 306 L73 253 C39 223, 30 185, 38 146 Z" fill="${color}" opacity="0.95"/>
      <path d="M84 48 L100 18 L125 18 L140 48" stroke="#ffffff" stroke-width="8" fill="none" stroke-linecap="round"/>
      <path d="M60 130 L170 130" stroke="#ffffff" stroke-width="10" opacity="0.6"/>
      <path d="M80 170 C96 162, 126 162, 144 170" stroke="#ffffff" stroke-width="8" fill="none" opacity="0.5"/>
    `,
    curly: `
      <path d="M52 40 C72 22, 92 18, 110 24 C121 28, 136 25, 146 38 C164 60, 172 86, 169 118 C166 150, 165 203, 154 236 C140 278, 110 303, 82 292 C57 282, 52 244, 50 215 C48 190, 44 161, 40 130 C35 97, 36 67, 52 40 Z" fill="${color}" opacity="0.96"/>
      <circle cx="81" cy="86" r="18" fill="#fff" opacity="0.35"/>
      <circle cx="124" cy="92" r="22" fill="#fff" opacity="0.28"/>
      <circle cx="102" cy="140" r="16" fill="#fff" opacity="0.3"/>
      <circle cx="83" cy="188" r="19" fill="#fff" opacity="0.25"/>
      <circle cx="122" cy="192" r="18" fill="#fff" opacity="0.22"/>
    `,
    bob: `
      <path d="M54 53 C82 32, 135 33, 159 59 L173 152 C180 183, 175 234, 154 263 L121 292 L80 292 L58 260 C36 229, 31 183, 38 152 Z" fill="${color}" opacity="0.96"/>
      <path d="M57 109 L162 109" stroke="#ffffff" stroke-width="8" opacity="0.6"/>
      <path d="M88 58 L118 58" stroke="#ffffff" stroke-width="8" opacity="0.7"/>
      <path d="M70 210 C90 223, 113 223, 136 210" stroke="#ffffff" stroke-width="8" fill="none" opacity="0.5"/>
    `,
    wave: `
      <path d="M48 62 C70 40, 87 34, 108 42 C127 48, 150 49, 171 61 C177 104, 179 151, 167 193 C156 234, 140 275, 104 296 C76 296, 52 278, 46 249 C37 214, 40 168, 36 125 C33 99, 38 79, 48 62 Z" fill="${color}" opacity="0.96"/>
      <path d="M62 90 C94 72, 130 72, 159 94" stroke="#ffffff" stroke-width="9" fill="none" opacity="0.5"/>
      <path d="M56 140 C88 120, 124 123, 169 146" stroke="#ffffff" stroke-width="9" fill="none" opacity="0.45"/>
      <path d="M58 196 C92 176, 123 179, 162 201" stroke="#ffffff" stroke-width="9" fill="none" opacity="0.4"/>
    `,
  }

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 320">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <rect width="220" height="320" fill="transparent"/>
      <path d="M35 20 L185 20 L195 290 L25 290 Z" fill="url(#g)" opacity="0.2"/>
      ${shapes[type] || shapes.straight}
    </svg>
  `

  return escapeSvg(svg)
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function App() {
  const [activeWig, setActiveWig] = useState('straight')
  const [customWig, setCustomWig] = useState('')
  const [wigSize, setWigSize] = useState(90)
  const [wigX, setWigX] = useState(0)
  const [wigY, setWigY] = useState(-20)
  const [photoUrl, setPhotoUrl] = useState('')
  const [cameraActive, setCameraActive] = useState(false)
  const [cameraError, setCameraError] = useState('')
  const [faceShape, setFaceShape] = useState('balanced')
  const [cartCount, setCartCount] = useState(0)
  const videoRef = useRef(null)
  const streamRef = useRef(null)

  const recommendation = useMemo(() => {
    if (faceShape === 'oval') return { key: 'straight', title: 'Bone Straight', message: 'Clean elegance and balance feel especially flattering on an oval face.' }
    if (faceShape === 'round') return { key: 'curly', title: 'Curly Glam', message: 'Added volume softens the silhouette and creates a more lifted look.' }
    if (faceShape === 'square') return { key: 'wave', title: 'Luxury Waves', message: 'Soft movement helps soften the jawline and keep the frame graceful.' }
    return { key: 'bob', title: 'Classic Bob', message: 'Structured lines imitate a polished, editorial finish.' }
  }, [faceShape])

  const analysis = useMemo(() => {
    const score = clamp(
      Math.round((100 - Math.abs(wigSize - 90) * 1.5 + 100 - (Math.abs(wigX) * 0.35 + Math.abs(wigY) * 0.25) + 88) / 3),
      0,
      100,
    )

    const detail =
      score >= 90
        ? 'Excellent fit — the wig is well balanced and aligned.'
        : score >= 80
          ? 'Good fit — a small adjustment will make it feel even more natural.'
          : score >= 70
            ? 'Fair fit — a few positioning tweaks will improve the silhouette.'
            : 'Needs adjustment — refine size and center alignment.'

    return { score, detail }
  }, [wigSize, wigX, wigY])

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop())
    }
  }, [])

  useEffect(() => {
    const scriptId = 'face-api-script'
    const existing = document.getElementById(scriptId)

    if (existing) return

    const js = document.createElement('script')
    js.id = scriptId
    js.src = 'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js'
    js.async = true
    document.body.appendChild(js)

    js.onload = () => {
      const weightScript = document.createElement('script')
      weightScript.src = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.20.0/dist/tf.min.js'
      weightScript.async = true
      document.body.appendChild(weightScript)
    }
  }, [])

  useEffect(() => {
    if (!photoUrl || typeof window === 'undefined' || typeof window.faceapi === 'undefined') return

    const run = async () => {
      try {
        await Promise.all([
          window.faceapi.nets.tinyFaceDetector.loadFromUri('https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/weights'),
          window.faceapi.nets.faceLandmark68Net.loadFromUri('https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/weights'),
        ])

        const img = document.getElementById('portrait-image')
        if (!img) return

        const detection = await window.faceapi
          .detectSingleFace(img, new window.faceapi.TinyFaceDetectorOptions({ inputSize: 416, scoreThreshold: 0.5 }))
          .withFaceLandmarks()

        if (detection) {
          const width = detection.detection.box.width
          const height = detection.detection.box.height
          const ratio = width / height

          if (ratio > 1.3) setFaceShape('oval')
          else if (ratio < 1.05) setFaceShape('round')
          else if (ratio < 1.2) setFaceShape('square')
          else setFaceShape('balanced')
        }
      } catch (error) {
        console.warn('Face analysis unavailable in this environment.', error)
      }
    }

    run()
  }, [photoUrl])

  const wigImage = customWig || makeWigSvg(activeWig, wigCatalog[activeWig]?.color || '#f4dfe8')

  const handlePhotoUpload = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setPhotoUrl(url)
  }

  const handleCustomWig = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setCustomWig(url)
    setActiveWig('straight')
  }

  const toggleCamera = async () => {
    if (cameraActive) {
      streamRef.current?.getTracks().forEach((track) => track.stop())
      streamRef.current = null
      if (videoRef.current) videoRef.current.srcObject = null
      setCameraActive(false)
      return
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError('Live camera is not supported in this browser.')
      return
    }

    try {
      setCameraError('')
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false })
      streamRef.current = stream
      if (videoRef.current) videoRef.current.srcObject = stream
      setCameraActive(true)
    } catch {
      setCameraError('Camera access was blocked. Allow camera permission and try again.')
    }
  }

  const resetControls = () => {
    setWigSize(90)
    setWigX(0)
    setWigY(-20)
  }

  const applyRecommendation = () => {
    setActiveWig(recommendation.key)
    setCustomWig('')
  }

  const shopThisWig = () => {
    setCartCount((count) => count + 1)
  }

  const activeStyle = wigCatalog[activeWig] || wigCatalog.straight
  const shopButtonLabel = cartCount > 0 ? 'Added to bag ✓' : 'Shop This Wig 🛍️'

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">MGV</span> TOUCH
        </div>
        <nav>
          <a href="#tryon">Try-On</a>
          <a href="#styles">Styles</a>
          <a href="#beauty-tech">Beauty Tech</a>
        </nav>
        <div className="cart-pill" aria-live="polite">Bag {cartCount}</div>
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-copy">
            <p className="eyebrow">SMART BEAUTY TECHNOLOGY</p>
            <h1>Find the wig that <span>fits you.</span></h1>
            <p className="lead">Try on premium styles, get AI-led matching insights, and shop with confidence.</p>
            <div className="hero-actions">
              <a href="#tryon" className="primary-cta">Try a wig now ✨</a>
              <span className="micro-note">Free virtual fitting • Beauty-approved</span>
            </div>
          </div>

          <div className="hero-metrics" aria-label="Brand metrics">
            <div className="metric-card">
              <strong>4.9/5</strong>
              <span>Beauty rating</span>
            </div>
            <div className="metric-card">
              <strong>120+</strong>
              <span>Styles matched</span>
            </div>
            <div className="metric-card">
              <strong>2 min</strong>
              <span>Average fit check</span>
            </div>
          </div>
        </section>

        <section id="tryon" className="studio">
          <div className="panel controls-panel">
            <div className="panel-block">
              <h3>1. Upload your photo</h3>
              <label className="upload-box" htmlFor="photo-upload">
                <input id="photo-upload" type="file" accept="image/*" onChange={handlePhotoUpload} />
                <span>📸</span>
                <strong>Upload Photo</strong>
                <small>JPG or PNG</small>
              </label>
            </div>

            <div className="panel-block">
              <h3>2. Upload your wig</h3>
              <label className="upload-box" htmlFor="wig-upload">
                <input id="wig-upload" type="file" accept="image/*" onChange={handleCustomWig} />
                <span>💇‍♀️</span>
                <strong>Upload Wig Image</strong>
                <small>Transparent PNG works best</small>
              </label>
            </div>

            <div className="panel-block">
              <h3>3. Choose a wig</h3>
              <div className="wig-grid">
                {Object.entries(wigCatalog).map(([key, value]) => (
                  <button
                    key={key}
                    type="button"
                    className={`wig-button ${activeWig === key ? 'active' : ''}`}
                    onClick={() => {
                      setActiveWig(key)
                      setCustomWig('')
                    }}
                  >
                    {value.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="panel-block">
              <h3>4. Adjust wig</h3>
              <label>Wig Size</label>
              <input type="range" min="40" max="140" value={wigSize} onChange={(e) => setWigSize(Number(e.target.value))} />

              <label>Move Left / Right</label>
              <input type="range" min="-150" max="150" value={wigX} onChange={(e) => setWigX(Number(e.target.value))} />

              <label>Move Up / Down</label>
              <input type="range" min="-150" max="150" value={wigY} onChange={(e) => setWigY(Number(e.target.value))} />
            </div>

            <div className="fit-panel">
              <div className="fit-header">
                <h3>AI Fit Analysis</h3>
                <span className="fit-badge">Live</span>
              </div>
              <div className="fit-meter" style={{ '--score': analysis.score }}>
                <span>{analysis.score}%</span>
              </div>
              <p className="fit-detail">{analysis.detail}</p>
              <ul className="fit-suggestions">
                <li>Upload a front-facing portrait for best precision.</li>
                <li>Keep the wig centered for a more natural silhouette.</li>
                <li>Use the recommendation panel to find the strongest match.</li>
              </ul>
            </div>

            <div className="recommendation-panel">
              <div className="recommendation-header">
                <h3>Best match</h3>
                <span className="recommendation-tag">AI Pick</span>
              </div>
              <h4>{recommendation.title}</h4>
              <p>{recommendation.message}</p>
              <div className="match-badges">
                <span>Natural finish</span>
                <span>Soft framing</span>
                <span>Premium blend</span>
              </div>
              <button type="button" className="apply-button" onClick={applyRecommendation}>Apply Recommendation</button>
            </div>

            <div className="action-row">
              <button type="button" className="secondary-button" onClick={resetControls}>Reset</button>
              <button type="button" className="primary-button" onClick={shopThisWig}>{shopButtonLabel}</button>
            </div>
            <div className="mini-summary">
              <span>{activeStyle.name}</span>
              <strong>${customWig ? '149' : '129'}.00</strong>
            </div>
          </div>

          <div className="mirror-panel">
            <div className="mirror-stage">
              {cameraActive && (
                <video ref={videoRef} className="camera-feed" autoPlay muted playsInline />
              )}

              {!photoUrl && !cameraActive && (
                <div className="placeholder">
                  <div className="camera-icon">📷</div>
                  <h3>Your virtual mirror</h3>
                  <p>Start the live mirror or upload a photo to begin.</p>
                  <button type="button" className="camera-button" onClick={toggleCamera}>Start Live Mirror</button>
                  {cameraError && <small className="camera-error">{cameraError}</small>}
                </div>
              )}

              {photoUrl && (
                <img
                  id="portrait-image"
                  className="user-photo"
                  src={photoUrl}
                  alt="User portrait"
                  style={{ display: 'block' }}
                />
              )}

              <img
                className="wig-overlay"
                src={wigImage}
                alt="Virtual wig preview"
                style={{
                  width: `${wigSize}%`,
                  transform: `translate(${wigX}px, ${wigY}px)`,
                  display: photoUrl || cameraActive ? 'block' : 'none',
                }}
              />

              {(photoUrl || cameraActive) && (
                <button type="button" className="camera-toggle" onClick={toggleCamera}>
                  {cameraActive ? 'Stop Live Mirror' : 'Start Live Mirror'}
                </button>
              )}
              {cameraError && <div className="camera-error stage-error">{cameraError}</div>}
              <div className="mirror-label">MGV TOUCH • VIRTUAL TRY-ON</div>
            </div>
          </div>
        </section>

        <section id="styles" className="collection-section">
          <div className="section-heading">
            <p>OUR COLLECTION</p>
            <h2>Explore wig styles</h2>
          </div>

          <div className="card-grid">
            {Object.entries(wigCatalog).map(([key, value]) => (
              <button
                key={key}
                type="button"
                className="style-card"
                onClick={() => {
                  setActiveWig(key)
                  setCustomWig('')
                }}
              >
                <div className="card-art" style={{ background: value.color }}>
                  <img src={makeWigSvg(key, value.color)} alt={value.name} />
                </div>
                <h3>{value.name}</h3>
                <p>{value.tone}</p>
              </button>
            ))}
          </div>
        </section>

        <section id="beauty-tech" className="feature-section">
          <h2>Beauty meets technology</h2>
          <p>
            MGV Touch transforms virtual styling into a smart recommendation experience: a premium AI-assisted mirror that helps customers choose the right wig with confidence.
          </p>
        </section>
      </main>

      <footer>
        <div className="brand footer-brand">
          <span className="brand-mark">MGV</span> TOUCH
        </div>
        <p>Empowering confidence through style & beauty</p>
        <small>© 2026 MGV Touch Hair Wigs</small>
      </footer>
    </div>
  )
}

export default App
