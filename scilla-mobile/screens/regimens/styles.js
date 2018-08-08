// @flow
import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
  container: {
    flex: 1, 
    flexDirection: 'column', // default is column in react-native
    justifyContent: 'center', // distribution of children along the primary axis
    alignItems: 'center', // alignment for secondary axis
  },
  regimen: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  header2: {
    fontWeight: 'bold',
    fontSize: 20
  }
});

export default styles;
