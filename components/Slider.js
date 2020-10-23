import React, { Component } from 'react';
import { View, Text } from 'react-native';
import RNSlider from "react-native-slider";

class Slider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value : 1
        };
    }



    render() {
        const { step = 1, trackWidth = 350, trackHeight = 7, thumbSize = 30, minValue = 1, maxValue= 20 } = this.props;
        const thumbStyle = {
            width: thumbSize,
            height: thumbSize,
            borderRadius: thumbSize / 2,
            backgroundColor: '#DA1DA2',
            borderColor: 'white',
            borderWidth: 4,
            ...this.props.thumbStyle

        }
        const trackStyle={ 
            backgroundColor:"black",
            height: trackHeight,
            borderRadius: 3, 
            width:trackWidth,
            ...this.props.trackStyle
        }
        const defaultStyle={ marginTop : 10, width : "100%"};
        return (
            <RNSlider
                value={this.props.value}
                minimumValue={minValue}
                maximumValue={maxValue}
                step={step}
                minimumTrackTintColor="#DA1DA2"
                maximumTrackTintColor="red"
                thumbTintColor="#DA1DA2"
                trackStyle={trackStyle}
                thumbStyle={thumbStyle}
                onValueChange = {this.props.onValueChange}
                style={{...defaultStyle, ...this.props.style}}
            />
        );
    }
}

export default Slider;
