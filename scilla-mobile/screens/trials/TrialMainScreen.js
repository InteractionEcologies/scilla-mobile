// @flow
import React from "react";
import { 
  View, 
  Text, 
  StyleSheet,
  Button,
} from "react-native";
import { connect } from "react-redux";
import { fetchTrials } from "../../redux/trials/trialActions";

import BaseScreen from "../BaseScreen";
import { ScreenNames } from "../../constants/Screens";
import appService from "../../AppService";
import TrialList from "../../components/TrialList";

class TrialMainScreen extends BaseScreen {
  static navigationOptions: any = {
    title: "Your Trials"
  };

  constructor(props: any) {
    super(props);
  }

  componentDidMount() {
    // appService.ds.fetchTrials(appService.auth.currentUser.uid)
    //   .then( (trials) => {
    //     console.log(trials);
    //   })
    this.props.dispatch(fetchTrials());
  }

  createTrial = () => {
    this.navigate(ScreenNames.TrialCreate);
  }

  render() {
    return (
      <View style={styles.trial}>
        <TrialList items={this.props.trials}/>
        <Button title="Create Trial" onPress={this.createTrial}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  trial: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  createButton: {

  }
});

const mapStateToProps = state => {
  return {
    trials: state.trialReducer.trials
  }
}

export default connect(mapStateToProps, null)(TrialMainScreen);
