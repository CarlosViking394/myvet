# Debugging Guide for Non-std C++ Exception

## Overview

The non-std C++ exception error in React Native typically occurs when there's an unhandled JavaScript error that bubbles up to the native layer. This guide helps you debug and fix the issue.

## Debugging System Components

### 1. Debug Service (`src/services/debug/DebugService.ts`)
- Captures all console errors and warnings
- Maintains a log history
- Provides system information
- Allows log export for sharing

### 2. Debug Overlay (`src/components/DebugOverlay.tsx`)
- Floating button (🐛) shows in development
- Shows error count badge
- View, filter, and export logs
- Shows system information

### 3. Error Boundary (`src/components/ErrorBoundary.tsx`)
- Catches React component errors
- Shows fallback UI instead of crash
- Provides stack trace information

### 4. Safe AI Provider (`src/context/SafeAIProvider.tsx`)
- Doesn't use navigation hooks during initialization
- Uses ref-based navigation
- Extensive error handling

## Common Causes and Solutions

### 1. Navigation Issues
**Problem**: Using `useNavigation()` hook outside NavigationContainer or before it's ready.

**Solution**: 
- Use SafeAIProvider instead of AIProvider
- Set navigation ref after component mounts
- Check if navigation is available before using

### 2. Circular Dependencies
**Problem**: Components importing each other in a circle.

**Solution**:
- Check imports for circular references
- Use dynamic imports where needed
- Reorganize component structure

### 3. Native Module Issues
**Problem**: Native modules not properly linked or initialized.

**Solution**:
```bash
# Clean and rebuild
cd ios && pod install
cd ..
npx react-native clean
npm start -- --reset-cache
```

### 4. Async/Promise Issues
**Problem**: Unhandled promise rejections.

**Solution**:
- Add try-catch blocks around async operations
- Use `.catch()` on all promises
- Check debug logs for unhandled rejections

## How to Use the Debug System

### 1. View Logs
- Look for the 🐛 button (bottom right)
- Red badge shows error count
- Tap to open debug console

### 2. Filter Logs
- All: Shows everything
- Warnings: Shows warnings and errors
- Errors: Shows only errors

### 3. Export Logs
- Tap "Share" button
- Share logs via email/messaging
- Include when reporting issues

### 4. Test Components
Use the Debug Test Screen:
```javascript
// In your navigation, temporarily add:
import DebugTestScreen from './src/screens/DebugTestScreen';

// Add to your navigator
<Stack.Screen name="DebugTest" component={DebugTestScreen} />
```

### 5. Minimal App Testing
If the app keeps crashing, use `AppDebug.tsx`:
```javascript
// In index.js or App.tsx, temporarily change:
import App from './AppDebug';
```

## Step-by-Step Debugging Process

1. **Enable Debug Mode**
   - The debug overlay appears automatically in development
   - Check for the 🐛 button

2. **Reproduce the Issue**
   - Try to trigger the crash
   - Note what action causes it

3. **Check Logs**
   - Open debug console
   - Look for errors before crash
   - Check component lifecycle logs

4. **Identify Pattern**
   - Is it navigation-related?
   - Does it happen on app start?
   - Is it specific to a component?

5. **Test in Isolation**
   - Use DebugTestScreen
   - Test individual services
   - Remove components one by one

6. **Apply Fix**
   - Based on error pattern
   - Use safer initialization
   - Add error handling

## Emergency Fixes

If nothing else works:

### 1. Reset Metro Cache
```bash
npx react-native start --reset-cache
```

### 2. Clear All Caches
```bash
watchman watch-del-all
rm -rf node_modules
rm -rf $TMPDIR/react-*
rm -rf $TMPDIR/metro-*
npm install
```

### 3. Reset iOS Simulator
```bash
xcrun simctl erase all
```

### 4. Use Minimal App
Replace App.tsx content with minimal version to isolate issue.

## Reporting Issues

When reporting, include:
1. Export from debug console
2. Steps to reproduce
3. Device/Platform info
4. Recent changes made

## Prevention

1. Always wrap async operations in try-catch
2. Check if objects exist before using
3. Use TypeScript strictly
4. Test on both iOS and Android
5. Keep dependencies updated
6. Use the SafeAIProvider pattern for navigation-dependent contexts 