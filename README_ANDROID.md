# Matheheldin - Android Setup

This project is now configured as a Capacitor app for Android. It is fully offline-capable, with all fonts and dependencies bundled.

## Prerequisites

- **Android Studio**: Ensure you have Android Studio installed.
- **Node.js**: You already have this running.

## How to Build & Run

1.  **Open in Android Studio**:
    Run the following command in your terminal:
    ```bash
    npx cap open android
    ```
    Alternatively, launch Android Studio and open the `android` folder inside this project.

2.  **Wait for Gradle Sync**:
    Android Studio will automatically sync the project dependencies. Wait for this to finish (look at the bottom status bar).

3.  **Run the App**:
    -   Connect an Android device via USB (or use an Emulator).
    -   Click the **Run** button (green play icon) in the toolbar.
    -   Select your device/emulator.



## Updating the App

If you make changes to the React code (e.g., in `App.tsx`):

1.  Rebuild the web assets:
    ```bash
    npm run build
    ```
2.  Sync changes to Android:
    ```bash
    npx cap sync android
    ```
3.  Re-run from Android Studio.
