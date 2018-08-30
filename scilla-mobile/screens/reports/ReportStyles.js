// @flow
import { StyleSheet } from "react-native";
import Colors from "../../constants/Colors";

const styles = StyleSheet.create({
    content: {
      flex: 1, 
      justifyContent: 'center',
      alignItems: 'center'
    },
    mainView: {
      alignItems: 'center',
      justifyContent: 'flex-start',
      width: 300,
      flex: 0.8,
    },
    titleText: {
        marginBottom: 50, 
    },
    headlineText: {
        marginBottom: 15, 
    },
    nextBackBtnView: {
      height: 50,
      width: 300,
      flexDirection: "row",
      justifyContent: 'space-between',
      left: 0, 
      right: 0,
      marginTop: 50
    },
    optionButton:{
      marginBottom: 8
    },
    button: {
      width: 110,
      
    },
    selectionBtn: {
        backgroundColor: "rgba(92, 99,216, 1)",
        width: "80%",
        height: 80,
        backgroundColor:"#9d9d9d",
        borderColor: "black",
        borderWidth: 1,
        borderRadius: 5,
        justifyContent: "center",
        padding: 5,
        alignItems: "center",
        marginBottom: 10,
    },
    textLeft: {
      textAlign: 'center',
      flex: 1
    },
    textRight: {
      textAlign: 'center',
      flex: 1
    }
  })
  
  export default styles;