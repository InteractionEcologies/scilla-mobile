// @flow
import React from "react";
import { View, StyleSheet } from "react-native";

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
  activeDotIndex: number,
  dotColor?: string, 
  activeDotColor?: string,

  style?: any
}

export class DotPageIndicator extends React.Component<Props, any> {

  render() {
    return ( 
      <View style={[styles.dotPageIndicator, this.props.style]}>
        {this.renderDots()}
      </View>
    )
  }

  renderDots() {
    let dots = [];
    for (let i = 0; i < this.props.totalDots; i++) {
      dots.push(this._renderDot(i, this.props.activeDotIndex));
    }
    return dots
  }

  _renderDot(currentDotIndex: number, activeDotIndex: number) {
    if (currentDotIndex === activeDotIndex) {
      return this._renderActiveDot(currentDotIndex);
    } else {
      return this._renderNormalDot(currentDotIndex);
    } 
  }

  _renderActiveDot(dotIndex: number) {
    return (
      <ActiveDot 
        key={dotIndex} 
        style={[
          styles.activeDot, 
          this.props.activeDotColor? {backgroundColor: this.props.activeDotColor}: {}
        ]}
      />
    )
  }

  _renderNormalDot(dotIndex: number) {
    return (
      <Dot key={dotIndex} 
        style={[
          styles.dot,
          this.props.dotColor? {backgroundColor: this.props.dotColor}: {}
        ]}
      />
    )
  }
}

const styles = StyleSheet.create({
  dotPageIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 4, 
    marginBottom: 4,
  },
  dot: {
    width: 8, 
    height: 8, 
    borderRadius: 4,
    backgroundColor: '#BDBDBD',
    marginRight: 4
  },
  activeDot: {
    width: 8, 
    height: 8, 
    borderRadius: 4,
    backgroundColor: 'black',
    marginRight: 4
  },

});



