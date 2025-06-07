# MyVet

MyVet is a mobile application that helps pet owners manage their pets' health and care needs through an AI-powered assistant.

## Features

- AI-powered veterinary assistant
- Pet health record management
- Appointment scheduling
- Medication reminders
- Voice interface for natural interaction

## Technology Stack

- React Native with Expo
- TypeScript
- Context API for state management
- Custom AI architecture

## AI Architecture

MyVet features a sophisticated AI agent architecture:

### Core Services

1. **AI Service** - Handles interactions with language models, processes user queries, and generates appropriate responses.
2. **Speech Service** - Manages text-to-speech functionality for the assistant's voice output.
3. **Conversation Service** - Maintains conversation history and context for ongoing interactions.

### React Integration

- **AI Context** - Provides React context for accessing AI functionality throughout the app.
- **Custom Hooks** - Simplifies integration of AI capabilities into components.
- **Component Library** - Visual components for AI interaction.

For detailed documentation on the AI architecture, see [AI Architecture Documentation](src/services/ai/README.md).

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/CarlosViking394/myvet.git
   cd myvet
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Run on a device or emulator:
   - Scan the QR code with the Expo Go app on your mobile device
   - Press 'a' to run on an Android emulator
   - Press 'i' to run on an iOS simulator

## Security

Security is a priority for MyVet. The project includes:

- Documented security policies
- Regular dependency auditing
- Security-focused npm scripts

For more information on security practices, see [Security Notes](security-notes.md).

## Development Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android emulator
- `npm run ios` - Run on iOS simulator
- `npm run web` - Run in web browser
- `npm run security-check` - Run security audit on production dependencies
- `npm run security-check:full` - Run security audit on all dependencies
- `npm run security-check:fix` - Fix security issues in production dependencies
- `npm run prebuild-prod` - Run security check and prepare for production build

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Expo](https://expo.dev/) for the amazing development platform
- [React Native](https://reactnative.dev/) for the mobile framework
