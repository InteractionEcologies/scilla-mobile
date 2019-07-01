// @flow
import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import { AppText, AppHeaderText } from "./StyledText";

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


export class ThreePillTableRow extends React.Component<any, any> {
  _renderPillRegions = () => {
    let pills = [];

    for(let i = 0; i < 3; i++) {
      let text = this.props.values[i] ? this.props.values[i] : '';
      if(text === "" || text === " ") {
        pills.push(
          <PillRegion key={i} empty>
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

  _renderBackgroundLine = () => {
    return (
      <View style={styles.lineOverlayRegion}>
        <View style={styles.line}></View>
      </View>
    )
  }

  _renderPhaseNumber = () => {
    if(this.props.rowIndex) {
      return (
        <View style={styles.phaseTextRegion}>
          <AppText>{this.props.rowIndex+1}</AppText>
        </View>
      )
    }
  }

  render() {
    return (
      <View style={[styles.phaseRow, this.props.style]}>
        {this._renderPhaseNumber()}
    
        <View style={styles.pillGroupRegion}>
          {this._renderBackgroundLine()}
          {this._renderPillRegions()}
        </View>

      </View>
    )
  }
}

class PillRegion extends React.Component<any, any> {

  render() {
    return (
      <View style={this.props.empty ? styles.emptyPillRegion : styles.pillRegion}>
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
  },
  phaseRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 8,
  },
  phaseTextRegion: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // width: 20,
    // height: 30,
    // backgroundColor: 'blue',
  },
  pillGroupRegion: {
    flex: 8,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    // backgroundColor: 'yellow'
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
  },
  pillText: {
    color: 'white',
    fontSize: 14
  },
  lineOverlayRegion: {
    position: 'absolute',
    alignSelf: 'center',
    justifyContent: 'center', 
    alignItems: 'center'
  },
  line: {
    backgroundColor: 'grey',
    width: 200,
    height: 2
  }
});