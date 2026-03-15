# SAR Sample Images

This directory should contain sample SAR images for the gallery display.

## Required Images:

1. `sar-sample-1.jpg` - Coastal SAR image showing ships near coastline
2. `sar-sample-2.jpg` - Open ocean SAR image with multiple vessels
3. `sar-sample-3.jpg` - Port area SAR image with dense ship traffic
4. `sar-sample-4.jpg` - SAR image demonstrating weather-independent capability

## Image Specifications:

- **Format**: JPG or PNG
- **Size**: Recommended 400x300 pixels minimum
- **Content**: Actual SAR imagery from your HRSID dataset or similar
- **Quality**: High contrast, grayscale SAR images work best

## How to Add Images:

1. Place your SAR images in this directory with the exact filenames listed above
2. The component will automatically use these images instead of the fallback placeholder images
3. Images should demonstrate different maritime scenarios and SAR capabilities

## Fallback Behavior:

If the actual SAR images are not found, the component will automatically fall back to placeholder images with SAR-like styling (grayscale filter and contrast enhancement).

## Tips for Best Results:

- Use actual SAR images from your training dataset
- Ensure images clearly show ship signatures
- Include variety: coastal, open ocean, port areas, different weather conditions
- Consider adding detection overlays or annotations to highlight ship locations