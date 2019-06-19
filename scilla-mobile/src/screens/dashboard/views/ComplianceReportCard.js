// @flow
import React from 'react';
import { View, StyleSheet } from "react-native";
import { Button } from "native-base";
import { Ionicons } from '@expo/vector-icons';
import { AppText, Title, RoundedCard, RoundedCardItem } from "../../../components";
import type { ComplianceReportObject, DateTypeTimeOfDay } from '../../../libs/scijs';
import { ComplianceStatusOptions, DateFormatTimeOfDay } from "../../../libs/scijs";
import { Treatment } from "../../../libs/scijs/models/regimen";
import moment from "moment";
import Colors from "../../../constants/Colors";

type Props = {
  treatment: Treatment, 
  report: ComplianceReportObject,
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
          <RoundedCardItem last style={styles.cardItem}>
            {this.renderActionButtons()}
          </RoundedCardItem>
        </RoundedCard>
      )
  }

  renderTreatmentTime() {
    let additionalStyle = {};
    let time: DateTypeTimeOfDay = this.props.report.expectedTreatmentTime 
              ? this.props.report.expectedTreatmentTime
              : this.props.treatment.time;

    if(this.props.report.expectedTreatmentTime !== this.props.treatment.time) {
      additionalStyle = styles.snoozedTimeTitle;
    }
    console.log("Treatment time", time);
    let friendlyTime = moment(time, DateFormatTimeOfDay).format("h:mm A");
    return (<Title style={additionalStyle}>{friendlyTime}</Title>);
  }

  renderActionButtons() {
    return (
      <View style={styles.buttonRow}>
        {this._renderSkipBtn()}
        {this._renderComplyBtn()}
        {this._renderSnoozeBtn()}
      </View>
    )
  }

  _renderSkipBtn() {
    let iconName = "ios-close-circle-outline";
    let btnText = "Skip";

    if (this.props.report.status === ComplianceStatusOptions.skip) {
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
    let iconName = "ios-checkmark-circle-outline";
    let btnText = "Take";
    if (this.props.report.status === ComplianceStatusOptions.took) {
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

  _renderSnoozeBtn() {
    let iconName = "ios-alarm-outline";

    if (this.props.report.expectedTreatmentTime !== this.props.treatment.time) {
      iconName = "ios-alarm"; // An icon that looks like an `outline` version of timer. 
      
    } else {
      iconName = "ios-alarm-outline";
    }

    return (
      <Button transparent style={styles.button} onPress={this.snooze} key="snooze">
        <Ionicons name={iconName} style={styles.icon}/>
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