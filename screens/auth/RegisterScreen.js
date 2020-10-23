import React, { Component } from 'react';
import { Alert, View, Dimensions, StyleSheet, ImageBackground, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import Text from "../../components/Text";
import TextInput from "../../components/TextInput";
import MCIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { isIphoneX } from 'react-native-iphone-x-helper';
import TermAndConditions from "../../components/TermAndConditions";
import auth from '@react-native-firebase/auth';
import Loading from "../Loading";
import { registerSuccess } from "../../actions/AuthActions";
import { connect } from "react-redux";
import LinearGradient from "react-native-linear-gradient";
const iphonex = isIphoneX();
const { width, height } = Dimensions.get("window");
class RegisterScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fullname: "",
            email: "",
            password: "",
            phoneNumber: "",
            countryDialCode: "",
            countryCode: "",
            toc: false,
            showToC: false,
            loading: false,
        };
    }

    _onPressToc = () => {
        const that = this;
        Alert.alert(
            "Agree to Terms and Conditions",
            "Do you agree to the terms and conditions of Pursue?",
            [
                {
                    text: "Disagree",
                    onPress: () => that.setState({ toc: false, showToC: false })
                },
                { 
                    text: "Agree", 
                    onPress: () =>  that.setState({ toc: true, showToC: false }) 
                }
            ],
            { cancelable: false }
        );

        // this.setState({ showToC: true })
    }

    _onChangeEmail = (email) => {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) this.setState({ email: email })
        else this.setState({ email: "" })
    }

    _onChangePassword = (password) => {
        this.setState({ password: password });
    }

    _onChangePhoneNumber = (props) => {
        const { isVerified, phoneNumber, selectedCountry } = props;
        if (isVerified) {
            this.setState({ countryCode: selectedCountry.code, countryDialCode: selectedCountry.dialCode, phoneNumber: phoneNumber });
        }
    };
    _onChangeFullName = (fullname) => {
        const regName = /^[a-zA-Z]+ [a-zA-Z]+$/;
        if (regName.test(fullname)) {
            this.setState({ fullname: fullname });
        } else {
            this.setState({ fullname: "" });
        }
    }

    _onToCAccept = () => {
        this.setState({ toc: true, showToC: false });
    }

    _onToCDelcine = () => {
        this.setState({ toc: false, showToC: false });
    }

    _onPressRegister = () => {
        if (this.state.fullname == "") {
            alert("Please enter your full name!");
            return;
        }
        if (this.state.password == "") {
            alert("Please enter your password!");
            return;
        }
        if (this.state.email == "") {
            alert("Please enter your email!");
            return;
        }
        // if (this.state.phoneNumber == "") {
        //     alert("Please enter your Phone Number!");
        //     return;
        // }
        if (!this.state.toc) {
            alert("Please confirm the Terms and Conditions!");
            return;
        }
        const { showToC, loading, toc, ...user } = this.state;
        this.setState({ loading: true });
        const { registerSuccess } = this.props;
        auth().createUserWithEmailAndPassword(user.email, user.password)
            .then(res => {
                this.setState({ loading: false });
                const data = {
                    fullname: this.state.fullname,
                };
                registerSuccess(data);
                this.props.navigation.navigate("UploadPhoto");
            })
            .catch(e => {
                // console.warn(e);
                var errorMsg = e.message;
                alert("The email address is already in use by another account.");
                this.setState({ loading: false });
            })

    }

    render() {
        const confirmed = this.state.fullname != "" && this.state.password != "" && this.state.email != "" && this.state.phonenumber != "" && this.state.toc;
        return (

            <LinearGradient colors={["#DA1DA2", "#6D0F51"]} style={style.bg} source={require("../../assets/images/bg.png")}>
                <KeyboardAvoidingView
                    behavior={Platform.OS == "ios" ? "padding" : "height"}
                    style={{ flex: 1 }}
                >
                    {/* <Text style={{color : "#FFFFFF", fontSize: 18, fontFamily: "DMSans-Medium"}}>1 / 7</Text> */}
                    <View style={{ width: width, backgroundColor: "rgba(254,254,254,.1)", borderTopRightRadius: 80, borderBottomLeftRadius: 60, justifyContent: "center", alignItems: "center" }}>
                        
                        <View style={style.logoContainer}>
                            <MCIcon name="account-plus-outline" size={42} color={"#EA455A"} />
                        </View>                        
                        <Text style={{ fontSize: iphonex ? 50 : 36, color: "white", marginTop: 0, marginBottom: 20, fontFamily: "DMSans-Medium"}}>Register</Text>
                        <TextInput placeholder="Full Name" onChangeText={this._onChangeFullName} />
                        <TextInput placeholder="Email" email onChangeText={this._onChangeEmail} disableAutoCapitalize />
                        <TextInput placeholder="Password" password onChangeText={this._onChangePassword} />
                        <TouchableOpacity style={style.remember} onPress={this._onPressToc} activeOpacity={1}>
                            <View style={{ ...style.rememberIcon, backgroundColor: this.state.remember ? "white" : "rgba(254,254,254,.25)" }}>
                                {this.state.toc && <MCIcon name="check" color="#EA465B" size={20} />}
                            </View>
                            <Text style={{ fontSize: 16, fontFamily: "DMSans-Bold" }}>Agree to Terms & Contditions</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={style.submit} onPress={this._onPressRegister} activeOpacity={confirmed ? .5 : 1}>
                            <MCIcon name="check" size={32} color={confirmed ? "#EA465B" : "#C9C9C9"} />
                        </TouchableOpacity>
                    </View>
                    <TermAndConditions
                        isVisible={this.state.showToC}
                        onPressAccept={this._onToCAccept}
                        onPressDecline={this._onToCDelcine}
                    />
                </KeyboardAvoidingView>
                {this.state.loading && <Loading />}

            </LinearGradient>
        );
    }
}

const style = StyleSheet.create({
    bg: {
        width: width,
        height: height,
        alignItems: "center",
        paddingTop: iphonex?hp("15%"):hp("10%")
    },
    logoContainer: {
        width: iphonex ? 90 : 80,
        height: iphonex ? 90 : 80,
        borderRadius: iphonex ? 45 : 40,
        backgroundColor: "white",
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -40
    },
    remember: {
        width: width - 60,
        marginTop: 15,
        flexDirection: "row",
        alignItems: "center"
    },
    rememberIcon: {
        width: 20,
        height: 20,
        borderRadius: 15,
        backgroundColor: "rgba(254,254,254,.25)",
        marginRight: 10,
        justifyContent: 'center',
        alignItems: "center"
    },

    submit: {
        width: width,
        height: 50,
        backgroundColor: "red",
        marginTop: 25,
        borderBottomLeftRadius: 70,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center"
    },

});
const mapStateToProps = state => ({
    user: state.UserReducer
})

const mapDispatchToProps = dispatch => ({
    registerSuccess: data => dispatch(registerSuccess(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(RegisterScreen);
