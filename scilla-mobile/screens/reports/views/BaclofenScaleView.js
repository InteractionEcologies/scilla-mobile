// @flow
import React from 'react';
import { Text, View, Button, Icon } from "native-base";
import { AppText, Title } from "../../../components";
import styles from "../ReportStyles"; 
import { BaclofenScales } from "../../../libs/intecojs";
import _ from "lodash";

type Props = {
  selectedScaleValue:? string,
  updateSelectedScaleValue: (scaleValue:string) =>void,
} 

export default class BaclofenScaleView extends React.Component<Props, any> {
  
  renderScaleOptions = () =>{
      return(
        _.values(BaclofenScales)
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
            <AppText style={styles.headlineText}>How much baclofen amount do you take?</AppText> 
            {this.renderScaleOptions()}
        </View>
      );
    }
  }