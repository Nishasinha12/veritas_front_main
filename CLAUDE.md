# CLAUDE.md — Veritas App Development Guide

> This file serves as the canonical reference for architecture, deployment, coding constraints, and maintenance rules for the Veritas React Native Expo application.

---

## 🏗️ Architecture Overview

```
veritas-front/
├── app/                          # Expo Router file-based routing
│   ├── _layout.tsx               # Root layout (Stack navigator + header)
│   ├── index.tsx                  # Entry gate → redirects to onboarding or home
│   ├── home.tsx                   # Main feed screen
│   ├── compose.tsx                # Verification input screen
│   ├── truecaller.tsx             # Spam call / dialer feature
│   ├── about.tsx                  # About page
│   ├── archives.tsx               # Archived posts
│   ├── edit-profile.tsx           # Edit profile form
│   ├── history.tsx                # Verification history
│   ├── notifications.tsx          # Notification center
│   ├── rewards.tsx                # Gamification / leaderboard
│   ├── saved.tsx                  # Saved items
│   ├── user.tsx                   # Profile view
│   ├── i18n.js                    # i18next initialization
│   ├── locales/                   # Translation JSON files (en, es, fr, de, zh, hi)
│   └── onboarding/               # Onboarding flow (nested Stack)
│       ├── _layout.tsx            # Onboarding layout with GestureHandlerRootView
│       ├── welcome.tsx            # Landing page with cards
│       ├── language.tsx            # Language selection
│       ├── signin.tsx             # Login/Register with reCAPTCHA
│       ├── profile1.tsx           # Profile setup step 1
│       ├── profile2.tsx           # Identity & interests
│       ├── permission2.tsx        # Privacy & permissions
│       ├── ResultScreen.tsx       # AI verification results display
│       ├── forgot-password.tsx    # Password recovery
│       ├── verify-email.tsx       # OTP verification
│       └── reset-password.tsx     # Password reset
├── Components/                    # Shared UI components
│   ├── Chatbot.tsx                # FAQ-based chatbot (Verta)
│   ├── Menu.tsx                   # Slide-out drawer menu
│   ├── LogoutModal.tsx            # Logout confirmation dialog
│   └── RatingModal.tsx            # App rating modal
├── store/                         # Zustand state management
│   ├── usePointsStore.ts          # Points, search count, feed posts (persisted)
│   └── useProfileStore.ts         # User profile data (NOT persisted yet — see audit)
├── api/
│   └── apiClient.ts               # Axios instance + API helper functions
├── assets/                        # Images, icons, badges
├── config.js                      # Base URL config (deprecated — use apiClient.ts)
├── babel.config.js                # Babel with Reanimated plugin
├── tsconfig.json                  # TypeScript configuration
├── app.json                       # Expo configuration
├── eas.json                       # EAS Build profiles
└── package.json                   # Dependencies
```

### Data Flow
```
User Input → compose.tsx → apiClient.ts → Flask Backend (Python)
                                              ↓
                                        ResultScreen.tsx
                                              ↓
                                     usePointsStore (persisted)
                                              ↓
                                         home.tsx feed
```

---

## 📦 Deployment Rules

### EAS Build Requirements
1. Always use managed workflow — do NOT check in `android/` or `ios/` directories.
2. `eas.json` must exist at project root with `development`, `preview`, and `production` profiles.
3. APK builds use `"buildType": "apk"` in the preview profile.
4. AAB builds (Play Store) use the `production` profile.
5. Never use `expo build` — it is deprecated. Use `eas build`.

### Build Commands
```bash
# Development build (for Expo Dev Client)
eas build --platform android --profile development

# Preview APK (for internal testing)
eas build --platform android --profile preview

# Production AAB (for Play Store)
eas build --platform android --profile production

# Submit to Play Store
eas submit --platform android --profile production
```

### Pre-Build Checklist
```bash
npx expo-doctor          # Check compatibility
npx tsc --noEmit         # TypeScript validation
npx expo install --check # Dependency version check
npx expo install --fix   # Auto-fix versions
npx expo start --clear   # Clear Metro cache
```

---

## 🚫 Coding Constraints

### NEVER Do
- ❌ Hardcode API keys in source files
- ❌ Use `http://` URLs for production backends
- ❌ Use `ImagePicker.MediaTypeOptions` (removed in SDK 53, use `['images']` instead)
- ❌ Create `Animated.Value` outside `useRef`
- ❌ Put non-route files (txt, json, etc.) in `app/` directory
- ❌ Use `registerRootComponent` (Expo Router handles this via `expo-router/entry`)
- ❌ Import Node.js-only packages (`fs`, `path`, `crypto`)
- ❌ Use dynamic `require()` for assets
- ❌ Put FlatList inside ScrollView without `scrollEnabled={false}`
- ❌ Use `console.log` in production (use `__DEV__` guard)

### ALWAYS Do
- ✅ Use `__DEV__` flag to switch between dev/prod URLs
- ✅ Use `useRef` for `Animated.Value` instances
- ✅ Wrap root layout in `GestureHandlerRootView`
- ✅ Use `persist` middleware for Zustand stores that need data survival
- ✅ Use try-catch around `JSON.parse`
- ✅ Compress images to < 200KB before adding to assets
- ✅ Use `expo-constants` for environment-specific config
- ✅ Keep `react-native-reanimated/plugin` as the LAST Babel plugin

---

## 📱 Expo SDK 53 Compatibility

### Required Versions
| Package | Required Version | Notes |
|---------|-----------------|-------|
| `react` | 19.0.0 | Must match Expo SDK 53 |
| `react-native` | 0.79.x | Must match Expo SDK 53 |
| `expo-router` | ~5.1.x | File-based routing |
| `react-native-reanimated` | ~3.17.x | Required by Moti |
| `react-native-gesture-handler` | ~2.24.x | Required for swipe gestures |

### Plugin Registration (app.json → plugins)
These packages MUST be listed:
- `expo-router`
- `expo-font`
- `expo-web-browser`
- `expo-sqlite`

### Packages That Must NOT Be Installed
- `expo-cli` (deprecated)
- `react-native-cli`
- Any package requiring manual native linking
- Node.js-only packages (`sharp`, `canvas`, `bcrypt`)

---

## 🗄️ State Management Rules

### Zustand Stores

| Store | Persisted | Storage Key | Data |
|-------|-----------|-------------|------|
| `usePointsStore` | ✅ Yes | `veritas-points` | Points, search count, feed posts |
| `useProfileStore` | ⚠️ Should Add | `veritas-profile` | Name, email, DOB, gender, country, photo |

### Rules
1. All user-facing data stores SHOULD use `persist` middleware with AsyncStorage.
2. Use `createJSONStorage(() => AsyncStorage)` as the storage adapter.
3. Never read from AsyncStorage directly in components if a Zustand store manages that data.
4. Avoid duplicate state — don't store the same data in both AsyncStorage and Zustand.

---

## 🔑 API & Security Rules

1. Frontend should NEVER contain API keys — proxy sensitive calls through backend.
2. Backend `.env` files MUST be in `.gitignore` and never committed to git.
3. Use EAS Secrets for build-time environment variables:
   ```bash
   eas secret:create --name API_URL --value "https://api.example.com"
   ```
4. Use `expo-constants` to access environment config:
   ```typescript
   import Constants from 'expo-constants';
   const apiUrl = Constants.expoConfig?.extra?.apiUrl;
   ```

---

## ⚡ Performance Rules

1. Image assets should be < 200KB — compress with TinyPNG or convert to WebP.
2. Use `initialNumToRender` and `windowSize` on all FlatLists.
3. Avoid inline object styles — use `StyleSheet.create` for all styles.
4. Use `useCallback` and `useMemo` for expensive computations in render.
5. Animated values MUST use `useRef` — never create in render body.
6. Use `useNativeDriver: true` wherever possible for animations.
7. Remove `console.log` in production using babel plugin.

---

## ⚠️ Known Fragile Areas

| Area | Risk | Details |
|------|------|---------|
| `compose.tsx` | Medium | FormData multipart upload may fail with incorrect MIME types |
| `home.tsx` news fetch | High | Hardcoded API key; no error recovery for failed fetch |
| `apiClient.ts` | High | Uses `__DEV__` toggle now — ensure production URL is set before building |
| `signin.tsx` WebView | Medium | reCAPTCHA may not render correctly in embedded WebView on some devices |
| `notifications.tsx` | Medium | Gesture-based swipe needs `GestureHandlerRootView` at root (now added) |
| `ResultScreen.tsx` | Medium | `JSON.parse` without try-catch can crash on malformed data |

---

## 📝 EAS Deployment Guide

### First-Time Setup
```bash
# 1. Install EAS CLI
npm install -g eas-cli

# 2. Login
eas login

# 3. Configure project
eas build:configure

# 4. eas.json already created at project root
```

### Play Store Submission
1. Build production AAB: `eas build --platform android --profile production`
2. Download the AAB from the EAS dashboard
3. Upload to Google Play Console
4. Required: Privacy policy URL, app screenshots, store listing
5. Android target SDK must be >= 34 (Expo SDK 53 handles this)

### Environment Variables for EAS
```bash
# Set production secrets
eas secret:create --name API_BASE_URL --value "https://your-api.com"
eas secret:create --name NEWS_API_PROXY --value "https://your-api.com/news"
```

### Versioning
- `app.json` → `version` for user-facing version (e.g., "1.0.0")
- `app.json` → `android.versionCode` auto-incremented by EAS when `autoIncrement: true`

---

## 🧪 Testing Before Deployment

```bash
# Full validation sequence
npx expo-doctor
npx tsc --noEmit
npx expo start --clear
npx expo export --platform android
eas build --platform android --profile preview
```

> **IMPORTANT:** Always test the preview APK on a physical Android device before submitting to Play Store. Emulators may not catch all issues.
