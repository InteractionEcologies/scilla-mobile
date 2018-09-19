// @flow
import React from 'react';
import { Text, View, Button, Icon } from "native-base";
import { AppText, Title } from "../../../components";
import styles from "../ReportStyles"; 
import { SleepScales }  from "../../../libs/intecojs"; 
import _ from "lodash";

type Props = {
  selectedScaleValue:? string ,
  updateSelectedScaleValue: (scaleValue:string) =>void,
} 

export default class SleepScale extends React.Component<Props, any> {
  
  renderScaleOptions = () =>{
      return(
        _.values(SleepScales)
          .map((scale: string, i: number) => {
            let selected: boolean = scale === this.props.selectedScaleValue;
            return (
              <Button 
                key={i}
                style={styles.optionButton}
                bordered={!selected}
                block
                onPress={ ()=>this.props.updateSelectedScaleValue(scale)}
              >
                <AppText>{scale}</AppText>
              </Button>
            );
          })
      );
    }

    render() {
      return (
        <View style={styles.mainView}>
            <AppText style={styles.headlineText}>How is your sleep quality?</AppText> 
            {this.renderScaleOptions()}
        </View>
      );
    }
  }

