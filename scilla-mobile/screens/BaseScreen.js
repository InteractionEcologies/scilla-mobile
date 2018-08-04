// @flow
import React from "react";

export default class BaseScreen extends React.Component<any, any> {

  navigate = (routeName: string, params?: any) => {
    this.props.navigation.navigate(routeName, params);
  }

  get navParams() {
    return this.props.navigation.state.params;
  }
}