// @flow
import React from "react";

export default class BaseScreen extends React.Component<any, any> {

  navigate = (screenName: string) => {
    this.props.navigation.navigate(screenName);
  }
}