// @flow
import React from "react";
import { View, StyleSheet, Text } from "react-native";
import {  Calendar} from "./Calendar";
import CalendarHeader from "./Calendar/calendar/header";
import dateutils from "./Calendar/dateutils";
import { parseDate} from "./Calendar/interface";

/*
 * Warning: Does not support `firstDay` other than Monday (i.e., firstDay={1}).
 */
export class OneWeekCalendar extends Calendar {
  
  onPressArrowLeft = (_: any) => {
    
  }

  onPressArrowRight = (_: any) => {
    // console.log(addMonth);
  
  }

  render() {
    const days = dateutils.oneWeekPage(
      this.state.currentMonth, 
      this.props.firstDay,
      this.props.current
    );

    const weeks = [];
    while (days.length) {
      weeks.push(this.renderWeek(days.splice(0, 7), weeks.length));
    }
    let indicator;
    const current = parseDate(this.props.current);
    
    if (current) {
      const lastMonthOfDay = current.clone().addMonths(1, true).setDate(1).addDays(-1).toString('yyyy-MM-dd');
      if (this.props.displayLoadingIndicator &&
          !(this.props.markedDates && this.props.markedDates[lastMonthOfDay])) {
        indicator = true;
      }
    }
    return (
      <View style={[this.style.container, this.props.style, styles.customStyle]}>
        <OneWeekCalendarHeader
          theme={this.props.theme}
          hideArrows={this.props.hideArrows}
          month={this.state.currentMonth}
          addMonth={this.addMonth}
          showIndicator={indicator}
          firstDay={this.props.firstDay}
          renderArrow={this.props.renderArrow}
          monthFormat={this.props.monthFormat}
          hideDayNames={this.props.hideDayNames}
          weekNumbers={this.props.showWeekNumbers}
          onPressArrowLeft={this.onPressArrowLeft}
          onPressArrowRight={this.onPressArrowRight}
        />
        <View style={this.style.monthView}>{weeks}</View>
      </View>);
  }
}

class OneWeekCalendarHeader extends CalendarHeader {
  render() {
    
    let weekDaysNames = dateutils.weekDayNames(this.props.firstDay);
    
    return (
      <View>
        {
          !this.props.hideDayNames &&
          <View style={this.style.week}>
            {this.props.weekNumbers && <Text allowFontScaling={false} style={this.style.dayHeader}></Text>}
            {weekDaysNames.map((day, idx) => (
              <Text allowFontScaling={false} key={idx} accessible={false} style={this.style.dayHeader} numberOfLines={1} importantForAccessibility='no'>{day}</Text>
            ))}
          </View>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  customStyle: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }
})