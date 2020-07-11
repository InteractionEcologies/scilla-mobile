// @flow
import React, { Component } from "react";
import type { IRegimen, ReminderConfigObject } from "../../libs/scijs";
import { View, Spinner, Card, CardItem, Button } from "native-base";
import { Title, AppText } from "../../components";
import { Styles as AppStyles } from "../../constants/Styles";
import { EditRemindersView } from "../../components/EditRemindersView";
import AppStore from "../../services/AppStore";
import AppNotificationManager from "../../services/AppNotificationManager";
import Colors from "../../constants/Colors";

const appStore = AppStore.instance;
const appNotiManager = AppNotificationManager.instance;

type State = {
  regimen: ?IRegimen,
  reminders: ReminderConfigObject[]
}

const initialState = {
  regimen: null,
  reminders: []
}

export default class RegimenEditReminderScreen extends Component<any, State> {
  static navigationOptions: any = {
    title: 'Reminders'
  };

  constructor(props: any) {
    super(props);

    this.state = initialState;
  }

  async componentDidMount() {
    let regimen = await appStore.getLatestRegimen();
    if(regimen) {
      this.setState({regimen: regimen, reminders: regimen.reminderConfigs});
    }
  }

  updateReminderConfig = (reminderId: string, newConfig: ReminderConfigObject) => {
    const { regimen  } = this.state;
    if(regimen == null) return;
    regimen.setReminderConfig(reminderId, newConfig);
    this.setState({reminders: regimen.reminderConfigs});
    appStore.updateRegimen(regimen);
    appNotiManager.setNotificationsByReminderConfigs(regimen.reminderConfigs);
  }

  goBack = () => {
    this.props.navigation.goBack();
  }

  render() {
    const { regimen, reminders} = this.state;
    return (
      // I think Content is just a wrapper of ScrollView. 
      // <Content contentContainerStyle={AppStyles.content}>
      <View style={AppStyles.contentBody}>
        {!!regimen &&
          <Card>
            <CardItem header bordered>
              <Title>Edit Reminders</Title>
            </CardItem>
            <CardItem>
              <EditRemindersView
                updateReminderConfig={this.updateReminderConfig}
                reminders={reminders}
              />
              
            </CardItem>
            <CardItem>
            <Button 
                full
                style={{flex: 1}}
                onPress={this.goBack}
              >
                <AppText>Save</AppText>
              </Button>
            </CardItem>
          </Card>
        }
        {!regimen && 
          <Spinner 
            color={Colors.primaryColor}
          />
        }
      </View>
      // </Content>
    )
  }
}