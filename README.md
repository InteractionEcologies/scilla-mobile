# Scilla
A mobile app to help patients with Spinal Cord Injury or Disease (SCI/D) learn the right Baclofen medication plan. 

## Repo structures
* `scilla-mobile`: the main source file for the mobile app. 
* Besides `scilla-mobile/`, this repo contains two other submodules. 
  * `scilla-mobile.wiki`: for documentation purpose. 
  * `scilla-mobile/libs/intecojs/`: for sharing code between Inteco projects.  

## Major Dependencies
* react-navigation 
* React Native (v0.55.4)
* Expo (v32.0.0)
* NativeBase (v2.12.1)
* React Native Firebase (npm) (v4.2)
* React Native Firebase (iOS SDK) (v5.3.0)
* react-native-svg (v6.2.2) in Expo
  * Android Gradle builds the react-native-svg in Expo rather than the standard one. 
* Victory (visualization)
  * We forked a `victory-native` and placed it under `scilla-mobile/src/libs`. This contains a version that uses the react-native-svg provided by Expo. 
  * We still dependent on other `victory-<xxx>` packages, those packages do not use `react-native-svg` thus it is safe to use. See `scilla-mobile/package.json` for the ones we dependent on. These dependencies are copied from `victory-native/package.json`

## Development Environments
* **Visual Studio Code** 
* **React Native** (v0.55.4)
* **node** (v8.11.4 LTS)
* **Expo** (v32.0.0)
* **Flow** 
* **Jest**

## Setup
* Setup Expo
  * Follow [expo setup guide](https://expo.io/learn)
  * Install node.js
  * If you need to maintain multiple node versions, use [n](https://github.com/tj/n)
  * npm install expo-cli --global
* Install dependencies
  * Use terminal, navigate to `scilla-mobile/scilla-mobile/`
  * Run `npm install`
* To start serving the javascript code, use `npm run start`. 

### iOS
* Overall 
* Start expo server 
  * Move to `/scilla-mobile`
  * `expo start -c`
* Use XCode to open `scilla-mobile.xcworkspace`
* Navigate to the `ios/` folder under terminal. Install dependency via Cocoapods. (`pod install`)
* Build an run the ios code on a simulator. 
* 

## Android
* Use Android Studio to open the `android` folder. 
* Disable Instant Run (In Preferences > Build, Execution, Deployment)
* Run the code. 

## Testing
* Run all unittests with autowatch `npm run test:all`
* Run unittest once `npm run test`
* Run unittest in debug mode (allow the `debugger` keyword): `npm run test:debug`
* Run unittest with specific module `npm run test -- [module name]`
  * E.g., `npm run test -- FirebaseDS --watch`
  * To show `console.log` under this mode, we cannot use watch (not sure why). Thus, just run `npm run test -- Firebase` for example. 

## Flow
* 

## Debugging
### iOS
* Show the debugging menu on iPhone
  * `cmd + D`

Expo Upgrade Guide
=================
* Expo typically release upgrade walkthrough for sdk update. 
  * Usually we need to change package.json to point to the new versions of react and expo. 
  * `rm -rf node_modules`
  * `npm install`

Notes
==============
## Notes on Expo pgrade
* npm module (package.json)
  * expo
  * expokit
  * react-native
* iOS and Android package lives in node_modules, so have to upgrade package.json first, then do `npm install`. 
* Once node_modules is upgraded, will need to change the Podfile for iOS
  * Podfile for Expo is setup so that we will fetch `ExpoKit` (the core ExpoKit library) from github using a certain release, and the rest of expo modules (e.g., EXGL) from node_modules. 