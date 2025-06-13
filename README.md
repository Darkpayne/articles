// README.md
# Articles App - TypeScript + Expo Router

A React Native Expo mobile application built with TypeScript and Expo Router that displays articles fetched from a public API with detailed views and comments.

## Features

### Core Features
- **Article List**: Display articles with title and snippet
- **Article Details**: Full article view with comments
- **Loading States**: Proper loading indicators
- **Error Handling**: User-friendly error messages with retry functionality
- **TypeScript**: Full type safety throughout the application
- **Expo Router**: File-based routing system

## Architecture

### State Management
- **Zustand**: Lightweight state management with TypeScript support and persistence
- **Persistent Storage**: Articles and comments are cached locally with type safety

### Routing
- **Expo Router**: File-based routing system with automatic TypeScript route generation
- **Dynamic Routes**: `/article/[id]` for article details with type-safe parameters

## Setup & Installation

### Prerequisites
- Node.js (16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)

### Installation Steps

1. **Create new Expo project with TypeScript:**
   ```bash
   npx create-expo-app ArticlesApp --template tabs@49
   cd ArticlesApp
   ```

2. **Install dependencies:**
   ```bash
   yarn add expo-router zustand @react-native-async-storage/async-storage
   yarn add --save-dev @types/react @types/react-native typescript
   ```

3. **Copy the source code** into your project following the structure above

4. **Start the development server:**
   ```bash
   npm start
   ```

5. **Run on device/simulator:**
   - iOS: Press `i` or scan QR with Camera app
   - Android: Press `a` or scan QR with Expo Go app