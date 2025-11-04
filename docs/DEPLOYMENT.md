# Deployment Guide

## Prerequisites

- Vercel account (free tier works)
- Supabase project (free tier works)
- Google Gemini API key
- Expo account for mobile builds

## Backend Deployment (Vercel)

### 1. Setup Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Link project
cd backend
vercel link
```

### 2. Configure Environment Variables

In Vercel dashboard, add:

- `NODE_ENV=production`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `JWT_SECRET`
- `GOOGLE_GEMINI_API_KEY`

### 3. Deploy

```bash
vercel --prod
```

## Mobile Deployment (Expo EAS)

### 1. Setup EAS

```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Configure project
cd mobile
eas build:configure
```

### 2. Update app.json

Ensure correct bundle identifiers:

- iOS: `com.avishkagihan.fitforge`
- Android: `com.avishkagihan.fitforge`

### 3. Build

```bash
# Build for iOS
eas build --platform ios --profile production

# Build for Android
eas build --platform android --profile production
```

### 4. Submit to Stores

```bash
# Submit to App Store
eas submit --platform ios

# Submit to Google Play
eas submit --platform android
```

## Post-Deployment

### 1. Update Mobile API URL

In `mobile/.env`:

```
EXPO_PUBLIC_API_URL=https://your-backend.vercel.app/api
```

### 2. Test Production Build

- Test authentication flow
- Verify workout generation
- Check AI chat functionality
- Test offline mode

### 3. Monitor

- Setup Sentry for error tracking
- Monitor Vercel logs
- Check Supabase usage
- Monitor API costs (Gemini)

## Rollback

```bash
# Vercel rollback
vercel rollback

# EAS rollback
# Publish previous build through Expo dashboard
```
