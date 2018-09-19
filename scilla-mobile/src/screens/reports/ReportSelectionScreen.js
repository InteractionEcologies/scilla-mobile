// @flow
import React from "react";
import { Content, Text, View, Icon, Button} from "native-base";
import { AppText, Title } from "../../components";
import moment from "moment";
import { MeasurementTypes } from "../../libs/intecojs"; 
import styles from "./ReportStyles"; 
import { ScreenNames } from "../../constants/Screens";
import _ from "lodash";


export default class ReportSelectionScreen extends React.Component<any, any> {
  static navigationOptions: any = {
    title: 'Report'
  };

  _goToMeasurementScreen = (type:string) =>{
    this.props.navigation.navigate(ScreenNames.ReportMeasurement, {
              trackedMeasurementType: type
            })
  }

  _goToDailyEvaluationScreen = () =>{
    this.props.navigation.navigate(ScreenNames.ReportDailyEvaluation)
  }

  renderMeasurementTypeOptions = () =>{
    let measurementOptions : any = _.values(MeasurementTypes)
    measurementOptions.push('Daily evaluation')
    return measurementOptions.map((type: string, i: number)=>{
        return (
        <Button 
            key={i}
            style={styles.optionButton}
            bordered={true}
            block
            onPress = {(type==='Daily evaluation')? ()=>this._goToDailyEvaluationScreen(): ()=>this._goToMeasurementScreen(type) }
        >
            <AppText>{type}</AppText>
        </Button>
        );
    })
}

  render(){
      return(
          <Content contentContainerStyle={styles.content}>
            <View style={styles.mainView}>
              <Title style={styles.titleText}>Report your experience</Title>
              {this.renderMeasurementTypeOptions()}    
            </View>       
          </Content>
      );
    }

}





  