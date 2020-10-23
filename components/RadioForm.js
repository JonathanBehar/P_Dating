import React, { Component } from 'react'
import { Text, View } from 'react-native'
import RNRadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
export class RadioForm extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            value3Index : props.value?props.value:0
        }
    }
    onPress = (value) => {
        this.setState({value3Index: value})
        this.props.onChange(value)
    }

    render() {
        const wrapStyle = { 
            backgroundColor : "#1F1F21", 
            borderRadius : 10, 
            borderWidth :1, 
            height : 55, 
            justifyContent:"center", 
            marginTop :10,
            ...this.props.itemContainerStyle
        }
        return (
            <RNRadioForm
                formHorizontal={false}
                animation={true}
            >
                {this.props.data.map((item, i) =>(
                <RadioButton labelHorizontal={true} key={i} wrapStyle={{...wrapStyle, borderColor : this.state.value3Index == item.value?"#DA1DA2":"#1F1F21"}} >
                    <RadioButtonLabel
                        obj={item}
                        index={i}
                        labelHorizontal={true}
                        onPress={this.onPress}
                        labelStyle={{fontSize: 20, color: 'white'}}
                        labelWrapStyle={{width : "100%"}}
                    />
                    <RadioButtonInput
                        obj={item}
                        index={i}
                        isSelected={this.state.value3Index === item.value}
                        onPress={this.onPress}
                        borderWidth={3}
                        buttonInnerColor={'#DA1DA2'}
                        buttonOuterColor={this.state.value3Index === item.value ? '#6D0F51' : 'white'}
                        buttonSize={15}
                        buttonOuterSize={25}
                        buttonStyle={{}}
                        buttonWrapStyle={{position: "absolute", right : 10}}
                    />
                </RadioButton>
                ))}
                
            </RNRadioForm>
        )
    }
}

export default RadioForm
