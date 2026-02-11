
# 🦉 Matheheldin (Math Heroine)

![Status](https://img.shields.io/badge/Status-Beta%20Testing-orange)
![License](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey)

**Matheheldin** is an interactive, gamified math learning web application designed specifically for 2nd-grade students in the Austrian school system (Volksschule).

It focuses on making arithmetic practice fun through a sticker collection system with rarity tiers, while offering parents/teachers granular control over difficulty levels (like "Zehnerüberschreitung" - crossing the tens boundary).

## 🌟 Features

*   **Curriculum Aligned:** Covers Addition, Subtraction, Multiplication, and Division (1x1).
*   **Smart Difficulty:**
    *   **Easy:** Standard arithmetic within 100.
    *   **Zehnerüberschreitung:** Logic for crossing tens (e.g., 25 + 7), awarding **Rare** stickers.
    *   **Profi Mode:** Placeholder math (e.g., `23 + ? = 50`) and calculation tricks, awarding **Epic** stickers.
    *   **Legendary:** Combine difficult modes for the highest rewards.
*   **Gamification:**
    *   collectable sticker album (Animals, Space, Food, Objects).
    *   Rarity system (Common, Rare, Epic, Legendary).
    *   Local storage save system (no login required).
*   **Offline Capable:** Works fully offline as a native Android app.
*   **iOS Support:** Can be built for iOS using Xcode (requires `npx cap add ios`).
*   **Visual Aids:**
    *   Interactive place value blocks (Hunderter, Zehner, Einer).
    *   Visual "Zehnerstopp" explanations.
    *   Multiplication dot fields.

## 🚧 Status & Feedback

**This project is currently in open testing.**

I built this for my 8-year-old daughter. Feedback, bug reports, and suggestions are very welcome! If you are a parent or teacher, let me know what features would help your children.

## ☕ Support the Project

If you like this project or your kid enjoys collecting the stickers, feel free to buy me a coffee! It helps keep the motivation high.

**Solana Wallet:**
```
6Ko2qE84bjSghZSoiYjBqSuUvECyHcRc1ynWp6kUmGBV
```

## 📱 Download & Install

### Android
You can download the latest APK from the [Releases](https://github.com/RichardHaindl/Matheheld-in/releases) page.

**Or build it yourself:**
The Android project is located in the `android/` folder.  
See [README_ANDROID.md](README_ANDROID.md) for instructions on how to build the APK using Android Studio.

### iOS
The iOS project is located in the `ios/` folder.  
To build for iOS, you need a Mac with Xcode. Run `npx cap open ios` to open the project workspace.

## 💻 Tech Stack

*   React 19
*   TypeScript
*   Tailwind CSS
*   Vite
*   Capacitor (wraps the web app for Android & iOS)

## 🛠 Installation

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```

## 📄 License

This project is licensed under the **GNU General Public License v3.0** (GPLv3).

*   **You are free to:** Run, study, share, and modify the software.
*   **Copyleft:** If you distribute modified versions, they must also be under GPLv3.

See the [LICENSE](LICENSE) file for details.
