// @flow
import React from 'react';
import { CardItem } from "native-base";

type Props = {
  borderRadius?: number,
  first?: bool,
  last?: bool,
  [otherKeys: string]: any
}

const DEFAULT_BORDER_RADIUS = 8;
export class RoundedCardItem extends React.Component<Props, any> {
  static defaultProps = {
    borderRadius: DEFAULT_BORDER_RADIUS,
    first: false,
    last: false
  }
  style: Object = {}  

  constructor(props: Props) {
    super(props);
    let borderRadius = this.props.borderRadius;
    if( this.props.first) {
      this.style.borderTopLeftRadius = borderRadius;
      this.style.borderTopRightRadius = borderRadius;
    } else if (this.props.last) {
      this.style.borderBottomLeftRadius = borderRadius;
      this.style.borderBottomRightRadius = borderRadius;
    } 
  }

  render() {
    return (
      <CardItem {...this.props} style={[this.props.style, this.style]}>
        {this.props.children}
      </CardItem>
    )
  }
}