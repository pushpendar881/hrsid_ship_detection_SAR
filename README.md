# HRSID Ship Detection SAR - Frontend

A React-based frontend for the HRSID Ship Detection system using synthetic aperture radar (SAR) imagery.

## 🚀 Features

- **Real-time Ship Detection**: Upload SAR images and get instant detection results
- **HUD-Style Interface**: Professional maritime surveillance interface design
- **Performance Metrics**: Display actual model performance (63% AP@0.5)
- **Responsive Design**: Works on desktop and mobile devices

## 🏗️ Architecture

- **Model**: Faster R-CNN with ResNet-50 backbone + FPN
- **Framework**: Detectron2
- **Dataset**: HRSID (High-Resolution SAR Images Dataset)
- **Training Data**: 9,246 total images (2,914 train + 728 val + 5,604 test)
- **Performance**: 63.0% AP@0.5, 45.3% AP@0.75

## 🛠️ Tech Stack

- **Frontend**: React + Vite
- **Styling**: CSS-in-JS with custom design system
- **API**: Gradio backend integration
- **Deployment**: Ready for Vercel/Netlify

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🎯 Usage

1. Start the development server: `npm run dev`
2. Open http://localhost:5173 in your browser
3. Upload a SAR image in the Detection Console
4. Adjust confidence threshold (0.1 - 0.9)
5. Click "DETECT SHIPS" to run inference
6. View results with bounding boxes and confidence scores

## 📁 Project Structure

```
src/
├── components/
│   ├── About.jsx          # About section
│   ├── DetectionPanel.jsx # Main detection interface
│   ├── Footer.jsx         # Footer component
│   ├── Hero.jsx           # Landing hero section
│   ├── ModelInfo.jsx      # Technical specifications
│   └── Navbar.jsx         # Navigation header
├── App.jsx                # Main app component
├── main.jsx              # Entry point
└── index.css             # Global styles & design system
```

## 🎨 Design System

The interface uses a HUD-style design with:
- **Colors**: Dark theme with teal (#00e5c8) and amber (#ffb454) accents
- **Typography**: Inter for UI text, JetBrains Mono for technical elements
- **Layout**: Grid-based responsive design
- **Components**: Custom HUD boxes with technical styling

## 🔗 API Integration

The frontend connects to a Gradio backend at:
```
https://pushpendar-hrsid-ship-detection-sar.hf.space
```

## 📊 Model Performance

- **AP@0.5**: 63.0%
- **AP@0.75**: 45.3%
- **Training Iterations**: 5,000
- **Inference Time**: <1.5s
- **GPU**: Tesla T4

## 🚀 Deployment

The app is ready for deployment on:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting service

## 📝 License

This project is part of the HRSID Ship Detection research.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

Built with ❤️ for maritime surveillance and SAR image analysis.