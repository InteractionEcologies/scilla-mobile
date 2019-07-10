// @flow
import React from 'react';
import { StyleSheet } from "react-native";
import { View, Button } from "native-base";
import { AppText } from "../../../components";
// import styles from "../ReportStyles"; 
import type { MeasurementType, MeasurementValue } from "../../../libs/scijs";
import { 
  RequiredAdditionalTreatmentMeasurementTypes, AdditionalMeasurementViewTypes
} from "../constants";
import { Feather } from "@expo/vector-icons";
import _ from "lodash";

type Props = {
  type: string,
  selectedValue: any,
  // selectedValue: {
  //     [key: MeasurementType]: MeasurementValue
  //   },
  updateSelectedScaleValue: (type: string, scaleValue:bool) => void,
}  

const SCOPE = "MedicationReportView:"
export default class MedicationReportView extends React.Component<Props,any> {
  
  renderMedicationOptions = () => {
    const { selectedValue } = this.props;
    return _.map<any, any>(selectedValue, (value: any, type: any): any => {
      let selected: boolean = value === true
      return (
        <View key={type} style={styles.row}>
          <View style={styles.btnContainer}>
            <Button
              style={styles.btn}
              bordered={!selected}
              block
              onPress = {()=>this.props.updateSelectedScaleValue(type, !selected)}
            >
              {selected &&
                <Feather name="check" size={20} color="white"/>
              }
            </Button>
          </View>
          
          <AppText style={{flex: 2}}>{type}</AppText>
        </View>
        
      );
    })
  }
  
  render(){
    const { type } = this.props;
    let title = "Choose treatment you've received today";
    if (type === AdditionalMeasurementViewTypes.additionalIlliness) {
      title = "Additional illiness experience";
    }
    console.log(SCOPE, "render", this.props.selectedValue);
    return(
      <View style={styles.mainView}>
        <AppText style={styles.headlineText}>{title}</AppText>
        {this.renderMedicationOptions()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    // backgroundColor: 'red'
  },
  headlineText: {
    textAlign: 'center',
    marginBottom: 20
  }, 
  row: {
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: 'center',
    marginBottom: 20
  }, 
  btnContainer: {
    flex: 1,
    // backgroundColor: 'green',
    flexDirection: 'row',
    justifyContent: 'center', 
    alignItems: 'center'
  },  
  btn: {
    // flex: 1
    width: 30, 
    height: 30,
    borderRadius: 15,
  }
})