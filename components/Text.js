import React, { Component } from 'react';
import { View } from 'react-native';
import { Text as RNText } from 'react-native-elements';

class Text extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <RNText style={{fontFamily:"DMSans-Regular", color:"white", ...this.props.style}}>
                {this.props.children}
            </RNText>
        );
    }
}

export default Text;
