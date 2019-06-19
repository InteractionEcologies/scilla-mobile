// @flow
import React from 'react';
import { View, Button } from "native-base";
import { AppText } from "../../../components";
import styles from "../ReportStyles"; 
import type { MeasurementType, MeasurementValue } from "../../../libs/scijs";
import { 
  RequiredCheckboxMeasurementTypesInDailyEval
} from "../constants";

type Props = {
  selectedValue: {
      [key: MeasurementType]: MeasurementValue
    },
  updateSelectedScaleValue: (type: string, scaleValue:bool) => void,
}  

export default class MedicationReportView extends React.Component<Props,any> {
  
  renderMedicationOptions = () =>{
    return RequiredCheckboxMeasurementTypesInDailyEval.map((type:string, i:number)=>{
      let selected: boolean = this.props.selectedValue[type] === true
      return (
        <Button
          key={i}
          style={styles.optionButton}
          bordered={!selected}
          block
          onPress = {()=>this.props.updateSelectedScaleValue(type,!selected)}
        >
          <AppText>{type}</AppText>
        </Button>
      );
    })
  }
  
  render(){
    return(
      <View style={styles.mainView}>
        <AppText style={styles.headlineText}>Choose treatment you've received today</AppText>
        {this.renderMedicationOptions()}
      </View>
    );
  }
}