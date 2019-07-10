// @flow
export const ScreenNames = {
  MainOrAuthSwitchNavigator: "MainOrAuthSwitchNavigator",

  // Modals
  RegimenPhaseTransition: 'RegimenPhaseTransition',
  RegimenPhaseManualUpdate: "RegimenPhaseManualUpdate",

  Main: "Main", // A switch navigator that switch between Auth and MainTabNaviagor
  
  // Authentication
  Login: "Login",
  SignUp: "SignUp",

  // This allows a modal to be shown, it is the parent of 
  // MainTabNavigator

  // Dashboard
  DashboardMain: "DashboardMain",

  // Regimen 
  RegimenMain: "RegimenMain",
  RegimenCreation: 'RegimenCreation',
  RegimenRedeem: "RegimenRedeem",
  RegimenEdit: "RegimenEdit",
  RegimenEditReminders: "RegimenEditReminders",
  RegimenSelectIdealPhase: "RegimenSelectIdealPhase",
  
  // Reports
  ReportMain: "ReportMain",
  ReportSelection: "ReportSelection",
  ReportMeasurement: "ReportMeasurement",
  ReportDailyEvaluation: "ReportDailyEvaluation", 

  // Analysis
  AnalysisMain: "AnalysisMain",

  // Settings
  SettingsMain: "SettingsMain"
}