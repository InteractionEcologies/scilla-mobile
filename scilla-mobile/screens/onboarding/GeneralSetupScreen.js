import React from 'react';
import { 
  View,
  Picker,
  Button,
  StyleSheet,
} from 'react-native';
import firebase from "firebase";

export default class GeneralSetupScreen extends React.Component {
  state = {
    role: "patient"
  }

  static navigationOptions = {
    title: "Setup Your Role"
  }

  constructor() {
    super(); 
    this.db = firebase.firestore();
    this.user = firebase.auth().currentUser;
  }

  componentDidMount() {
    firebase.firestore().
    // this.db.collection("userprofiles").doc("")
  }

  handleSetup() {
    firebase.firestore().
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>What is your role?</Text>
        <Picker 
          selectedValue={this.state.role}
          style={styles.picker}
          onValueChange={ (itemValue, itemIndex) => this.setState({role: itemValue})}
        >
          <Picker.Item label="Patient" value="patient" />
          <Picker.Item label="Primary Caregiver" value="primary_caregiver" />
        </Picker>
        <Button title="Done" onPress={this.handleSetup}> 
        </Button>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  picker: {
    height: 50, 
    width: 100
  }
})