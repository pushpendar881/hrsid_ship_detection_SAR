# SAR Ship Detection using Deep Learning

An AI-powered system for automated ship detection in Synthetic Aperture Radar (SAR) imagery using deep learning and computer vision techniques.

---

## Live Demo

Try the deployed model directly — no setup required:

Hugging Face Space: https://huggingface.co/spaces/PUSHPENDAR/hrsid_ship_detection_SAR

Upload any SAR image and the model will detect and localize ships in real time.

---

## Overview

Synthetic Aperture Radar (SAR) is a satellite-based imaging technology widely used for maritime surveillance, defense monitoring, and environmental observation. Interpreting SAR imagery manually is challenging due to radar speckle noise, varying ship orientations, and complex background reflections.

This project automates ship detection from SAR imagery using a Faster R-CNN deep learning model trained on the HRSID benchmark dataset. The result is a deployable system capable of identifying and localizing ships from raw radar satellite images.

Key capabilities:
- Automatic ship detection in SAR imagery
- Bounding box localization of detected ships
- Visual annotation of detection results
- Interactive web interface for real-time inference

---

## Dataset

The model is trained on the HRSID (High Resolution SAR Image Dataset), a standard benchmark for SAR ship detection research.

- Image Type: High-resolution SAR imagery
- Annotations: Ship bounding boxes in COCO format
- Environments: Diverse maritime and coastal scenarios
- Source: Real-world satellite radar imagery

---

## Model Architecture

The system is built on Faster R-CNN, a two-stage object detection framework.

Stage 1 — Backbone CNN extracts deep visual features from the input SAR image.

Stage 2 — The Region Proposal Network (RPN) scans the feature map and proposes candidate regions likely to contain ships.

Stage 3 — The Detection Head classifies each proposed region and refines the bounding box coordinates to localize ships precisely.

This two-stage approach provides high detection accuracy even under SAR-specific noise conditions.

---

## Tech Stack

Deep Learning: PyTorch, Faster R-CNN

Computer Vision: OpenCV, CNN-based feature extraction

Data Processing: NumPy, Matplotlib

Deployment: Hugging Face Spaces, Gradio

---

## How It Works

1. Upload — User provides a SAR image via the web interface
2. Preprocess — Image is normalized and resized for model input
3. Inference — Faster R-CNN processes the image and predicts ship locations
4. Output — Bounding boxes are drawn around detected ships and returned to the user

---

## Run Locally

Clone the repository:

    git clone https://github.com/pushpendar881/hrsid_ship_detection_SAR
    cd hrsid_ship_detection_SAR

Install dependencies:

    pip install -r requirements.txt

Launch the app:

    python app.py

The Gradio interface will be available at http://localhost:7860

---

## Applications

- Maritime surveillance: Monitor vessel traffic across open seas
- Illegal fishing detection: Identify unauthorized fishing in protected zones
- Naval defense: Track ship movements in strategic areas
- Coastal security: Monitor ports and coastlines
- Environmental monitoring: Track shipping activity near protected ecosystems

---

## Project Structure

    ├── app.py                  # Gradio web application
    ├── model/
    │   └── faster_rcnn.py      # Model definition and loading
    ├── utils/
    │   ├── preprocessing.py    # Image preprocessing utilities
    │   └── visualization.py    # Bounding box drawing utilities
    ├── requirements.txt
    └── README.md

---

## Author

Pushpendar Choudhary
B.Tech — Artificial Intelligence & Data Science

GitHub: https://github.com/pushpendar881
Hugging Face: https://huggingface.co/PUSHPENDAR
LinkedIn: https://www.linkedin.com/in/pushpendar-choudhary

---

If you found this project useful, consider giving it a star on GitHub!
