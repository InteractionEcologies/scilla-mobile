// @flow
import React from "react";
import { View, StyleSheet } from "react-native";
import Colors from "../constants/Colors";

class Dot extends React.Component<any, any> {
  render(){
    return <View {...this.props} style={[styles.dot, this.props.style, ]}/>
  }
}

class ActiveDot extends React.Component<any, any> {
  render() {
    return <View {...this.props} style={[styles.activeDot, this.props.style, ]}/> 
  }
}

type Props = {
  totalDots: number, 
  currentDotIndex: number,
  dotColor: string, 
  activeDotColor: string
}

export class DotPageIndicator extends React.Component<Props, any> {
  renderDots() {
    let dots = [];
    for (let i = 0; i < this.props.totalDots; i++) {
      dots.push( i === this.props.currentDotIndex
        ? <ActiveDot key={i} style={{backgroundColor: this.props.activeDotColor}}/>
        : <Dot key={i} style={{backgroundColor: this.props.dotColor}}/>
      )
    }
    return dots
  }
  render() {
    return ( 
      <View style={styles.dotPageIndicator}>{this.renderDots()}</View>
    )
  }
}


const styles = StyleSheet.create({
  dot: {
    width: 8, 
    height: 8, 
    borderRadius: 4,
    backgroundColor: 'grey',
    marginRight: 4
  },
  activeDot: {
    width: 8, 
    height: 8, 
    borderRadius: 4,
    backgroundColor: 'white',
    marginRight: 4
  },
  dotPageIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 4, 
    marginBottom: 4
  }
});



