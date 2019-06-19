// @flow
import React from "react";
import { View } from "native-base";
import styles from "../RegimenStyles";
import { TextBullet, Title, AppText, 
  DotPageIndicator
} from "../../../components"

type Props = {
  numStates: number, 
  currentStateIndex: number
}

export default class IntroView extends React.Component<Props, any> {

  render() {
    return (
      <View styles={styles.mainView}>
        <Title>Start Baclofen Regimen</Title>
        <DotPageIndicator 
          totalDots={this.props.numStates}
          activeDotIndex={this.props.currentStateIndex}
          dotColor='grey'
          activeDotColor='black'  
        />
        <TextBullet>
          <AppText>
            In this regimen, Scilla will help you experiment the appropriate
            amount of Baclofen dosage.
          </AppText>
        </TextBullet>

        <TextBullet>
          <AppText>
            The whole medication plan will take 1-6 weeks depending on your goal and 
            current intake. 
          </AppText>
        </TextBullet>
        
        <TextBullet>
          <AppText>
            During this period, you are encouraged to report 
            your health status everyday.
          </AppText>
        </TextBullet>
        
        <TextBullet>
          <AppText>
            Scilla will remind you to take your medicine.
          </AppText>
        </TextBullet>
      </View>
    )
  }
}