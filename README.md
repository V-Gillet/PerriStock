# Perristock 🧵

A personal inventory management app for DMC embroidery threads, built with React Native and Expo.

## 📱 About

Perristock helps you keep track of your embroidery thread collection. Features include:

- 🎨 **Complete DMC Thread Database** - Browse all 500+ DMC thread colors
- 📦 **Stock Management** - Track quantity and add notes for each thread
- 🔍 **Smart Search** - Find threads by DMC number, name, or color
- 📊 **Grid & List Views** - Switch between layouts with a toggle, for tabs
- 🎨 **Color Preview** - See accurate thread colors at a glance

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd perristock
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

4. Run on your device:
   - **Android**: Press `a` or scan QR code with Expo Go
   - **iOS**: Press `i` or scan QR code with Expo Go (iOS only)
   - **Web**: Press `w`

## 📦 Building an APK for Android

This app is designed for personal use and manual distribution (no Play Store required).

### Option 1: Using EAS Build (Recommended)

1. **Install EAS CLI globally:**

```bash
npm install -g eas-cli
```

2. **Login to your Expo account:**

```bash
eas login
```

3. **Configure the project (if not already done):**

```bash
eas build:configure
```

4. **Build the APK:**

For a preview/test build:

```bash
eas build --platform android --profile preview
```

For a production build:

```bash
eas build --platform android --profile production
```

5. **Download the APK:**

Once the build completes, you'll receive a download link. You can also download it via:

```bash
eas build:list
eas build:download --platform android --latest
```

### Option 2: Local Build (Advanced)

If you prefer to build locally without EAS:

1. **Install Android Studio and configure environment**

2. **Prebuild the native project:**

```bash
npx expo prebuild --platform android
```

3. **Build with Gradle:**

```bash
cd android
./gradlew assembleRelease
```

4. **Find your APK at:**

```
android/app/build/outputs/apk/release/app-release.apk
```

### Distributing Your APK

- **Email/Messaging**: Send the APK directly to users
- **Cloud Storage**: Upload to Google Drive, Dropbox, or similar
- **Web Hosting**: Host on your own server

**Note**: Users will need to enable "Install from Unknown Sources" in their Android settings.

## 📝 Configuration

### Update Package Name

Before building, update the package name in `app.json`:

```json
{
  "expo": {
    "android": {
      "package": "com.yourname.perristock"
    }
  }
}
```

## 🗂️ Project Structure

```
perristock/
├── app/
│   ├── (tabs)/          # Main navigation tabs
│   ├── hooks/           # Custom React hooks
│   └── services/        # Database and business logic
├── components/          # Reusable UI components
├── constants/           # Colors and theme configuration
└── assets/             # Images and static files
```

## 🛠️ Tech Stack

- **Framework**: [Expo](https://expo.dev/) / [React Native](https://reactnative.dev/)
- **Database**: [Expo SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/)
- **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/)
- **Language**: TypeScript
- **UI**: React Native components with custom styling

## 🎨 Key Features Explained

### Database Structure

- **`dmc_threads`**: Reference table with all 500+ DMC threads
- **`stock_threads`**: Your personal inventory linked to DMC reference

### Color Palette

The app uses a warm, craft-inspired color scheme defined in `constants/Colors.ts`:

- **Primary**: `#734A1F` (Brown)
- **Secondary**: `#B8956A` (Tan)
- **Accent**: `#E6D5C3` (Cream)
- **Error**: `#C94D4D` (Red)

### Storage Location

Database file: `perristock.db` is stored locally on the device using Expo SQLite.

To export your database, you can add this utility in the database service:

```typescript
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

async exportDatabase() {
  const dbPath = `${FileSystem.documentDirectory}SQLite/perristock.db`;
  await Sharing.shareAsync(dbPath);
}
```

## 📄 License

This is a personal project for managing embroidery thread inventory. Feel free to fork and adapt for your own use.

## 🤝 Contributing

This is a personal project, but suggestions and improvements are welcome! Feel free to open an issue or submit a pull request.

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

Made with 🧵 for embroidery enthusiasts
