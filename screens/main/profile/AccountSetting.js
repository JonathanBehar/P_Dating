import React, { Component } from 'react';
import { Linking, View, ScrollView, StyleSheet, Dimensions, TouchableOpacity, Image, SafeAreaView, Alert } from 'react-native';
import Text from "../../../components/Text";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { connect } from "react-redux";
import { updateUserState, logout } from "../../../actions/AuthActions";
import Icon from "react-native-vector-icons/Ionicons";
import Switch from 'react-native-switch-pro';
import LinearGradient from "react-native-linear-gradient";
import TermAndConditions from "../../../components/TermAndConditions";
import Geolocation from "@react-native-community/geolocation";
import Geocoder from "react-native-geocoder";

const { width, height } = Dimensions.get("window");

class AccountSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showPrivacyDialog: false
        };
    }

    _onChangeNotifiction = async (value) => {
        try {
            await firestore().collection("users").doc(this.props.user.uid).update({ notification: value });
            const { updateUserState } = this.props;
            updateUserState({ notification: value });
        } catch (e) {
            console.warn(e);
        }
    }

    _goToGeneralContact = () => {
        this.props.navigation.navigate("GeneralContact");
    }

    _logout = () => {
        auth()
            .signOut()
            .then(() => {
                this.props.navigation.navigate("Start");
            })
            .catch(e => {
                console.warn(e);
            })
    }

    _onPressPrivacyPolicy = () => {
        this.setState({ showPrivacyDialog: true });
    }

    _onPressTermsConditions = () => {
        this.setState({ showPrivacyDialog: true });
    }

    _onPressDeleteUser = async () => {
        
        // try {
        //     await firestore().collection("users").doc(this.props.user).delete();            
        //         this.props.navigation.navigate("Start");            
        // } catch (e) {
        //     console.warn(e);
        // }
    }

    _getCurrentLocation = () => {

        Alert.alert(
            "Get Location",
            "Do you want to update your location?",
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel'
                },
                {
                    text: 'UPDATE', onPress: () => {
                        Geolocation.setRNConfiguration({ skipPermissionRequests: true, authorizationLevel: "always" });
                        Geolocation.getCurrentPosition(
                            info => {
                                const position = { lat: info.coords.latitude, lng: info.coords.longitude }
                                Geocoder.geocodePosition(position).then(res => {
                                    console.warn(res);
                                    const { updateUserState } = this.props;
                                    firestore().collection("users").doc(this.props.user.uid).update({ position : position, country : res[0].countryCode, city : res[0].adminArea }).then(() => {
                                        updateUserState({ position : position, country : res[0].countryCode, city : res[0].adminArea });
                                    });
                                    this.setState({ position : position, country : res[0].countryCode, city : res[0].adminArea });
                                })
                                    .catch(err => {
                                        console.warn(err)
                                        alert(JSON.stringify(err));
                                    })
                            },
                            error => { alert(JSON.stringify(error)); },
                            {
                                // enableHighAccuracy: true,
                                timeout: 5000,
                                maximumAge: 5000,
                            },

                        )
                    }
                }
            ],
            { cancelable: false }
        )


    }

    _goInstagram = () => {
        Linking.openURL("https://www.instagram.com/pursuedating/?hl=en");
    }
    

    _goFacebook = () => {
        Linking.openURL("https://www.facebook.com/pursuedating");
    }

    render() {
        return (
            <SafeAreaView style={style.bg}>
                <ScrollView>
                    <View style={style.mainScrollView}>
                        <Text style={{ fontSize: 28, fontFamily: "DMSans-Medium", marginLeft: 10 }}>Account Settings</Text>
                        <View style={{ flexDirection: "row", marginLeft: 10, paddingVertical: 15, alignItems: "center" }}>
                            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(255,255,255,.15)", justifyContent: "center", alignItems: "center" }}>
                                <Icon name="options" color="#DA1DA2" size={24} />
                            </View>
                            <Text style={{ marginLeft: 10, fontSize: 18, fontFamily: "DMSans-Medium" }}>General Preferences</Text>
                        </View>
                        <TouchableOpacity style={style.itemContainer} onPress={this._goToGeneralContact}>
                            <Text style={style.itemLabel}>Phone Number</Text>
                            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                <Text style={style.itemValue}>{this.props.user.phoneNumber == "" ? "Enter your number" : this.props.user.phoneNumber}</Text>
                                <Icon name="chevron-forward" color="#9B9B9B" size={24} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={style.itemContainer} onPress={this._goToGeneralContact} >
                            <Text style={style.itemLabel}>Emaill Address</Text>
                            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                <Text style={style.itemValue}>{this.props.user.email}</Text>
                                <Icon name="chevron-forward" color="#9B9B9B" size={24} />
                            </View>
                        </TouchableOpacity>

                        <View style={{ ...style.itemContainer, borderBottomWidth: 0 }}>
                            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(255,255,255,.15)", justifyContent: "center", alignItems: "center" }}>
                                    <Icon name="options" color="#DA1DA2" size={24} />
                                </View>
                                <View style={{ marginLeft: 10, }}>
                                    <Text style={{ fontSize: 18, fontFamily: "DMSans-Medium" }}>General Preferences</Text>
                                    <Text style={{ color: this.props.user.notification ? "white" : "red" }}>{this.props.user.notification ? "On" : "Off"}</Text>
                                </View>
                            </View>
                            <View style={{ justifyContent: "center" }}>
                                <Switch
                                    value={this.props.user.notification}
                                    onSyncPress={this._onChangeNotifiction}
                                    circleColorActive="white"
                                    circleColorInactive="#DA1DA2"
                                    backgroundActive="#DA1DA2"
                                    backgroundInactive="white"
                                    circleStyle={{ borderColor: "transparent" }}
                                    style={{ paddingVertical: 15, paddingHorizontal: 5, width: 50, borderRadius: 20 }}
                                />
                            </View>
                        </View>
                        <View style={{ marginTop: 10 }}>
                            <TouchableOpacity style={style.itemContainer} onPress={this._getCurrentLocation} >
                                <Text style={style.itemLabel}>Location</Text>
                                <Text style={style.itemValue}>My Current Location</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={style.itemContainer} onPress={this._goToGeneralContact}>
                                <Text style={style.itemLabel}>Maximum Distance</Text>
                                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                    <Text style={style.itemValue}>{this.props.user.distance > 201 ? "Unlimited" : `${this.props.user.distance} mi`}</Text>
                                    <Icon name="chevron-forward" color="#9B9B9B" size={24} />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={style.itemContainer} onPress={this._goToGeneralContact}>
                                <Text style={style.itemLabel}>Show Me</Text>
                                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                    <Text style={{ ...style.itemValue, textTransform: "capitalize" }}>{this.props.user.show_me ? this.props.user.show_me : "Couple"}</Text>
                                    <Icon name="chevron-forward" color="#9B9B9B" size={24} />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ ...style.itemContainer, borderBottomWidth: 0 }} onPress={this._goToGeneralContact}>
                                <Text style={style.itemLabel}>Age Range</Text>
                                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                    <Text style={{ ...style.itemValue, textTransform: "capitalize" }}>{this.props.user.minAge} - {this.props.user.maxAge}</Text>
                                    <Icon name="chevron-forward" color="#9B9B9B" size={24} />
                                </View>
                            </TouchableOpacity>
                        </View>
                        <Text style={{ fontSize: 20, fontFamily: "DMSans-Medium", marginLeft: 10 }}>Legal</Text>
                        <TouchableOpacity style={style.itemContainer} onPress={this._onPressPrivacyPolicy} >
                            <Text style={style.itemLabel}>Privacy Policy</Text>
                            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                <Icon name="chevron-forward" color="#9B9B9B" size={24} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={style.itemContainer} onPress={this._onPressTermsConditions} >
                            <Text style={style.itemLabel}>Terms & Conditions</Text>
                            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                <Icon name="chevron-forward" color="#9B9B9B" size={24} />
                            </View>
                        </TouchableOpacity>

                        <Text style={{ fontSize: 24, fontFamily: "DMSans-Bold", marginVertical: 10, marginLeft: 10 }}>Follow Pursue</Text>
                        <View style={{ flexDirection: "row", justifyContent: "space-around", paddingHorizontal: 20, marginVertical: 15 }}>
                            <TouchableOpacity onPress={this._goInstagram}><Image source={require("../../../assets/images/instagram.png")} style={{ width: 60, height: 60 }} /></TouchableOpacity>
                            <TouchableOpacity onPress={this._goFacebook}><Image source={require("../../../assets/images/facebook.png")} style={{ width: 40, height: 40, marginTop: 10 }} /></TouchableOpacity>
                        </View>
                        <TouchableOpacity style={{ justifyContent: "center", alignItems: "center", }} onPress={this._logout} >
                            <LinearGradient colors={["#DA1DA2", "#6D0F51"]} style={style.logout}>
                                <Text style={{ fontSize: 20, fontFamily: "DMSans-Medium", textTransform: "uppercase" }}>Log Out</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        <View style={{ justifyContent: "center", alignItems: "center", marginVertical: 15 }}>
                            <Image source={require("../../../assets/images/heart-white.png")} style={{ width: 60, height: 42 }} />
                            <Text style={{ marginTop: 10, color: "#DA1DA2" }}>Version 1.0.0.1</Text>
                        </View>
                        <TouchableOpacity style={{ justifyContent: "center", alignItems: "center", }} onPress={this._onPressDeleteUser}>
                            <LinearGradient colors={["#EE2F23", "#6D0F51"]} style={style.logout}>
                                <Text style={{ fontSize: 20, fontFamily: "DMSans-Medium", textTransform: "uppercase" }}>Delete Account</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                <TermAndConditions
                    isVisible={this.state.showPrivacyDialog}
                    // onPressAccept={this._onToCAccept}
                    // onPressDecline={this._onToCDelcine}
                    action={false}
                    onClose={() => this.setState({ showPrivacyDialog: false })}
                />
            </SafeAreaView>
        );
    }
}

const style = StyleSheet.create({
    bg: {
        width: width,
        backgroundColor: "black",
        flex: 1,
        paddingTop: 20,
    },
    mainScrollView: {
        backgroundColor: "#262628",
        borderTopRightRadius: 70,
        paddingTop: 20,
        paddingHorizontal: 5,
        paddingBottom: 50
    },
    itemContainer: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#f3f3f322",
        justifyContent: "space-between",
        flexDirection: "row"
    },
    itemLabel: {
        fontSize: 14,
        fontFamily: "DMSans-Medium",
        color: "white"
    },
    itemValue: {
        fontSize: 14,
        fontFamily: "DMSans-Medium",
        color: "#9B9B9B"
    },
    logout: {
        width: 350,
        marginVertical: 15,
        paddingVertical: 10,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: "center",
        flexDirection: "row"
    }
})

const mapStateToProps = state => ({
    user: state.UserReducer
})

const mapDispatchToProps = dispatch => ({
    updateUserState: data => dispatch(updateUserState(data)),
    logout: () => dispatch(logout())
})

export default connect(mapStateToProps, mapDispatchToProps)(AccountSetting);
