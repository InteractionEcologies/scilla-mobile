// @flow
import React, { Component, Fragment } from "react";
import { View, StyleSheet } from "react-native";
import { AppText, AppHeaderText } from "./StyledText";
import Colors from "../constants/Colors";

export class ThreePillTableHeader extends React.Component<any, any> {
  render() {
    let columns = [];
    for(let i=0; i < this.props.columns.length; i++) {
      if(i >= 4) break;
      columns.push(
        <AppHeaderText key={i} style={styles.headerText}>
          {this.props.columns[i]}
        </AppHeaderText>
      );
    }
    return (<View style={[styles.headerRow, this.props.style]}>{columns}</View>);
  }
}

type Props = {
  values: any,
  rowIndex?: number,
  rowDesc?: ?string, // a description of the row, shown under the index. 
  highlighted?: ?boolean,
  [key: string]: any
}

export class ThreePillTableRow extends React.Component<Props, any> {
  _renderPillRegions = () => {
    let pills = [];

    for(let i = 0; i < 3; i++) {
      let text = this.props.values[i] ? this.props.values[i] : '';
      if(text === "" || text === " ") {
        pills.push(
          <PillRegion key={i} empty>
            <AppText style={styles.pillText}>{text}</AppText>
          </PillRegion>)
      } else if (this.props.highlighted) {
        pills.push(
          <PillRegion key={i} color={Colors.accentColor}>
            <AppText style={styles.pillText}>{text}</AppText>
          </PillRegion>)
      } else {
        pills.push(
          <PillRegion key={i}>
            <AppText style={styles.pillText}>{text}</AppText>
          </PillRegion>)
      }
    }
    return pills;
  }

  render() {
    const { rowIndex, rowDesc, highlighted } = this.props;
    const hasRowIndex = rowIndex != null;

    //console.log("row", highlighted);
    return (
      <View style={[styles.phaseRow, this.props.style]}>
        {hasRowIndex &&
          <View style={styles.phaseTextRegion}>
            <AppText>{rowIndex+1}</AppText>
            {!!rowDesc &&
            <AppText style={{fontSize: 12}}>{rowDesc}</AppText>
            }
          </View>
        }
    
        <View style={styles.pillGroupAndLineRegion}>
          <View style={styles.lineOverlayRegion}>
            <View style={styles.line}></View>
          </View>

          <View style={styles.pillGroupRegion}>
            {this._renderPillRegions()}
          </View>
        </View>

      </View>
    )
  }
}

type PillRegionProps = {
  color?: ?any,
  empty?: boolean,

  [key: string]: any
}
class PillRegion extends React.Component<PillRegionProps, any> {

  render() {
    const defaultStyle = this.props.empty 
      ? styles.emptyPillRegion 
      : styles.pillRegion;
    

    let combinedStyle = [defaultStyle];
    if(this.props.color) {
      combinedStyle.push({
        backgroundColor: this.props.color
      })
    }

    //console.log(this.props.color);
    // console.log(combinedStyle);
    return (
      <View style={combinedStyle}>
        {this.props.children}
      </View>
    );
  }
}


const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    marginBottom: 8,
    // backgroundColor: 'red'
  },

  // For phase treatment info
  phaseRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 8,
  },
  // Phase number
  phaseTextRegion: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10
    // backgroundColor: 'blue',
  },
  pillGroupAndLineRegion: {
    flex: 3,
    flexDirection: 'row', // Not sure why but column does not work
    justifyContent: 'space-between',
    alignItems: 'center',
    // backgroundColor: 'yellow'
  },
  lineOverlayRegion: {
    // flexbox does not support overlap, so this is a hack 
    // to make a line appear behind the dosage/pill information. 
    position: 'absolute',
    width: '100%',
    paddingRight: '15%',
    paddingLeft: '15%'
  },
  pillGroupRegion: {
    flex: 1,
    flexDirection: "row",
    justifyContent: 'space-around',
    alignItems: 'center',
    // width: 250,
    height: 30
  },
  pillRegion: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 55,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'grey'
  },
  emptyPillRegion: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 55,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.0)'
  },
  headerText: {
    fontSize: 12,
    flex: 1,
    textAlign: 'center'
  },
  pillText: {
    color: 'white',
    fontSize: 14
  },

  line: {
    backgroundColor: 'grey',
    flex: 1,
    width: '100%',
    height: 2
  }
});