import React, { Component } from 'react';
import { View,Image, Dimensions, StyleSheet, ImageBackground, TouchableOpacity, Platform, Alert, AsyncStorage } from 'react-native';
import Text from "../../components/Text";
import TextInput from "../../components/TextInput";
import MCIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { isIphoneX } from 'react-native-iphone-x-helper';
import auth from '@react-native-firebase/auth';
import firestore from "@react-native-firebase/firestore";
import { connect } from "react-redux";
import Loading from "../Loading";
import { registerSuccess, loginSuccess } from "../../actions/AuthActions";
import { updateUserState } from "../../actions/AuthActions";
import LinearGradient from "react-native-linear-gradient";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const iphonex = isIphoneX();
const { width, height } = Dimensions.get("screen");

class LoginScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            remember : false,
            defaultEmail: "",
            email : "",
            password : "",
            loading : false
        };
    }

    _onPressRemeber = () => {
        this.setState({remember : !this.state.remember});
    }

    rememberUser = async () => {
        try {
            await AsyncStorage.setItem("email", this.state.email);
            await AsyncStorage.setItem("password", this.state.password);
        } catch (error) {
            console.log(error.message);
        }
    }

    forgetUser = async () => {
        try {
            await AsyncStorage.removeItem('email');
            await AsyncStorage.removeItem('password');
        } catch (error) {
            console.log(error.message);
        }
    }

    async componentDidMount () {
        try {
            console.log(this.state.remember);
            const email = await AsyncStorage.getItem('email');
            const password = await AsyncStorage.getItem('password');
            console.log(email, password);
            if(email !== null) {
                this.setState({email: email, password: password, remember: true});
            } else {
                this.setState({email: '', password: '', remember: false});
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    _onChangeEmail = (email) => {
        console.log(email);
        this.setState({email : email})
    }

    _onChangePassword = (password) => {
        this.setState({password: password});
    }

    _onPressForgotPassword = () => {
        this.props.navigation.navigate("ForgotPassword");
    }

    _onPressSignUp = () => {
        this.props.navigation.navigate("Register");
    }

    _submit = () => {
        if(this.state.email == ""){
            alert("Please enter your Email!");
            return;
        }
        if(this.state.password == ""){
            alert("Please enter your password!");
            return;
        }
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.state.email)){}
        else {
            alert("Please enter valid email!");
            return;
        }
        this.setState({ loading: true });
        const { email, password } = this.state;
        const { registerSuccess, loginSuccess } = this.props;
        auth()
        .signInWithEmailAndPassword(email, password)
        .then(async res => {
            if(this.state.remember === true) {
                this.rememberUser();
            } else {
                this.forgetUser();
            }
            const { uid } = res.user;
            const userDoc = await firestore().collection("users").doc(uid).get();
            const userData = userDoc.data();

            if (userData === undefined) {
                const { email } = res.user;
                const data = { 
                    email : email, 
                    uid : uid
                }
                registerSuccess(data);
                this.props.navigation.navigate("UploadPhoto");
            }
            else { loginSuccess(userData); }
            this.setState({ loading: false });
        })
        .catch(error => {
            this.setState({ loading: false });
            if (error.code == "auth/invalid-email") Alert.alert("Invaild email");
            else if (error.code == "auth/user-disabled") Alert.alert("Your account was disabled");
            else if (error.code == "auth/wrong-password") Alert.alert("Password is wrong");
            else if (error.code == "auth/user-not-found") {
                Alert.alert("You are not registered!");
            }
            else { 
                console.warn(error);
            }
        })

    }

    render() {
        return (
            <LinearGradient colors={["#DA1DA2", "#6D0F51"]} style={style.bg} source={require("../../assets/images/bg.png")}>
                <View style={{width:width, backgroundColor :"rgba(254,254,254,.1)", borderTopRightRadius:80, borderBottomLeftRadius:60, justifyContent: "center", alignItems: "center"}}>
                    <View style={style.logoContainer}>
                        <Image source={require("../../assets/images/heart-pink.png")}/>
                    </View>
                    <Text style={{fontSize : iphonex?50:36, color:"white", marginTop : 0, marginBottom : 20, fontFamily:"DMSans-Medium"}}>Pursue</Text>
                    <TextInput  placeholder="Email" email onChangeText={this._onChangeEmail} value={this.state.email} disableAutoCapitalize/>
                    <TextInput placeholder="Password" value={this.state.password} password onChangeText={this._onChangePassword}/>
                    <TouchableOpacity style={style.remember} onPress={this._onPressRemeber} activeOpacity={1}>
                        <View style={{...style.rememberIcon, backgroundColor:this.state.remember?"white":"rgba(254,254,254,.25)"}}></View>
                        <Text style={{fontSize : 16, fontFamily:"DMSans-Bold"}}>Remeber this account?</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={style.submit} onPress={this._submit} activeOpacity={1}>
                        <Text style={{color : this.state.password&&this.state.email?"red":"gray", fontSize : 20}}>LOGIN</Text>
                    </TouchableOpacity>
                </View>
                <View style={style.bottom}>
                    <TouchableOpacity style={{flexDirection :"row"}} onPress={this._onPressForgotPassword}>
                        <MCIcon name="key" size={20} color={"white"}/>
                        <Text style={{fontSize : 18, fontFamily:"DMSans-Bold", marginLeft : 10}}>Forgot Password?</Text>
                    </TouchableOpacity>
                    <View style={{marginVertical : 10, width : 350, height : 3, backgroundColor :"rgba(255,255,255,0.3)"}}></View>
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

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
