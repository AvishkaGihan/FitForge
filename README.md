# 🏋️ FitForge - AI-Powered Fitness App

<div align="center">
  <img src="./docs/logo.png" alt="FitForge Logo" width="200"/>

[![React Native](https://img.shields.io/badge/React_Native-0.81-61DAFB?logo=react)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-SDK_54-000020?logo=expo)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-22_LTS-339933?logo=node.js)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

</div>

## 📱 About

**FitForge** is a cutting-edge, AI-powered fitness application that provides personalized workout plans and real-time coaching through conversational AI. Built with React Native and Expo, it showcases modern mobile development practices with a premium dark-themed UI and smooth 60fps animations.

### ✨ Key Features

- 🤖 **AI Workout Generation** - Personalized workouts powered by Google Gemini
- 💬 **AI Fitness Coach** - Real-time chat assistance using LangChain
- 📊 **Progress Tracking** - Comprehensive statistics and workout history
- ⏱️ **Live Workout Tracking** - Interactive timers and set/rep counting
- 🔐 **Biometric Authentication** - Face ID & Touch ID support
- 📚 **Exercise Library** - 50+ exercises with detailed instructions
- 🎨 **Premium UI/UX** - Dark theme with gradient accents and smooth animations
- 📴 **Offline Support** - Cached workouts for gym use without connectivity

## 🎯 Tech Stack

### Frontend (Mobile)

- **React Native 0.81** with **Expo SDK 54**
- **TypeScript** for type safety
- **React Navigation 7** for routing
- **React Native Reanimated 4** for 60fps animations
- **React Native Paper** for Material Design
- **Axios** for API communication
- **Zod** for validation

### Backend (API)

- **Node.js 22 LTS** with **Express 5**
- **TypeScript** throughout
- **Supabase** for database and authentication
- **PostgreSQL** for data storage
- **LangChain** for AI orchestration
- **Google Gemini API** for LLM
- **Pinecone** for vector search (optional)

## 🚀 Quick Start

### Prerequisites

- Node.js 22+ installed
- Expo CLI: `npm install -g @expo/cli`
- iOS Simulator (macOS) or Android Emulator
- Supabase account (free tier)
- Google Gemini API key (free tier)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/AvishkaGihan/fitforge.git
cd fitforge
```

2. **Install dependencies**

```bash
# Install root dependencies
npm install

# Install mobile dependencies
cd mobile && npm install

# Install backend dependencies
cd ../backend && npm install
```

3. **Setup environment variables**

**Backend** - Create `backend/.env`:

```env
NODE_ENV=development
PORT=3000
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_super_secret_jwt_key
GOOGLE_GEMINI_API_KEY=your_gemini_api_key
```

**Mobile** - Create `mobile/.env`:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

4. **Setup Database**

- Create Supabase project
- Run migrations from `backend/database/migrations/`
- Run seed data from `backend/database/seeds/`

5. **Start Development**

```bash
# Terminal 1 - Start backend
cd backend
npm run dev

# Terminal 2 - Start mobile app
cd mobile
npx expo start
```

## 📸 Screenshots

<div align="center">
  <img src="./docs/screenshots/login.png" width="200" alt="Login"/>
  <img src="./docs/screenshots/dashboard.png" width="200" alt="Dashboard"/>
  <img src="./docs/screenshots/workout.png" width="200" alt="Workout"/>
  <img src="./docs/screenshots/chat.png" width="200" alt="AI Chat"/>
</div>

## 🏗️ Architecture

### Monorepo Structure

```
FitForge/
├── mobile/          # React Native app (Expo)
├── backend/         # Express API server
├── packages/        # Shared utilities
└── docs/           # Documentation
```

### Key Design Patterns

- **Component-Based UI** - Reusable React Native components
- **Repository Pattern** - Abstracted data access
- **API Gateway Pattern** - Centralized backend routing
- **Context API** - State management
- **Custom Hooks** - Reusable logic

## 📚 Documentation

- [Frontend Specification](./docs/front-end-spec.md)
- [Architecture Document](./docs/architecture.md)
- [API Documentation](./docs/API.md)
- [Setup Guide](./docs/SETUP.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)

## 🧪 Testing

```bash
# Run mobile tests
cd mobile && npm test

# Run backend tests
cd backend && npm test

# Run with coverage
npm test -- --coverage
```

## 📦 Building for Production

### Mobile App

```bash
# Install EAS CLI
npm install -g eas-cli

# Build for iOS
eas build --platform ios --profile production

# Build for Android
eas build --platform android --profile production
```

### Backend API

```bash
# Build TypeScript
cd backend && npm run build

# Deploy to Vercel
vercel --prod
```

## 🤝 Contributing

This is a portfolio project, but suggestions and feedback are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Avishka Gihan**

- Portfolio: [avishkagihan.dev](https://avishkagihan.dev)
- LinkedIn: [linkedin.com/in/avishka-gihan](https://linkedin.com/in/avishka-gihan)
- GitHub: [@AvishkaGihan](https://github.com/AvishkaGihan)

## 🙏 Acknowledgments

- OpenAI for GPT models
- Google for Gemini API
- Supabase for backend infrastructure
- Expo team for amazing mobile development tools
- React Native community

## 📊 Project Stats

- **Lines of Code**: ~18,000+
- **Files**: 60+
- **Components**: 25+
- **Screens**: 18
- **Development Time**: 3-4 months
- **Technologies Used**: 15+

---

<div align="center">
  <p>Built with ❤️ using React Native & AI</p>
  <p>⭐ Star this repo if you find it helpful!</p>
</div>
