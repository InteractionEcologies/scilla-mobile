// @flow
import React from 'react';
import { Text, View, Button, Icon } from "native-base";
import { AppText, Title } from "../../../components";
import styles from "../ReportStyles"; 
import { TirednessScales }  from "../../../libs/intecojs"; 
import _ from "lodash";

type Props = {
  selectedScaleValue:? string,
  updateSelectedScaleValue: (scaleValue:string) =>void,

} 

export default class TiredScaleView extends React.Component<Props, any> {
  
  renderScaleOptions = () =>{
      return(
        _.values(TirednessScales)
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
            <AppText style={styles.headlineText}>How tired are you?</AppText> 
            {this.renderScaleOptions()}
        </View>
      );
    }
  }

