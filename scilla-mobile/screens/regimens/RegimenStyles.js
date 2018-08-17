// @flow
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  content: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center'
  },
  mainView: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 400,
    width: 300,
    // backgroundColor: 'powderblue'
  },

  nextBackBtnView: {
    height: 50,
    width: 300,
    // backgroundColor: 'skyblue',
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
    // backgroundColor: 'skyblue',
    marginTop: 8
  },

  buttonList: {
    
  }

})

export default styles;
