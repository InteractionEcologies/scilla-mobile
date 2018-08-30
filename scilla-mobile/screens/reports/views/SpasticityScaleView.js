// @flow
import React from 'react';
import { 
  StyleSheet, TouchableOpacity,
} from 'react-native';
import { Text, View, Button, Icon } from "native-base";
import { AppText, Title } from "../../../components";
import styles from "../ReportStyles"; 
import { SpasticityScales }  from "../../../libs/intecojs"; 
import _ from "lodash";

type Props = {
  selectedScale:? string,
  updateSelectedScale: (scaleValue:string) =>void,
  onValueConfirmed: () => void,
  goToMeasurementTypeOptionView: () => void
} 


export default class SpasticityScaleView extends React.Component<Props, any> {
  renderScaleOptions = () =>{
      return(
        _.values(SpasticityScales)
          .map((scale: string, i: number) => {
            let selected: boolean = scale === this.props.selectedScale;
            return (
              <Button 
                key={i}
                style={styles.optionButton}
                bordered={!selected}
                block
                onPress={ ()=>this.props.updateSelectedScale(scale)}
              >
                <AppText>{scale}</AppText>
              </Button>
            );
          })
      );
    }

    render() {
      let isNextBtnDisabled:boolean = !(this.props.selectedScale);

      return (
        <View style={styles.mainView}>
            <AppText style={styles.headlineText}>How severe is your spasticity?</AppText> 
              {this.renderScaleOptions()}
            <View style={styles.nextBackBtnView}>
              <Button 
                iconLeft 
                bordered={true} 
                style={styles.button} 
                onPress={()=>this.props.goToMeasurementTypeOptionView()}>
                <Icon name="arrow-back"/>
                <AppText style={styles.textLeft}>Back</AppText>
              </Button>
              <Button 
                iconRight 
                style={styles.button} 
                onPress={()=>this.props.onValueConfirmed()}
                disabled={isNextBtnDisabled}>
                  <AppText style={styles.textRight}>Next</AppText>
                  <Icon name="arrow-forward"/>
              </Button>
              </View>
        </View>
      );
    }
  }

