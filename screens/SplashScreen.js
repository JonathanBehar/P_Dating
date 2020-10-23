import React, { Component } from 'react';
import { View, StyleSheet, ImageBackground, Dimensions } from 'react-native';
import { updateUserState } from "../actions/AuthActions";
import auth from "@react-native-firebase/auth"
import firestore from "@react-native-firebase/firestore";

const { width, height } = Dimensions.get("window");

class SplashScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        const that = this;
        setTimeout(() =>{
            that.props.navigation.navigate("AuthStack");
        }, 2000)
    }

    render() {
        return (
            <ImageBackground style={style.container} source={require("../assets/images/splash.png")}>
                <View style={style.overlay}></View>
            </ImageBackground>
        );
    }
}

const style = StyleSheet.create({

    container : {
        width : width, 
        height : height
    },
    overlay : {
        width : width,
        height : height,
        position: "absolute",
        backgroundColor: "rgba(144,19,254,0.43)"
    }

})


export default SplashScreen;
