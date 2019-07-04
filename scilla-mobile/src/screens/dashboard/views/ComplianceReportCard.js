// @flow
import React from 'react';
import { View, StyleSheet } from "react-native";
import { Button } from "native-base";
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { AppText, Title, RoundedCard, RoundedCardItem } from "../../../components";
import type { ComplianceReportObject, DateTypeTimeOfDay } from '../../../libs/scijs';
import { ComplianceStatusOptions, DateFormatTimeOfDay } from "../../../libs/scijs";
import { Treatment } from "../../../libs/scijs/models/regimen";
import moment from "moment";
import Colors from "../../../constants/Colors";

type Props = {
  treatment: Treatment, 
  report?: ?ComplianceReportObject,
  disabled: boolean,
  onTreatmentSnoozed: (treatmentId: string) => void,
  onTreatmentComplied: (treatmentId: string) => void,
  onTreatmentSkipped: (treatmentId: string) => void
}

export default class ComplianceReportCard extends React.Component<Props, any> {

  snooze = () => {
    console.log("snooze");
    this.props.onTreatmentSnoozed(this.props.treatment.id);
  }

  comply = () => {
    console.log("comply");
    this.props.onTreatmentComplied(this.props.treatment.id);
  }

  skip = () => {
    console.log("skip");
    this.props.onTreatmentSkipped(this.props.treatment.id);
  }

  render() {
    const { disabled } = this.props;
    return (
      <RoundedCard>
        <RoundedCardItem first style={styles.cardItem} bordered>
            {this.renderTreatmentTime()}
        </RoundedCardItem>
        <RoundedCardItem style={styles.cardItem}>
            <AppText>
              {this.props.treatment.getDescription()}
            </AppText>  
        </RoundedCardItem>
        {!disabled &&
          <RoundedCardItem last style={styles.cardItem}>
            {this.renderActionButtons()}
          </RoundedCardItem>
        }
      </RoundedCard>
    )
  }

  renderTreatmentTime() {
    let additionalStyle = {};
    let time: DateTypeTimeOfDay = this.props.treatment.time;
    // let time: DateTypeTimeOfDay = this.props.treatment.time 
    //           ? this.props.report.expectedTreatmentTime
    //           : this.props.treatment.time;

    // Disable snooze function for now. 
    // if(this.props.report.expectedTreatmentTime !== this.props.treatment.time) {
    //   additionalStyle = styles.snoozedTimeTitle;
    // }
    console.log("Treatment time", time);
    let friendlyTime = moment(time, DateFormatTimeOfDay).format("h:mm A");
    return (<Title style={additionalStyle}>{friendlyTime}</Title>);
  }

  renderActionButtons() {
    return (
      <View style={styles.buttonRow}>
        {this._renderSkipBtn()}
        {this._renderComplyBtn()}
        {/* {this._renderSnoozeBtn()} */}
      </View>
    )
  }

  _renderSkipBtn() {
    let iconName = "ios-close-circle-outline";
    let btnText = "Skip";
    const { report } = this.props;
    if(report == null) return; 
    if (report.status === ComplianceStatusOptions.skip) {
      iconName = "ios-close-circle";
      btnText = "Skipped"
    }

    return (
      <Button transparent style={styles.button} onPress={this.skip} key='skip'>
        <Ionicons 
          ios={iconName}
          name={iconName} 
          style={styles.icon}/>
        <AppText>{btnText}</AppText>
      </Button>
    )
  }

  _renderComplyBtn() {
    const { report } = this.props;
    if(report == null) return;
    let iconName = "ios-checkmark-circle-outline";
    let btnText = "Take";
    if (report.status === ComplianceStatusOptions.took) {
      iconName = "ios-checkmark-circle";
      btnText = "Took";
    }

    return (
      <Button transparent style={styles.button} onPress={this.comply} key="comply">
        <Ionicons name={iconName} style={styles.icon}/>
        <AppText>{btnText}</AppText>
      </Button>
    )
  }
 
  // TODO: Need to fix this. 
  _renderSnoozeBtn() {
    const { report } = this.props;
    if(report == null) return;
    let iconName = "alarm-off";

    if (report.expectedTreatmentTime !== this.props.treatment.time) {
      iconName = "alarm-on"; // An icon that looks like an `outline` version of timer. 
      
    } else {
      iconName = "alarm-off";
    }

    return (
      <Button transparent style={styles.button} onPress={this.snooze} key="snooze">
        <MaterialIcons name={iconName} style={styles.icon}/>
        <AppText>Snooze</AppText>
      </Button>
    )
  }

}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
  },
  cardItem: {
    justifyContent: 'center'
  },
  snoozedTimeTitle: {
    color: Colors.primaryColor
  },
  buttonRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: "center",
    alignItems: 'center',
    height: 60
  },
  button: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    height: 55
  },
  icon: {
    fontSize: 40
    // height: 
  }
})