// @flow
import React, { Component } from 'react';
import styles from "../RegimenStyles";
import { StyleSheet } from "react-native";
import { 
  View, 
  Form, 
  Input,
  Item,
  Button
} from "native-base";
import { 
  AppText,
  Title,
  DotPageIndicator 
} from "../../../components";

const customStyles = StyleSheet.create({
  form: {
    marginTop: 30,
    // flexDirection: 'row',
    // justifyContent: 'space-between' 
  },
  button: {
    marginTop: 10,
    // marginLeft: 'auto',
    // marginRight: 'auto'
  }
});

type Props = {
  onRedeemed: (string) => Promise<void>,
  errorMsg: string
}

const initialState = {
  redeemCode: ''
}

class InputCodeView extends Component<Props, any> {
  
  constructor(props: Props) {
    super(props);

    this.state = initialState;

  }

  handleCodeChange = (redeemCode: string) => {
    console.log(redeemCode);
    this.setState({redeemCode: redeemCode.toUpperCase()});
  }

  submit = (e: any) => {
    this.props.onRedeemed(this.state.redeemCode);
    this.setState({redeemCode: ''})
  }

  render() {
    const { errorMsg } = this.props;
    const { redeemCode } = this.state;
    return (
      <View>
        <Title>Hello</Title>
        <AppText>Enter your 4-digit study code</AppText>
        <Form style={customStyles.form}>
            <Item regular>
              <Input
                onChangeText={this.handleCodeChange}
                value={redeemCode}
                autoCorrect={false}
                autoCapitalize="characters"
              />
            </Item>
        </Form>
        {!!errorMsg &&
          <AppText>{errorMsg}</AppText>
        }
        <Button 
          style={customStyles.button}
          full
          onPress={this.submit}
        >
          <AppText>Redeem</AppText>
        </Button>
      </View>
    )
  }
}

export default InputCodeView