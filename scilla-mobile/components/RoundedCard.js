// @flow
import React from 'react';
import { Card } from "native-base";

type Props = {
  borderRadius?: number,
  [otherKeys: string]: any
}

const DEFAULT_BORDER_RADIUS = 8;
export class RoundedCard extends React.Component<Props, any> {
  static defaultProps = {
    borderRadius: DEFAULT_BORDER_RADIUS
  }
  
  render() {
    return (
      <Card {...this.props} 
        style={this.props.style, {borderRadius: this.props.borderRadius}}
      >
        {this.props.children}
      </Card>
    )
  }
}