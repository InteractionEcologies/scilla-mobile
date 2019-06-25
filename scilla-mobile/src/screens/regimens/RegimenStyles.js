// @flow
import { StyleSheet } from "react-native";
import Colors from "../../constants/Colors";

const styles = StyleSheet.create({
  mainView: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 10,
    // width: '100%',
    width: 'auto',
    flex: 1
  },
  nextBackBtnView: {
    height: 50,
    flexDirection: "row",
    justifyContent: 'space-between',
    left: 0, 
    right: 0,
    marginTop: 8,
    marginLeft: 10, 
    marginRight: 10
  },
  onlyNextBtnView: {
    height: 50,
    flexDirection: "row",
    justifyContent: 'flex-end',
    left: 0, 
    right: 0,
    marginTop: 8,
    marginLeft: 10, 
    marginRight: 10,
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
