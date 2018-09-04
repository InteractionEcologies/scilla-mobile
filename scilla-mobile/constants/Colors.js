// @flow
// Reference
// https://material.io/tools/color/#!/?view.left=0&view.right=0&primary.color=9CCC65&secondary.color=A1887F
const primaryColor = "#42a5f5";
const primaryDarkColor = "#0077c2";
const primaryLightColor = "#80d6ff";

const accentColor = "#303f9f";
const accentDarkColor = "#001970";
const accentLightColor = "#666ad1";

const backgroundColor = "#E0E0E0";
const surfaceColor = "#ffffff";
const errorColor = "#d81b60";

const primaryTextColor = "#000000";
const accentTextColor = "#ffffff";
const backgroundTextColor = "#ffffff";
const surfaceTextColor = "#ffffff";
const onErrorColor = "#ffffff";

const tintColor = '#2f95dc';


export default {
  primaryColor, 
  primaryDarkColor, 
  primaryLightColor,
  accentColor, 
  accentDarkColor, 
  accentLightColor,
  backgroundColor,
  surfaceColor,
  errorColor, 
  primaryTextColor,
  accentTextColor,
  backgroundTextColor,
  surfaceTextColor,
  onErrorColor,


  // TODO: need to remove the color underneath
  // and fix the components using these colors.
  tintColor,

  tabIconDefault: '#ccc',
  tabIconSelected: tintColor,
  
  tabBar: '#fefefe',
  
  errorBackground: 'red',
  errorText: '#f44242',
  
  warningBackground: '#EAEB5E',
  warningText: '#666804',
  
  noticeBackground: tintColor,
  noticeText: '#fff',

  clickableText: 'blue'
};
