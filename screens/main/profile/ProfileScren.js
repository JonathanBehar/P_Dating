import React, { Component } from 'react';
import { View, Image, Dimensions, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome5";
import Text from "../../../components/Text";
import { connect } from "react-redux";
import { occupations, religiousAffiliation } from "../../../constants";
import LinearGradient from "react-native-linear-gradient";
import moment from "moment";
import firestore from "@react-native-firebase/firestore";
import { updateUserState } from "../../../actions/AuthActions";
import { isIphoneX } from 'react-native-iphone-x-helper'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const { width } = Dimensions.get("window");

class ProfileScren extends Component {
    constructor(props) {
        super(props);
        this.state = {
            now : new Date(),
            boostExpireMins : 0,
            boostExpireSecs : 0
        };
    }

    _onPressEdit = () => {
        this.props.navigation.navigate("EditProfile");
    }
    _onPressSetting = () => {
        this.props.navigation.navigate("AccountSetting")
    }

    _onPressSubscription = () => {
        this.props.navigation.navigate("PlansScreen");
    }

    _onPressBoost = () => {

        const { uid } = this.props.user;
        
        const expireAt =  new Date(moment().add(30, "minutes"));
        Alert.alert(
            "Boost your Profile!",
            "Do you want to boost your profile?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "OK", onPress: async () => {
                    try{
                        await firestore().collection("users").doc(uid).update({
                            boost : true,
                            boostExpireAt : expireAt
                        });
                        const { updateUserState } = this.props;
                        updateUserState({ 
                            boost : true,
                            boostExpireAt : expireAt
                        });
                        this._boostTimeHandler();
                    }
                    catch(e){
                        console.warn(e);
                    }
                }}
            ],
            { cancelable: false }
        )
    }

    _boostTimeHandler = () => {
        const that = this;
        if(that.props.user.boostExpireAt != ""){
            const boost =typeof that.props.user.boostExpireAt.toDate == "undefined"?that.props.user.boostExpireAt:that.props.user.boostExpireAt.toDate();
            const { updateUserState } = this.props;
            var timerHandler = setInterval(function(){
                let diff = moment(boost).diff(new Date(), "seconds");
                let mins = parseInt(diff/60);
                let seconds = diff%60; 
                that.setState({boostExpireMins : mins, boostExpireSecs : seconds});
                if(diff <= 0 ) {
                    clearInterval(timerHandler);
                    updateUserState({boost : false, boostExpireAt : ""})
                } 
            },1000);
        }
    }
    componentDidMount() {
        const that = this;
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this._boostTimeHandler();
        });
    }

    componentWillUnmount = () => {
        this._unsubscribe();
    }

    render() {
        return (
            <View style={style.bg}>
                <Image
                    source={require("../../../assets/images/bg-white.png")}
                    style={{ position: "absolute", width: width, marginTop: -50 }}
                />
                <View style={{ flex: 1 }}>
                    <View style={style.headerBar}>
                        <TouchableOpacity onPress={this._onPressSetting}>
                            <Icon name="cog" color="white" size={28} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this._onPressEdit}>
                            <Text style={{ fontSize: 20, color: "#DA1DA2", fontFamily: "DMSans-Bold", textTransform: "uppercase"}} >Edit</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ justifyContent: "center", alignItems: "center" }}>
                        <Image source={{ uri: this.props.user.photos[0] }} style={{ width: wp("30%"), height: wp("30%"), borderRadius: 80 }} />
                        <Text style={style.username}>{this.props.user.fullname}</Text>
                        <View style={{ flexDirection: "row", flexWrap :"wrap"}}>
                            <View style={style.tagContainer}><Text style={style.tag}>{occupations[this.props.user.occupation]}</Text></View>
                            <View style={style.tagContainer}><Text style={style.tag}>{religiousAffiliation[this.props.user.religious]}</Text></View>
                        </View>
                        <Text style={{ marginVertical: 15, fontSize: 18 }}>{(this.props.user.city !="" && this.props.user.country !="")?`${this.props.user.city}, ${this.props.user.country}` :"Unknown Location"}</Text>
                        <TouchableOpacity onPress={this._onPressSubscription} >
                            <LinearGradient colors={["#DA1DA2", "#6D0F51"]} style={style.getPlus}>
                                <Image source={require("../../../assets/images/heart-white.png")} style={{ width: 35, height: 25 }} />
                                <Text style={{ marginLeft: 10, fontSize: 16, fontFamily: "DMSans-Bold" }}>
                                    {this.props.user.plan == "free" ? "GET PURSUE PLUS" : "UPGRADE SUBSCRIPTION"}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <View style={{ marginTop: 25, paddingHorizontal: 30 }}>
                            <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }} onPress={this._onPressBoost}>
                                <Image source={require("../../../assets/images/premium-icon.png")} />
                                <Text style={{ marginLeft: 10, fontSize: 16, fontFamily: "DMSans-Medium" }}>
                                    {
                                        (this.props.user.boost && this.state.boostExpireMins>0&&this.state.boostExpireSecs>0 )?
                                        `${this.state.boostExpireMins} min ${this.state.boostExpireSecs} secs`:
                                        "Boost my Profile"}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }} onPress={this._onPressSubscription}>
                                <Image source={require("../../../assets/images/subscription-icon.png")} />
                                <Text style={{ marginLeft: 10, fontSize: 16, fontFamily: "DMSans-Medium" }}>{this.props.user.plan == "free" ? "Get Premium" : `Expire At : ${moment(this.props.user.expireAt.toDate()).format("MMM DD, YYYY")}`} </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                                <Image source={require("../../../assets/images/rate-icon.png")} />
                                <Text style={{ marginLeft: 10, fontSize: 16, fontFamily: "DMSans-Medium" }}>Rate Us</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

const style = StyleSheet.create({
    bg: {
        width: width,
        flex: 1,
        backgroundColor: "#262628",
        paddingTop : isIphoneX() ? 20:0
    },
    headerBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 30,
        paddingHorizontal: 30,
        marginBottom: 10
    },
    tagContainer : {
        paddingHorizontal: 6,
        paddingVertical: 6,
        backgroundColor: "#DA1DA2",
        marginHorizontal: 5,
        borderRadius: 10,
    },
    tag: {
        color: "white",
        fontSize: 14, 
        fontFamily: "DMSans-Medium"
    },
    username: {
        fontSize: 28,
        marginVertical: 10,
    },
    getPlus: {
        width: 300,
        // marginTop: 15,
        paddingVertical: 10,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: "center",
        flexDirection: "row"
    }
})


const mapStateToProps = (state) => {
    return {
        user: state.UserReducer
    }
}
const mapDispatchToProps = dispatch => ({
    updateUserState : data => dispatch(updateUserState(data))
})



export default connect(mapStateToProps, mapDispatchToProps)(ProfileScren);
