## Progress

Status: ✅ Complete

- Refactored scan page to use CameraCapture component with full scan→results→save flow
- Added separate Take Photo (camera capture) and Upload Image (file upload) buttons
- Camera input uses capture=environment for mobile, file input for gallery/disk
- Both paths feed into same AI scan pipeline via /api/scan
- Updated camera-capture tests (9 tests), updated E2E scan-flow tests
