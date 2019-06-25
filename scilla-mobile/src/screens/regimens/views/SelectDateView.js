// @flow
import React, { Component } from "react";
import { CalendarList } from "../../../components/Calendar";

import {
  AppText,
  Title
} from "../../../components"
import { View } from "native-base";
import RegimenViewModel from "../../../viewModels/RegimenViewModel";
import { Regimen } from "../../../libs/scijs";
import type { DateTypeISO8601 } from "../../../libs/scijs";

type Props = {
  regimen: Regimen,
  onDateSelected: (date: DateTypeISO8601) => void
}

class SelectDateView extends Component<any, any> {

  selectDate = (date: Object) => {
    console.log("Select Date: ", date.dateString);
    this.props.onDateSelected(date.dateString);
  }

  render() {
    const { regimen } = this.props;
    const vm = new RegimenViewModel(regimen);


    // TODO: 
    // There is a bug here. If we put in a new markedDate
    // with a different starting or ending day, the ui won't 
    // be shown properly. 
    return (
      <View style={{height: 400}}>
        <Title>Select Regimen Start Date</Title>
        <CalendarList 
          style={{height: 100}}
          pastScrollRange={0}
          futureScrollRange={2}
          scrollEnabled={true}
          markedDates={vm.calendarMarkedDateObj}
          markingType={'period'}
          onDayPress={this.selectDate}
          calendarWidth={300}
          horizontal={true}
          pagingEnabled={true}
        />
      </View>
    )
  }
}

export default SelectDateView;