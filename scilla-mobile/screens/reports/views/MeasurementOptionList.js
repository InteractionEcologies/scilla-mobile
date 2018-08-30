import React from 'react';
import { StyleSheet,TouchableOpacity} from 'react-native';
import { Button,Text, View, Icon } from "native-base";
import { AppText, Title } from "../../../components";
import styles from "../ReportStyles"; 
import { MeasurementTypes } from "../../../libs/intecojs"; 

type Props = {
  updateTrackedMeasurementType: (type:string) => void,
  trackedMeasurementType:? string,
  goToScaleView: () => void,
  goToReportSelectionScreen: () =>void
} 


export default class MeasurementObjectList extends React.Component<Props, any> {

    renderMeasurementTypeOptions = () =>{
        
        return Object.values(MeasurementTypes).map((type, i)=>{
            let selected: boolean = type === this.props.trackedMeasurementType;
            return (
            <Button 
                key={i}
                style={styles.optionButton}
                bordered={!selected}
                block
                onPress={ ()=>this.props.updateTrackedMeasurementType(type)}
            >
                <AppText>{type}</AppText>
            </Button>
            );
        })
    }


    render() {
        let isNextBtnDisabled:boolean = !(this.props.trackedMeasurementType);
    
      return (
        <View style={styles.mainView}>
            <AppText style={styles.headlineText}>What do you want to report?</AppText> 
                {this.renderMeasurementTypeOptions()}
            <View style={styles.nextBackBtnView}>
              <Button 
                iconLeft 
                bordered={true} 
                style={styles.button} 
                onPress={this.props.goToReportSelectionScreen}>
                <Icon name="arrow-back"/>
                <AppText style={styles.textLeft}>Back</AppText>
              </Button>
              <Button 
                iconRight 
                style={styles.button} 
                onPress={()=>this.props.goToScaleView()} 
                disabled={isNextBtnDisabled}>
                  <AppText style={styles.textRight}>Next</AppText>
                  <Icon name="arrow-forward"/>
              </Button>
            </View>
        </View>
      );
    }
  }
