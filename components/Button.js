import React, { Component } from 'react';
import { View, Text } from 'react-native';
import {Button as RNButton } from "react-native-elements";

class Button extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const defaultContainerStyle = { paddingHorizontal: 20};
        const defaultButtonStyle = { paddingHorizontal: 20};

        return (
            <RNButton 
                title={this.props.title} 
                icon={this.props.icon}
                iconContainerStyle={this.props.iconContainerStyle}
                buttonStyle={{ ...defaultButtonStyle, ...this.props.buttonStyle }}
                containerStyle={{...defaultContainerStyle,...this.props.style}}
                onPress={this.props.onPress}
                type="solid"
            />
        );
    }
}

export default Button;
