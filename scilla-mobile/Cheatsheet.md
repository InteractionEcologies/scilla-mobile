# Cheatsheet

## Unitesting (with Jest)
* Run all unittests with autowatch `npm run test:all`
* Run unittest once `npm run test`
* Run unittest in debug mode (allow the `debugger` keyword): `npm run test:debug`
  * Go to `chrome://inspect` in Chrome. 
* Run unittest with specific module `npm run test -- [module name]`
  * E.g., `npm run test -- FirebaseDS --watch`
  * To show `console.log` under this mode, we cannot use watch (not sure why). Thus, just run `npm run test -- Firebase` for example. 

## Using Flow static type checker
* add `// @flow` at the beginning of a `js` file. 
* We use `eslint` with flow support. 
* Flow warnings and errors should show in the IDE (VSCode), under Problems. 
* You can also run `npx flow`. 
* flow-typed create-stub <package_name>

## Publishing/Deployment
* Overview: 
  * The iOS and Android app uses a different URL to load the code in development and production. 
  * Under development setting, the code is load from a server running locally (started with `npm run start` or `expo start`)
  * Under production setting, the code uses the URL specifies in `app.json` to fetch the published code on Expo. This allows over the air update. 
* `npx expo publish`
  * This will publish the JS asset to the Expo server. 
* Then, for iOS, build the project with `Release` settings. Or just Archive and publish it. 

### Publish Android release built on TestFairy
* Edit `build.gradle` to change build version
  * Check `defaultConfig` -> `versionName`
* I edited the `build.gradle`file to include signing for the release built. 
  * As suggested in this [React Native doc](https://facebook.github.io/react-native/docs/signed-apk-android)
* Click `build` in the menu, then `Generate Signed Bindles/SDK`. 
  * Select the APK option > Next
  * Type in the key store path (<yourpath>/scilla-mobile.keystore) and other info. > Next
  * Select `release` 
  * Make sure you select both `V1 (Jar Signature)` and `V2 (Full APK Signature)` in Signature Versions. 
  * Click Finish. 
* Once built, the `apk` should be located at `/android/app/release` with a name `app-release.apk`. 
  * Note that the release built uses a keystore located in `/android/app/`
* Sign in to TestFairy, upload this apk. 
* On the Android end, click on the email received from TestFairy, download the apk, and install. 
* You will need to set your Android to allow unknown sources:
  * Settings > Security & fingerprint > Unknown sources (turn this on)

## Debugging
### iOS
* Show the debugging menu on iPhone
  * `cmd + D`