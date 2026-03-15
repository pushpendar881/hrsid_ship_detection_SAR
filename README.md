# 🚢 ShipSense — SAR Ship Detection Frontend

A production-grade React frontend for the HRSID Faster R-CNN ship detection model,
deployed on HuggingFace Spaces and served through this UI on Render.

## 🏗️ Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Hosting | Render (Static Site) |
| ML Backend | HuggingFace Spaces (Docker + Gradio) |
| Model | Faster R-CNN + ResNet-50 FPN (Detectron2) |
| Dataset | HRSID (9,246 SAR images) |

## ⚡ Performance

| Metric | Score |
|---|---|
| AP @ IoU 0.50 | 73.2% |
| AP @ IoU 0.50:0.95 | 48.9% |
| AP @ IoU 0.75 | 58.2% |
| AP Small | 49.5% |
| AP Medium | 54.7% |

## 🚀 Deploy to Render (Step-by-Step)

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit — ShipSense frontend"
git remote add origin https://github.com/YOUR_USERNAME/shipsense-frontend.git
git push -u origin main
```

### 2. Create Render Static Site
1. Go to [render.com](https://render.com) → **New** → **Static Site**
2. Connect your GitHub repo
3. Set these settings:
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
4. Click **Create Static Site**
5. Render auto-deploys on every push to main ✅

### 3. (Optional) Custom Domain
In Render dashboard → your site → **Settings** → **Custom Domain**

## 🛠️ Local Development

```bash
npm install
npm run dev
# → http://localhost:5173
```

## 📡 API Integration

The frontend calls your HuggingFace Space Gradio API at:
```
POST https://pushpendar-hrsid-ship-detection-sar.hf.space/run/predict
```

**Note:** The HF Space may take ~30 seconds to wake up on first request
(free tier goes to sleep after inactivity). Users will see a loading indicator.

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.jsx          # Fixed nav with live UTC clock
│   ├── Hero.jsx            # Landing section with radar animation
│   ├── DetectionPanel.jsx  # Core upload + inference + results UI
│   ├── ModelInfo.jsx       # Architecture + performance stats
│   ├── About.jsx           # Project description + timeline
│   └── Footer.jsx
├── App.jsx
├── main.jsx
└── index.css               # Global styles + CSS animations
render.yaml                 # Render deployment config
```

## 🔗 Links

- **HF Space:** https://huggingface.co/spaces/PUSHPENDAR/hrsid_ship_detection_SAR
- **Model Repo:** https://huggingface.co/PUSHPENDAR/hrsid-ship-detection
