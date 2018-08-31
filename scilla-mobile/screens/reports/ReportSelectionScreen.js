// @flow
import React from 'react';
import { StyleSheet, TouchableOpacity} from 'react-native';
import { Content, Text, View, Icon, Button} from "native-base";
import { AppText, Title } from "../../components";
import { ScreenNames } from "../../constants/Screens";
import styles from "./ReportStyles"; 


export default class ReportSelectionScreen extends React.Component<any, any> {
    static navigationOptions: any = {
      title: 'Report',
    };

    render() {
        const { navigate } = this.props.navigation;
      return (
        <Content contentContainerStyle={styles.content}>
        <View style={styles.mainView}>
            <Title style={styles.titleText}>What do you want to report?</Title>
            <TouchableOpacity 
                style={styles.selectionBtn}
                onPress={() => navigate(ScreenNames.ReportMeasurementSelection)}>
                <Text style={styles.selectionText}>Prompt experience record</Text>
                <Text style={styles.selectionText}>(Spasticity, Mood, Note)</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.selectionBtn}
                onPress={() => navigate(ScreenNames.ReportMeasurementSelection)}>
                <Text style={styles.selectionText}>Daily Evaluation</Text>
            </TouchableOpacity>

        </View>
        </Content>
      );
    }
  }

