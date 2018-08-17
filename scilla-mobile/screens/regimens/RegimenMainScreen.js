// @flow
import React from "react";
// import { View, StyleSheet } from "react-native";
import {
  View,
  StyleSheet,
  Container, 
  Header, 
  Content, 
  Button,
  Footer,
  Text, 
} from "native-base";

import { connect } from "react-redux";
import { fetchRegimens } from "../../redux/regimens/regimenActions";

import BaseScreen from "../BaseScreen";
import { ScreenNames } from "../../constants/Screens";
import appService from "../../AppService";
import RegimenList from "./views/RegimenList";
import styles from "./RegimenStyles";
import { AppText } from "../../components"

class RegimenMainScreen extends BaseScreen {
  static navigationOptions: any = {
    title: "Your Regimens"
  };

  constructor(props: any) {
    super(props);
  }

  componentDidMount() {
    // appService.ds.fetchRegimens(appService.auth.currentUser.uid)
    //   .then( (regimens) => {
    //     console.log(regimens);
    //   })
    this.props.dispatch(fetchRegimens());
  }

  goToCreateRegimen = () => {
    this.navigate(ScreenNames.RegimenCreation);
  }

  goToUpdateRegimen = (regimenId: string) => {
    console.dir(regimenId);
  }

  render() {
    return (
      <Container>
        <Content contentContainerStyle={styles.content}>
          <RegimenList 
            items={this.props.regimens}
            goToUpdateRegimen={this.goToUpdateRegimen}
          />
          <View>
          <Button full onPress={this.goToCreateRegimen}>
            <AppText>Create Regimen</AppText>
          </Button>
          </View>
        </Content>
      </Container>
    )
  }
}

const mapStateToProps = state => {
  return {
    regimens: state.regimenReducer.regimens
  }
}

export default connect(mapStateToProps, null)(RegimenMainScreen);
