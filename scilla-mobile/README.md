# Project Structure
* `App.js`: entry point of the mobile app. 
  * Expo by default export this file as the main entry point. 
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
* `assets/`: contains images, fonts and other assets.
* `datafixures/`: contains fake data for unitttesting and development. 
* `flow-typed/`: contains type definitions for third party libraries. They are installed via `flow-typed install XXX`
* `*/__tests__/`: test modules are located under each sub-folders, closest to the functionalities they are testing. 

## Configuration files
* `.flowconfig`: configuring static type checking. 
* `.babelrc`: Expo uses babel for code transpile. 
