// @flow
import React, { Component } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Spinner, CheckBox, Button } from "native-base"
import { IRegimen, IRegimenPhase, RegimenPhaseStatusOptions,
  PartOfDayOptions, RegimenUtils
} from "../../libs/scijs";
// import type {  }
import AppStore from "../../services/AppStore";
import AppClock from "../../services/AppClock";
import AppNotificationManager from "../../services/AppNotificationManager";
import { 
  Title, AppText, RegimenSchedule,
  ThreePillTableRow, ThreePillTableHeader
} from "../../components";
import { Feather } from "@expo/vector-icons";

import _ from 'lodash';
import Colors from "../../constants/Colors";
import { backgroundColor } from "../../components/Calendar/style";

const appStore = new AppStore();
const appClock = new AppClock();
const appNotiManager = new AppNotificationManager();

type State = {
  isLoading: boolean,
  regimen: ?IRegimen,
  regimenPhases: IRegimenPhase[],

  selectedRegimenOrder: ?number,
  regimenSelectedStatusMap: {[id: string | number]: boolean}
}

const initializeState = {
  isLoading: false, 
  regimen: null,
  regimenPhases: [],

  selectedRegimenOrder: null,
  regimenSelectedStatusMap: {}
}

const SCOPE = "RegimenSelectIdealPhaseScreen";
export default class RegimenSelectIdealPhaseScreen extends Component<any, State> {
  
  componentWillFocusSubscription: any;

  constructor(props: any) {
    super(props);

    this.componentWillFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      this.componentWillFocus
    );

    this.state = initializeState;
  }

  async componentDidMount() {

  }

  componentWillFocus = async (payload: any) => { 
    this.initializeState();
  }


  initializeState = async () => {
    let regimen = await appStore.getLatestRegimen();
    if (regimen == null) return;
    
    let regimenSelectedStatusMap = {}
    let regimenPhases = regimen.regimenPhases;
    _.forEach(regimenPhases, (phase) => {
      if(phase.status === RegimenPhaseStatusOptions.selected ) {
        regimenSelectedStatusMap[phase.phase] = true;
      } else {
        regimenSelectedStatusMap[phase.phase] = false;
      }
    })

    this.setState({
      regimen: regimen, 
      regimenPhases: regimenPhases,
      regimenSelectedStatusMap: regimenSelectedStatusMap
    })

  }

  didPressCheckbox = (e: any, phaseOrder: number) => {
    console.log(SCOPE, phaseOrder);
    const { regimenSelectedStatusMap, selectedRegimenOrder } = this.state;
    console.log(SCOPE, !regimenSelectedStatusMap[phaseOrder]);

    let newValue = !regimenSelectedStatusMap[phaseOrder];
    for(let key of Object.keys(regimenSelectedStatusMap)) {
      regimenSelectedStatusMap[key] = false;
    }
    regimenSelectedStatusMap[phaseOrder] = newValue;
    this.setState({
      selectedRegimenOrder: phaseOrder === selectedRegimenOrder ? null : phaseOrder,
      regimenSelectedStatusMap: regimenSelectedStatusMap
    }, () => {
      console.log(SCOPE, regimenSelectedStatusMap);
    });
  }

  didSelectIdealPhase = () => {
    const { regimen, selectedRegimenOrder } = this.state;
    if(regimen == null || selectedRegimenOrder == null) return;
    
    let phase = regimen.getRegimenPhaseByOrder(selectedRegimenOrder);
    if(phase == null) return;
    phase.status = RegimenPhaseStatusOptions.selected;
    regimen.completed = true;
    appStore.updateRegimen(regimen);
    this.props.navigation.popToTop();
  }

  renderPhaseRows = (): any => {
    const { regimenPhases, regimenSelectedStatusMap } = this.state;

    return _.map(regimenPhases, (phase) => {
      if(phase.status === RegimenPhaseStatusOptions.notTried) return null;

      let valuesForPillTableRow: string[] = [" ", " ", " "];
      let treatmentsByPartOfDayObject = phase.getTreatmentsByPartOfDay();

      let podOptions = [
        PartOfDayOptions.morning, 
        PartOfDayOptions.afternoon, 
        PartOfDayOptions.evening
      ]
      for(let podOption of podOptions) {
       let treatments = treatmentsByPartOfDayObject[podOption];
       let oneTreatment = treatments ? treatments[0]: null;

       let arrayIndex = RegimenUtils.partOfDay2ArrayIndex(podOption);
        valuesForPillTableRow[arrayIndex] = 
          oneTreatment 
          ? oneTreatment.getShortDescription()
          : " ";
      }
      
      let selected = regimenSelectedStatusMap[phase.phase];
      return (
        <View style={styles.phaseRow} key={phase.phase}>
          <View style={styles.checkboxView}>
            <Button 
              style={styles.checkbox}
              bordered={!selected}
              onPress={ (e) => this.didPressCheckbox(e, phase.phase)}
            >
              {!!selected && 
                <Feather name="check" size={20} color={"white"}/>
              }
            </Button>
          </View>
          <ThreePillTableRow 
            style={{flex: 3}}
            values={valuesForPillTableRow}
            highlighted={selected}
          />
        </View>
      )
    })
  }

  renderPhaseHeader = (): any => {
    return (
      <View style={styles.phaseRow}>
        <ThreePillTableHeader 
          columns={["Select", "Morning", "Afternoon", "Evening"]}
        />
      </View>
    )
  }

  render() {
    const { regimenPhases, selectedRegimenOrder } = this.state;
    return (
      <ScrollView contentContainerStyle={styles.content}>
        <Title>Select Ideal Dosage</Title>
        <AppText style={styles.paragraph}>
          Select a phase that works the best for you. 
          In the future, Scilla will use the schedule in this phase to help you track your 
          medication intake. 
        </AppText>
        <AppText style={styles.paragraph}>
          You can only select a phase that you have tried before. 
          Your regimen will stop once you select a phase that works the best for you. 
        </AppText>
        <View style={styles.phaseSelectionView}>
          {this.renderPhaseHeader()}
          {this.renderPhaseRows()}
        </View>
        <Button
          full
          style={{marginTop: 20}}
          disabled={selectedRegimenOrder == null}
          onPress={this.didSelectIdealPhase}
        >
          <AppText>Save</AppText>
        </Button>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 10, 
    paddingRight: 10,
    height: 700
  },
  paragraph: {
    justifyContent: 'flex-start', 
    alignItems: 'flex-start',
    textAlign: 'justify',
    marginLeft: 20, 
    marginRight: 20,
    marginTop: 10
  }, 
  phaseSelectionView: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    // backgroundColor: 'red'
    marginTop: 20
  },
  checkBoxCol: {
    flex: 1,
    flexDirection: "column",
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  phaseRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 40,
    width: '100%',
    marginBottom: 10
  },
  checkboxView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    // backgroundColor: 'green'
  },  
  checkbox: {
    height: 36,
    width: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'flex-start',
    color: Colors.accentColor
    
    // backgroundColor: Colors.accentColor
    // width: '100%',
    // marginBottom: 8
    // flex: 1
  }
})