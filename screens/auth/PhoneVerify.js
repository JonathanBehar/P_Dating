import React, { Component } from 'react';
import { View,Image, Dimensions, StyleSheet, ImageBackground, TouchableOpacity, Platform, Alert } from 'react-native';
import Text from "../../components/Text";
import TextInput from "../../components/TextInput";
import MCIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { isIphoneX } from 'react-native-iphone-x-helper';
import auth from '@react-native-firebase/auth';
import firestore from "@react-native-firebase/firestore";
import { connect } from "react-redux";
import IntlPhoneInput from 'react-native-intl-phone-input';
import Loading from "../Loading";
import { registerSuccess, loginSuccess } from "../../actions/AuthActions";
import { updateUserState } from "../../actions/AuthActions";
import LinearGradient from "react-native-linear-gradient";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
const iphonex = isIphoneX();
const { width, height } = Dimensions.get("screen");

class PhoneVerifyScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uid: "",
            code : "",
            phoneNumber : "",
            isVerified: null,
            isFirst: true,
            loading : false
        };
    }

    _onChangeCode = (code) => {
        this.setState({code : code})
    }

    _onChangePhoneNumber = (props) => {
        const { isVerified, phoneNumber, selectedCountry } = props;
        this.setState({isVerified: isVerified});
        if (isVerified) {
            this.setState({ countryCode: selectedCountry.code, countryDialCode: selectedCountry.dialCode, phoneNumber: phoneNumber });
        }
    }

    _onPressSignUp = () => {
        this.props.navigation.navigate("Register");
    }

    _onPressSend = async () => {
        if(this.state.phoneNumber == ""){
            alert("Please enter your Phone Number!");
            return;
        }
        if(!this.state.isVerified) {
            alert("Please enter valid Phone Number!");
            return;
        }
        this.setState({ loading: true });
        const userDoc = await firestore().collection("users").where( 'countryCode', '==', this.state.countryCode ).where( 'countryDialCode', '==', this.state.countryDialCode ).where( 'phoneNumber', '==', this.state.phoneNumber ).get();
        if(userDoc.docs.length) {
            userDoc.forEach(doc => {
                this.setState({uid: doc.data().uid});
            })
            await auth().signInWithPhoneNumber(this.state.countryCode + this.state.countryDialCode + this.state.phoneNumber)
                .then(confirmResult => {
                    alert("We sent your verification code to your phone. Please check and enter the code.");
                    this.setState({ confirmResult, loading: false, isFirst: false });
                })
                .catch(error => {
                    if(error.code == "auth/too-many-requests") alert("We have blocked all requests from your phone because of too many requests. Try again later.");
                    else if(error.code == "auth/app-not-authorized") alert("App not authorized error: This app might be not authorized to use Firebase Authentication or running on a physical device.");
                    else if(error.code == "auth/invalid-phone-number") alert("This phone number is invalid.");
                    else if(error.code == "auth/session-expired") alert("The sms code has expired. Please re-send the verification code to try again.");
                    else alert(error.message);
                    this.setState({ loading: false, isFirst: false });
                });
            this.setState({ loading: false });
        } else {
            alert("You couldn't login with your phone because you didn't set your phone number in your account setting.");
            this.setState({ loading: false });
        }
    }

    _submit = () => {
        const { code } = this.state;
        if(this.state.phoneNumber == ""){
            alert("Please enter your Phone Number!");
            return;
        }
        if(!this.state.isVerified) {
            alert("Please enter valid Phone Number!");
            return;
        }
        if(code == ""){
            alert("Please enter your Code!");
            return;
        }
        this.setState({ loading: true });
        const { confirmResult } = this.state;
        if(confirmResult == undefined) {
            alert('Invaild Code');
        }
        const { registerSuccess, loginSuccess } = this.props;
        confirmResult.confirm(code)
            .then(async user => {
                const userDoc = await firestore().collection("users").doc(this.state.uid).get();
                const userData = userDoc.data();
                if (userData === undefined) { 
                    const data = {
                        uid : this.state.uid
                    }
                    registerSuccess(data);
                    this.props.navigation.navigate("UploadPhoto");
                    this.setState({ loading: false });
                }
                else {
                    loginSuccess(userData);
                    this.setState({ loading: false });
                }
            })
            .catch((error) => {
                alert(error.message);
                this.setState({ loading: false });
            });
    }

    render() {
        return (
            <LinearGradient colors={["#DA1DA2", "#6D0F51"]} style={style.bg} source={require("../../assets/images/bg.png")}>
                <View style={{width:width, backgroundColor :"rgba(254,254,254,.1)", borderTopRightRadius:80, borderBottomLeftRadius:60, justifyContent: "center", alignItems: "center"}}>
                    <View style={style.logoContainer}>
                        <Image source={require("../../assets/images/heart-pink.png")}/>
                    </View>
                    <Text style={{fontSize : iphonex?50:36, color:"white", marginTop : 0, marginBottom : 20, fontFamily:"DMSans-Medium"}}>Pursue</Text>
                    <Text style={{fontSize : iphonex?25:15, color:"white", marginTop : 0, marginBottom : 0, fontFamily:"DMSans-Medium", textAlign: "center", marginLeft: 20, marginRight: 20}}>
                        Please enter your phone number.
                    </Text>
                    <View style={{ width: wp("90%"), marginTop: iphonex ? 10 : 7, marginBottom: 0 }}>
                        <IntlPhoneInput
                            onChangeText={this._onChangePhoneNumber}
                            defaultCountry="US"
                            containerStyle={{ backgroundColor: "rgba(255,255,255,0.25)", height: 45, justifyContent: "center", alignItems: "center" }}
                            phoneInputStyle={{ color: 'white', fontSize: 16, marginLeft: 10, justifyContent: "center", alignItems: "center", paddingVertical : 5 }}
                            placeholder="Enter you Phone Number"
                            dialCodeTextStyle={{ fontSize: 18, color: "white" }}
                            flagStyle={{fontSize : 22}}
                        />
                    </View>
                    <TouchableOpacity onPress={this._onPressSend}>
                        <Text style={{fontSize : 18, fontFamily:"DMSans-Bold", marginTop: 20, marginBottom: 20}}>{this.state.isFirst?'Send Code':'Not received yet? Resend Code'}</Text>
                    </TouchableOpacity>
                    <TextInput  placeholder="Enter your verification code" onChangeText={this._onChangeCode} disableAutoCapitalize/>
                    <TouchableOpacity style={style.submit} onPress={this._submit} activeOpacity={1}>
                        <Text style={{color : this.state.code != ''?"red":"gray", fontSize : 20}}>LOGIN</Text>
                    </TouchableOpacity>
                </View>
                <View style={{marginTop: 20, justifyContent: "center", alignItems: "center"}}>
                    <View style={{marginVertical : 10, width : 350, height : 3, backgroundColor :"rgba(255,255,255,0.3)", marginTop: 0}}></View>
                    <TouchableOpacity style={{flexDirection :"row"}} onPress={this._onPressSignUp}>
                        <MCIcon name="account-plus-outline" size={22} color={"white"}/>
                        <Text style={{fontSize : 18, fontFamily:"DMSans-Bold", marginLeft : 10}}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
                {this.state.loading && <Loading /> }
            </LinearGradient>
        );
    }
}

const style=StyleSheet.create({

    bg : {
        width:width,
        height:height,
        alignItems:"center", 
        paddingTop : iphonex?100:hp("15%")
    },
    logoContainer : {
        width: iphonex?90:80, 
        height:iphonex?90:80, 
        borderRadius : iphonex?45:40, 
        backgroundColor :"white", 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginTop : -40
    },
    remember : {
        width:width - 70, 
        marginTop:10, 
        flexDirection:"row", 
        alignItems:"center"
    },
    rememberIcon : {
        width : 20, 
        height:20, 
        borderRadius : 15, 
        backgroundColor:"rgba(254,254,254,.25)", 
        marginRight : 10
    },
    
    submit : {
        width :width, 
        height :wp("14%"), 
        backgroundColor :"red", 
        marginTop : 25,
        borderBottomLeftRadius :70, 
        backgroundColor : "white",
        justifyContent:"center", 
        alignItems :"center"
    },

    bottom : {
        // position: "absolute",
        // bottom : iphonex?200:Platform.OS=="ios"?100:100,
        marginTop : 40,
        justifyContent:"center",
        width : width,
        height : 50,
        alignItems:"center"
    }

});

const mapStateToProps = state => {
    return {
        user : state.UserReducer
    }
}
const mapDispatchToProps = dispatch => ({
    registerSuccess : data => dispatch(registerSuccess(data)),
    loginSuccess : data => dispatch(loginSuccess(data)),
    updateUserState : data => dispatch(updateUserState(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(PhoneVerifyScreen);
