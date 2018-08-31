# Scilla
A mobile app to help patients with Spinal Cord Injury or Disease (SCI/D) learn the right Baclofen medication plan. 

## Repo structures
* `scilla-mobile`: the main source file for the mobile app. 
* Besides `scilla-mobile/`, this repo contains two other submodules. 
  * `scilla-mobile.wiki`: for documentation purpose. 
  * `scilla-mobile/libs/intecojs/`: for sharing code between Inteco projects.  

## Major Dependencies
* React Native
* Expo 
* react-navigation
* Firebase

## Development Environments
* **Visual Studio Code** (v1.26.1)
* **React Native** (v0.55.4)
* **node** (v10.4.1)
* **Expo** (v29.0.0)
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
* To start the program, use `npm run start`. 

## Testing
* Run all unittests with autowatch `npm run test:all`
* Run unittest once `npm run test`
* Run unittest in debug mode (allow the `debugger` keyword): `npm run test:debug`
* Run unittest with specific module `npm run test -- [module name]`
  * E.g., `npm run test -- FirebaseDS --watch`
  * To show `console.log` under this mode, we cannot use watch (not sure why). Thus, just run `npm run test -- Firebase` for example. 