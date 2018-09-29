// @flow
import React from 'react';
import { Text, View, Button, Icon } from "native-base";
import { AppText, Title } from "../../../components";
import styles from "../ReportStyles"; 
import _ from "lodash";
import { MedicationTypes, DateFormatISO8601 } from "../../../libs/intecojs";
import type { MeasurementType, MeasurementValue } from "../../../libs/intecojs";


type Props = {
  selectedValue: {
      [key: MeasurementType]: MeasurementValue
    },
  updateSelectedScaleValue: (type: string, scaleValue:bool) =>void,
}  

export default class MedicationReportView extends React.Component<Props,any> {
  
  renderMedicationOptions = () =>{
    return _.values(MedicationTypes).map((type:string, i:number)=>{
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
        <AppText style={styles.headlineText}>Choose medication you've received</AppText>
        {this.renderMedicationOptions()}
      </View>
    );
  }
}