// @flow
import { StyleSheet } from "react-native";
import Colors from "../../constants/Colors";

const styles = StyleSheet.create({
    content: {
      flex: 1, 
      width: '100%',
      paddingLeft: 10, 
      paddingRight: 10,
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    mainView: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 350,
      flex: 0.8,
    },
    titleText: {
        marginBottom: 10, 
    },
    headlineText: {
        width:280,
        height: 50,
        marginTop:15,
        marginBottom: 10, 
        textAlign: 'center'
    },
    okBtnView: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 30,
      marginBottom: 50,
    },
    optionButton:{
      marginTop: 10,
      height:50,
    },
    nextBackBtnView: {
      height: 50,
      width: 340,
      flexDirection: "row",
      justifyContent: 'space-between',
      left: 0, 
      right: 0,
      marginTop: 20,
      marginBottom: 30
  },
    button: {
      // width: 100,  
      flex: 1
    },
    header: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    // height: 150,
    // padding: 10,
    paddingBottom: 3,
    shadowOffset: { width: 1, height: 1},
    shadowColor: 'black',
    shadowOpacity: .3
  },
  calendarView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 10,
    // marginBottom: 50,
    width: '100%'
  },
  card:{
    width: '100%', 
    flex:1, 
    padding:5, 
    marginTop: 35
  },
  cardItems:{
    justifyContent:"center", 
    // flex:1
    height: 250
  },
  cardButtons:{
    flexDirection: "column", 
    justifyContent: 'center', 
    marginTop:20
  },
  cardDate:{
    justifyContent:"center"
  },
  dailyEvalCard:{
    width:340, 
    height: 340, 
    flex:1, 
    padding:5, 
    marginTop:5
  },
  inSituCard:{
    width:340
  },
  dateCard:{
    width:340, 
    padding:5, 
    marginTop:10
  },
    exerciseView:{
    flexDirection:'row', 
    marginTop:30, 
    alignItems:'center'
  },
  exerciseItem:{
    width:100
  },
  exerciseInput:{
    fontSize:40
  },
  memoTextArea:{
    width:280
  }

  })
  
  export default styles;