import { registerRootComponent } from 'expo';

// Temporarily use the progressive test app to isolate issues
// import App from './App';
// import App from './AppDebug';
// import App from './AppMinimal';
import App from './AppProgressive';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App); 