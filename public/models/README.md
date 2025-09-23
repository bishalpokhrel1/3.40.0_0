# Model Setup

This extension uses local AI models for text generation and summarization. Follow these steps to set up the models:

1. Download the required model files from [MediaPipe Model Hub](https://developers.google.com/mediapipe/solutions/text):
   - text_classifier.js
   - text_classifier_bg.wasm
   - gemini-nano-model.tflite
   - gemini-nano-embedding.tflite

2. Place the downloaded files in this directory (`public/models/`).

## Model Details

- **gemini-nano-model.tflite**: Main model for text generation and summarization
- **gemini-nano-embedding.tflite**: Model for text embeddings to enhance context awareness
- **text_classifier.js**: JavaScript wrapper for the MediaPipe text classifier
- **text_classifier_bg.wasm**: WebAssembly binary for the text classifier

## Development

When developing locally:
1. The models will be served from the `public/models/` directory
2. Make sure to include the models in your build process
3. Update the `vite.config.ts` to properly handle the model files

## Production

In production:
1. Models are packaged with the extension
2. Accessed via chrome-extension:// URL
3. Properly declared in manifest.json under web_accessible_resources

## Note

The model files are not included in the repository due to size constraints and licensing. Please download them separately from the MediaPipe Model Hub.