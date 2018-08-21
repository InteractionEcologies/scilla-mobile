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
* To run unittest, use `npm run test`. 