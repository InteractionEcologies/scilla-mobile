// @flow
import { StyleSheet } from "react-native";
import Colors from "../../constants/Colors";

const styles = StyleSheet.create({
  mainView: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '90%',
    flex: 0.8
  },
  nextBackBtnView: {
    height: 50,
    width: 300,
    flexDirection: "row",
    justifyContent: 'space-between',
    left: 0, 
    right: 0,
    marginTop: 8
  },
  button: {
    width: 110
  },
  textLeft: {
    textAlign: 'center',
    flex: 1
  },
  textRight: {
    textAlign: 'center',
    flex: 1
  },
  dotPageIndicator: {
    marginTop: 8
  },
  warningMessage: {
    color: Colors.errorText
  }

})

export default styles;
