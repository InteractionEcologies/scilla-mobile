// @flow
import React from "react";
import { 
  View, 
  Text, 
  StyleSheet,
  Button,
} from "react-native";
import {
  Container, 
  Header, 
  Content, 
  Footer
} from "native-base";

import { connect } from "react-redux";
import { fetchRegimens } from "../../redux/regimens/regimenActions";

import BaseScreen from "../BaseScreen";
import { ScreenNames } from "../../constants/Screens";
import appService from "../../AppService";
import RegimenList from "./components/RegimenList";

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
    this.navigate(ScreenNames.RegimenTypeSelection);
  }

  goToUpdateRegimen = (regimenId: string) => {
    console.dir(regimenId);
  }

  render() {
    // return (
    //   <View style={styles.regimen}>
    //     <RegimenList items={this.props.regimens}/>
    //     <Button title="Create Regimen" onPress={this.createRegimen}/>
    //   </View>
    // )
    return (
      <Container>
        <Content>
          <RegimenList 
            items={this.props.regimens}
            goToUpdateRegimen={this.goToUpdateRegimen}
          />
          <Button title="Create Regimen" onPress={this.goToCreateRegimen}/>
        </Content>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  regimen: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  createButton: {

  }
});

const mapStateToProps = state => {
  return {
    regimens: state.regimenReducer.regimens
  }
}

export default connect(mapStateToProps, null)(RegimenMainScreen);
