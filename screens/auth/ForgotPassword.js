import React, { Component } from 'react'
import {  View,ImageBackground, StyleSheet, Dimensions,TouchableOpacity } from 'react-native'
import { isIphoneX } from 'react-native-iphone-x-helper';
import FIcon from "react-native-vector-icons/Fontisto";
import Text from "../../components/Text";
import TextInput from "../../components/TextInput";
import MCIcon from "react-native-vector-icons/MaterialCommunityIcons";

const { width, height } = Dimensions.get("window");
const iphonex = isIphoneX();

export class ForgotPassword extends Component {

    constructor(props) {
        super(props);
        this.state={
            email : ""
        }
    }

    _onChangeEmail = (email) => {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) this.setState({email : email})
        else this.setState({email : ""})
    }

    _onResetPassword = () => {
        
    }


    render() {
        return (
            <ImageBackground style={style.bg} source={require("../../assets/images/bg.png")}>
                
                <View style={style.iconContainer}>
                    <FIcon name="dizzy" color="white" size={40} />
                </View> 
                <View style={{justifyContent:"center", alignItems:"center"}}>
                    <Text style={{marginTop : 20, fontSize : 32, fontFamily:"DMSans-Bold"}}>Forgot Password?</Text>
                    <Text style={{marginTop : 10, fontSize:16, textAlign: "center", paddingHorizontal : 40}}>Enter the email address associated with your account.</Text>
                </View>
                <View style={{width : 30, height:5, backgroundColor:"rgba(254,254,254,.25)", marginTop: 20}}></View>
                <View style={{marginTop : 20 ,justifyContent:"center", alignItems:"center"}}>
                    <TextInput email placeholder="Email address" onChangeText={this._onChangeEmail} />
                    <TouchableOpacity onPress={this._onResetPassword} style={{marginTop : 10, backgroundColor :"white", width:340, height : 50, borderRadius : 10, justifyContent: 'center', alignItems:"center"}}>
                        <MCIcon name="check" size={28} color={this.state.email == ""?"#C9C9C9":"#EA465B"} />
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        )
    }
}

const style=StyleSheet.create({

    bg : {
        width:width,
        height:height,
        alignItems:"center", 
        paddingTop : iphonex?150:120
    },
    iconContainer : {
        width: iphonex?90:80, 
        height:iphonex?90:80, 
        borderRadius : iphonex?45:40, 
        backgroundColor :"rgba(254,254,254,.25)", 
        justifyContent: 'center', 
        alignItems: 'center', 
    },
})

export default ForgotPassword
