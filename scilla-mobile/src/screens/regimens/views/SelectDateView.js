// @flow
import React, { Component } from "react";
import { CalendarList } from "../../../components/Calendar";

import {
  Title,
  DotPageIndicator
} from "../../../components"
import { View } from "native-base";
import RegimenViewModel from "../../../viewModels/RegimenViewModel";
import { IRegimen } from "../../../libs/scijs";
import type { DateTypeISO8601 } from "../../../libs/scijs";

type Props = {
  regimen: IRegimen,
  onDateSelected: (date: DateTypeISO8601) => void,
  numStates: number,
  currentStateIndex: number
}

class SelectDateView extends Component<Props, any> {

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
        <DotPageIndicator 
          totalDots={this.props.numStates}
          activeDotIndex={this.props.currentStateIndex}
          // dotColor='grey'
          // activeDotColor='black'  

        />
        <CalendarList 
          style={{height: 100}}
          pastScrollRange={0}
          futureScrollRange={3}
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