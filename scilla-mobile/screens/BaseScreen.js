// @flow
import React from "react";

export default class BaseScreen extends React.Component<any, any> {

  navigate = (routeName: string, params?: any) => {
    this.props.navigation.navigate(routeName, params);
  }

  getNavParams() {
    return this.props.navigation.state.params;
  }

  setNavParams(params: Object) {
    this.props.navigation.setParams(params);
  }
}