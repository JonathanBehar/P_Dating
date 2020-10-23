import React, { Component } from 'react';
import { ScrollView, View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Text from "../../../components/Text";
import TextInput from "../../../components/TextInput";
import { connect } from "react-redux";
import { updateUserState } from "../../../actions/AuthActions";
import { updateUserSetting } from "../../../actions/UserActions";
import Loading from "../../Loading";
import firestore from "@react-native-firebase/firestore";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome5";
import MCIcon from "react-native-vector-icons/MaterialCommunityIcons";
import IntlPhoneInput from 'react-native-intl-phone-input';
import Slider from "../../../components/Slider";
import MultiSlider from '@ptomasroos/react-native-multi-slider';
const { width, height } = Dimensions.get("window");
import RadioForm from "../../../components/RadioForm";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

class GeneralContact extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: props.user.email,
            countryCode: props.user.countryCode,
            phoneNumber: props.user.phoneNumber,
            countryDialCode: props.user.countryDialCode,
            distance: props.user.distance,
            maxAge: props.user.maxAge,
            minAge: props.user.minAge,
            show_me: props.user.show_me,
            loading: false
        };
    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerRight: navigation.state.params && navigation.state.params.headerRight
        }
    }

    _onSave = async () => {
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.state.email)) {
            alert("Please enter valid email address!");
            return;
        }
        this.setState({ loading: true });

        const { loading, ...user } = this.state;
        try {
            await firestore().collection("users").doc(this.props.user.uid).update(user);
            const { updateUserSetting } = this.props;
            user.position = this.props.user.position;
            user.uid = this.props.user.uid;
            updateUserSetting(user);
            this.setState({ loading: false })
        }
        catch (e) {
            console.warn(e);
            this.setState({ loading: false });
        }

    }
    _onChangeEmailAddress = (email) => {
        this.setState({ email: email });
    }

    _onChangePhoneNumber = (props) => {
        const { isVerified, phoneNumber, selectedCountry } = props;
        if (isVerified) {
            this.setState({ countryCode: selectedCountry.code, countryDialCode: selectedCountry.dialCode, phoneNumber: phoneNumber });
        }
    };

    _onChangeDistance = (distance) => {
        this.setState({ distance: distance });
    }

    _onChangeAgeRange = (value) => {
        this.setState({ minAge: value[0], maxAge: value[1] });
    }

    _onChangeShowMe = (value) => {
        console.warn(value)
        this.setState({ show_me: value })
    }

    componentDidMount = () => {
        const that = this;
        this.props.navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity style={{ marginRight: 20 }} onPress={that._onSave}>
                    <Text style={{ color: "white", fontSize: 18, fontFamily: "DMSans-Bold" }}>Save</Text>
                </TouchableOpacity>
            )
        })
    }
    render() {
        const show_me = [
            { label: "Both", value: "both" },
            { label: "Men", value: "men" },
            { label: "Women", value: "women" },
        ];
        return (
            <>
                <ScrollView style={style.bg}>
                    <View style={style.itemContainer}>
                        <View style={{ flexDirection: "row", alignItems: "center", width: "100%", marginLeft: 10 }}>
                            <FontAwesomeIcon name="envelope" color="#DA1DA2" size={24} />
                            <Text style={style.itemLabel}>Email Address</Text>
                        </View>
                        <TextInput
                            dark
                            placeholder="Email Address"
                            style={{ width: "100%", backgroundColor: "#70707070" }}
                            value={this.state.email}
                            onChangeText={this._onChangeEmailAddress}
                        />
                    </View>
                    <View style={{ marginTop: 10, alignItems: "center"}}>
                        <View style={{ flexDirection: "row", alignItems: "center", width: "100%", marginLeft: 10 }}>
                            <FontAwesomeIcon name="phone" color="#DA1DA2" size={24} />
                            <Text style={style.itemLabel}>Phone Number</Text>
                        </View>
                        <View style={{ width: wp("90%"),alignItems: "center"}}>
                            <IntlPhoneInput
                                onChangeText={this._onChangePhoneNumber}
                                defaultCountry={this.state.countryCode == "" ? "US" : this.state.countryCode}
                                containerStyle={{ backgroundColor: "#70707070", height: 45, justifyContent: "center", alignItems: "center", marginTop: 10 }}
                                phoneInputStyle={{ color: 'white', fontSize: 16, marginLeft: 10, justifyContent: "center", alignItems: "center", paddingVertical: 5 }}
                                placeholder="Phone Number"
                                dialCodeTextStyle={{ fontSize: 18, color: "white" }}
                                flagStyle={{ fontSize: 28 }}
                            />
                            {this.state.phoneNumber != "" && <Text style={style.itemLabel}>(Current : {this.state.countryDialCode} {this.props.user.phoneNumber})</Text>}
                        </View>

                    </View>
                    <View style={style.itemContainer}>
                        <View style={{ flexDirection: "row", alignItems: "center", width: "100%", marginLeft: 10 }}>
                            <MCIcon name="map-marker-distance" color="#DA1DA2" size={24} />
                            <Text style={style.itemLabel}>Maximum Distance</Text>
                            <View style={{ position: "absolute", right: 5, flexDirection: "row" }}>
                                <Text style={{ color: "#DA1DA2", fontSize: 18, fontFamily: "DMSans-Bold" }}> {parseInt(this.state.distance) == 201 ? "Unlimited" : parseInt(this.state.distance) + " miles"} </Text>
                            </View>
                        </View>
                        <Slider
                            value={this.state.distance}
                            onValueChange={this._onChangeDistance}
                            minValue={1}
                            maxValue={200}
                            trackWidth="100%"
                            step={1}
                            trackStyle={{ backgroundColor: "#70707070" }}
                        />
                    </View>

                    <View style={style.itemContainer}>
                        <View style={{ flexDirection: "row", alignItems: "center", width: "100%", marginLeft: 10 }}>
                            <FontAwesomeIcon name="user-friends" color="#DA1DA2" size={24} />
                            <Text style={style.itemLabel}>Age Range</Text>
                            <View style={{ position: "absolute", right: 5, flexDirection: "row" }}>
                                <Text style={{ color: "#DA1DA2", fontSize: 18, fontFamily: "DMSans-Bold" }}> {this.state.minAge} - {this.state.maxAge}</Text>
                            </View>
                        </View>
                        <MultiSlider
                            values={[this.state.minAge, this.state.maxAge]}
                            sliderLength={wp("100%") - 60}
                            trackStyle={{
                                height: 7,
                                borderRadius: 7
                            }}
                            selectedStyle={{
                                backgroundColor: '#DA1DA2',
                            }}
                            unselectedStyle={{
                                backgroundColor: '#70707070',
                            }}
                            customMarker={() => {
                                return (
                                    <View style={{ width: 30, height: 30, backgroundColor: "#DA1DA2", borderRadius: 15, borderWidth: 4, borderColor: "white" }}></View>
                                )
                            }}
                            min={18}
                            max={99}
                            onValuesChange={this._onChangeAgeRange}
                        />
                    </View>
                    <View style={{ ...style.itemContainer, marginBottom: 50 }}>
                        <View style={{ flexDirection: "row", alignItems: "center", width: "100%", marginLeft: 10 }}>
                            <MCIcon name="human-male-female" color="#DA1DA2" size={24} />
                            <Text style={style.itemLabel}>Show Me</Text>
                        </View>
                        <View style={{ marginTop: 20, flex: 1 }}>
                            <RadioForm data={show_me} onChange={this._onChangeShowMe} value={this.state.show_me} />
                        </View>

                    </View>
                </ScrollView>
                {this.state.loading && <Loading />}
            </>
        );
    }
}

const style = StyleSheet.create({
    bg: {
        width: width,
        flex: 1,
        backgroundColor: "black",
        paddingVertical: 30,
        paddingHorizontal: 10,
    },
    itemContainer: {
        marginTop: 20,
        paddingHorizontal: 10,
        alignItems: "center",
    },
    itemLabel: {
        marginLeft: 10,
        fontSize: 18,
        fontFamily: "DMSans-Medium"
    },
})


const mapStateToProps = state => ({
    user: state.UserReducer
});

const mapDispatchToProps = dispatch => ({
    updateUserState: data => dispatch(updateUserState(data)),
    updateUserSetting: data => dispatch(updateUserSetting(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(GeneralContact);
