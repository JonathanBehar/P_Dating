import React, { Component } from 'react'
import { Text, View, TextInput as RNTextInput } from 'react-native'
import { isIphoneX } from 'react-native-iphone-x-helper';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export class TextInput extends Component {

    constructor(props) {
        super(props);
        this.state = {
            focus : false
        }
    }

    _onBlur = () => {
        this.setState({focus : false});
    }
    _onFocus = () => {
        this.setState({focus : true});
    }
    render() {
        const defaultStyle={
            width : wp("90%"), 
            height: 50, 
            borderRadius : 10, 
            paddingHorizontal: 20, 
            margin:wp("1%"), 
            backgroundColor:this.props.dark?"#70707022":"rgba(255,255,255,0.25)",
            fontSize : 18,
            fontFamily :"DMSans-Medium",
            color : "white",
            borderColor : this.state.focus?"white":"transparent",
            borderWidth : 2
        }
        return (
            <RNTextInput 
                style={{...defaultStyle, ...this.props.style}}
                placeholder={this.props.placeholder}
                secureTextEntry={this.props.password?true:false}
                placeholderTextColor="#C9C9C9"
                keyboardType={this.props.email?"email-address":"default"}
                onBlur = {this._onBlur}
                onFocus = {this._onFocus}
                onChangeText = {(text) => this.props.onChangeText(text)}
                autoCapitalize = {this.props.disableAutoCapitalize?"none":"sentences"}
                value={this.props.value}
            />
        )
    }
}

export default TextInput
