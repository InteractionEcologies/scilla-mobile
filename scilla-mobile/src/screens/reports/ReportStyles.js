// @flow
import { StyleSheet } from "react-native";
import Colors from "../../constants/Colors";

const styles = StyleSheet.create({
    content: {
      flex: 1, 
      justifyContent: 'center',
      alignItems: 'center',
    },
    mainView: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 300,
      flex: 0.8,
    },
    titleText: {
        marginBottom: 50, 
    },
    headlineText: {
        marginBottom: 15, 
    },
    okBtnView: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 50
    },
    optionButton:{
      marginBottom: 8
    },
    button: {
      width: 110,  
    },

  })
  
  export default styles;