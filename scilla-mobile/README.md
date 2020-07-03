# Scilla Mobile
A mobile app to help patients with Spinal Cord Injury or Disease (SCI/D) learn the right Baclofen medication plan. 

## Introduction
We develop this mobile application with an ejected version of Expo. Expo can be think of a layer on top of React Native, it provides Javascript and native SDK to access native functionalities that available in React Native. One can develop Expo without ejecting -- if they only rely on the functionalities provided by Expo. If developing in this way, developers do not need to create their own iOS and Android builds. However, in our case, we want to access the full functionalities of firebase native SDK and we dependent on a native charting library (victory-native). To use these, we do need to eject from Expo, and use the vanilla React Native. We can still access Expo functionalities via ExpoKit, however we will need to create our iOS and Android builds, as the default Expo build does not come with the native libraries we want to use. 

## Warning 
* This repo currently contains several key files for easy development. To make this repo public, we must remove these files AND clean them from commit history. 
* These files include: 
  * Android signing keystore: `scilla-mobile/android/app/scilla-mobile.keystore`
  * PWD for Android signing keystore: `scilla-mobile/android/gradle/gradle.properties`
  * Firebase keys:
    * Android: `/android/app/google-services.json`
    * iOS: `/ios/scilla-mobile/GoogleService-info.plist`

## Repo structure
* `scilla-mobile`: the main source file for the mobile app. 
* Besides `scilla-mobile/`, this repo contains two other submodules. 
  * `scilla-mobile.wiki`: for documentation purpose. 
  * `scilla-mobile/libs/scijs/`: for sharing code between Inteco projects.  

## Major Dependencies
* **Visual Studio Code** 
* **React Native** (v0.62)
* **node** (v12.x LTS)
* **Expo** (v38.0.0)
* **Flow** 
* **Jest**
* react-navigation 
* NativeBase (v2.12.1)
* React Native Firebase (npm) 
* React Native Firebase (iOS SDK) 
* react-native-svg (v6.2.2) in Expo
  * Android Gradle builds the react-native-svg in Expo rather than the standard one. 
* Victory (visualization)
  * We forked a `victory-native` and placed it under `scilla-mobile/src/libs`. This contains a version that uses the react-native-svg provided by Expo. 
  * We still dependent on other `victory-<xxx>` packages, those packages do not use `react-native-svg` thus it is safe to use. See `scilla-mobile/package.json` for the ones we dependent on. These dependencies are copied from `victory-native/package.json`

## Development Setup
### Overview
* Mac
  * Setup XCode
  * Start expo server (locally)
  * Run XCode project with an iPhone attached. 
  * The code should run on the phone now!

### Setup Development Environment
* Setup Expo
  * Follow [expo setup guide](https://expo.io/learn)
  * Install node.js
  * If you need to maintain multiple node versions, use [n](https://github.com/tj/n)
  * `npm install expo-cli --global`
* Clone the repo
  * git clone <repo>
  * Use VSCode to open <repo>/scilla-mobile
    * Note that most of the config files required by the IDE locate inside `scilla-mobile/scilla-mobile` rather than the root folder. Open this folder allows VSCode to run Jest and flow extensios. 
* Install dependencies
  * Use terminal, navigate to `scilla-mobile/scilla-mobile/`
  * Run `npm install expo`
  * Run `expo install`
* To start serving the javascript code, use `expo start -c`. 

### Running on iOS
* Start expo server 
  * `cd ./scilla-mobile`
  * `expo start -c`
    * or `expo start -c --localhost` 
    * or `expo start -c --lan` (Use this at home)
    * or `expo start -c --tunnel` (I have to use it when working at a caffe.)
* Use XCode to open `scillamobile.xcworkspace`
* Navigate to the `ios/` folder under terminal. Install dependency via Cocoapods. (`pod install`)
* Build and run the ios code on a simulator or on a device. 

### Running on Android
* Use Android Studio to open the `android` folder. 
* Disable Instant Run (In Preferences > Build, Execution, Deployment)
* Run the code. 

## Project Structure
* `App.js`: entry point of the mobile app. 
  * Expo by default export this file as the main entry point. 
* `src/`
  * `app/`: contains app-wise singletons (services and states)
  * `constants/`: contains app-wide constants (e.g., color theme, Database configs.)
  * `navigation/`: contain navigators that define the structure of the screens. 
    (e.g., Tab, Stack and Switch). 
  * `screens/`: contain module-specific view components (e.g., `auth` is a module).
    * `auth/`: screens for authentication. 
    * `onboarding/`: screens for onboarding.
    * `dashboard/`: screens for the `today` dashboard tab, a tab to show today's actions.
    * `regimens/`: screens for the `regimen` tab, a tab to show current regimen. 
    * `reports/`: screens for measurements reporting (e.g., spasticity pain).
    * `analysis/`: screens for data analysis and visualization. 
  * `components/`: contains view components that can be shared between modules. 
  * `models/`: contains ORM classes that encapsulate the data (represented as `Object`) obtained from backend API (e.g., `Regimen` is a class that encapsulate `RegimenObject`). 
  * `libs/`: contains app-level utility classes, functions, types and constants. 
    * `intecolib`: contains utilities that can be shared with other Inteco projects (e.g., data-sharing-cmd.)
  * `datafixures/`: contains fake data for unitttesting and development. 
  * `*/__tests__/`: test modules are located under each sub-folders, closest to the functionalities they are testing. 
* `assets/`: contains images, fonts and other assets.
* `flow-typed/`: contains type definitions for third party libraries. They are installed via `flow-typed install XXX`
* `ios/`: contains ios-specific code
* `android/`: contains Android-specific code. 


# Other Notes
## Notes on Expo upgrade
* npm module (package.json)
  * expo
  * expokit
  * react-native
* iOS and Android package lives in node_modules, so have to upgrade package.json first, then do `npm install`. 
* Once node_modules is upgraded, will need to change the Podfile for iOS
  * Podfile for Expo is setup so that we will fetch `ExpoKit` (the core ExpoKit library) from github using a certain release, and the rest of expo modules (e.g., EXGL) from node_modules. 


