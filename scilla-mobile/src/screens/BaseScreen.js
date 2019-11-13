/* eslint-disable no-unused-vars */
// @flow
import React, { Component } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Spinner } from "native-base"
import { IRegimen, IRegimenPhase } from "../libs/scijs";
// import type {  }
import AppStore from "../services/AppStore";
import AppClock from "../services/AppClock";
import AppNotificationManager from "../services/AppNotificationManager";
import { RegimenSchedule } from "../components";

const appStore = new AppStore();
const appClock = new AppClock();
const appNotiManager = new AppNotificationManager();

export default class BaseScreen extends Component<any, any> {
  
  componentWillFocusSubscription: any;

  constructor(props: any) {
    super(props);

    this.componentWillFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      this.componentWillFocus
    );
  }

  async componentDidMount() {

  }

  componentWillFocus = async (payload: any) => { 

  }


  componentWillUnmount() {
    this.componentWillFocusSubscription.remove();
  }

  render() {
    return (
      <View>

      </View>
    );
  }

  
}