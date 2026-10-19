# Third-party components and references

- **MediaPipe Tasks Vision 0.10.32**, Google, Apache-2.0. Downloaded from the official npm registry by `scripts/setup.py`. Package license is retained in `vendor/vision` when present. [Repository](https://github.com/google-ai-edge/mediapipe), [license](https://github.com/google-ai-edge/mediapipe/blob/master/LICENSE).
- **Three.js 0.180.0**, Three.js authors, MIT. Package license retained under `vendor/three/LICENSE`. [Repository](https://github.com/mrdoob/three.js).
- **Hand Landmarker model**, Google's versioned float16 model, downloaded from `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`. The model is not committed or relicensed by this repository. [Official task documentation and model information](https://ai.google.dev/edge/mediapipe/solutions/vision/hand_landmarker).
- **woman_hands.jpg**, the external example photograph used by the [official MediaPipe Python notebook](https://github.com/google-ai-edge/mediapipe-samples/blob/main/examples/hand_landmarker/python/hand_landmarker.ipynb). Download URL: `https://storage.googleapis.com/mediapipe-tasks/hand_landmarker/woman_hands.jpg`. Downloaded locally for a smoke test; not redistributed in this repository. This project's MIT license does not apply to the photograph or pretrained model.
- [MediaPipe web integration guide](https://ai.google.dev/edge/mediapipe/solutions/vision/hand_landmarker/web_js) documents world landmarks, handedness, image/video modes, and synchronous inference behavior.
- Zhang et al., [MediaPipe Hands: On-device Real-time Hand Tracking](https://arxiv.org/abs/2006.10214).

The robot geometry, UI, synthetic landmark generator, controller, tests and repository preview are original project assets. The preview uses synthetic landmarks rather than the external photograph.
