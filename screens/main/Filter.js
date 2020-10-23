import React, { Component } from 'react';
import {Alert, View, StyleSheet, Dimensions, TouchableOpacity, SafeAreaView, ScrollView, Platform } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome"
import Modal from "react-native-modal";
import { connect } from "react-redux";
import Geolocation from "@react-native-community/geolocation";
import Geocoder from "react-native-geocoder";
import { CheckBox } from "react-native-elements";
import { occupations, religiousAffiliation } from "../../constants";
import Slider from "../../components/Slider";
import RadioForm from "../../components/RadioForm";
import Text from "../../components/Text";
import { updateUserState } from "../../actions/AuthActions";
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome5";
import firestore from "@react-native-firebase/firestore";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const { width, height  } = Dimensions.get("window");

class Filter extends Component {
    constructor(props) {
        super(props);
        var religiousStatus = [];
        var occupationStatus = [];
        var filter_religiousStatus = <Text style={{fontSize: 16, margin : 10}}>Any</Text>;
        var filter_occupationStatus = <Text style={{fontSize: 16, margin : 10}}>Any</Text>;
        religiousAffiliation.map((item, index) => {
            religiousStatus.push({label:item, value :index});
        })
        occupations.map((item, index) => {
            occupationStatus.push({label:item, value : index});
        })
        this.state = {
            filter_religious : props.user.filter_religious[0] != undefined ? props.user.filter_religious : [],
            filter_religiousStatus : filter_religiousStatus,
            filter_occupation : props.user.filter_occupation[0] != undefined ? props.user.filter_occupation : [],            
            filter_occupationStatus : filter_occupationStatus,
            distance : props.user.distance,
            showReligiousModal : false,
            showOccupationModal : false,
            religiousStatus : religiousStatus,
            occupationStatus : occupationStatus,
            city : props.user.city,
            country : props.user.country,
            position : props.user.position,
            maxAge: props.user.maxAge,
            minAge: props.user.minAge, 
        };
        console.warn(this.props.user.distance); 
    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerRight: navigation.state.params && navigation.state.params.headerRight
        }
    }

    componentDidMount = () => {

        if ( this.state.filter_religious.length != 0) {
            this.setState ({
                filter_religiousStatus : this.state.filter_religious.map(item => (
                    <Text style={{fontSize: 16, margin : 10}}>
                            {religiousAffiliation[item]}
                    </Text>
                ))
            })
        };
      
        if ( this.state.filter_occupation.length != 0) {
            this.setState ({
                filter_occupationStatus : this.state.filter_occupation.map(item => (
                <Text style={{fontSize: 16, margin : 10}}>
                            {occupations[item]}
                </Text>
            ))
        })
        };

        const that = this;
        this.props.navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity style={{ marginRight: 20 }} onPress={that._onDone}>
                    <Text style={{ color: "red", fontSize: 18, fontFamily: "DMSans-Bold" }}>Done</Text>
                </TouchableOpacity>
            )
        })
    }
    _onDone = async () => {
        const {showReligiousModal, showOccupationModal, religiousStatus, occupationStatus, filter_religiousStatus, filter_occupationStatus, ...data} = this.state;
        console.warn(data);
        await firestore().collection("users").doc(this.props.user.uid).update(data).then(() => {
            updateUserState(data);
        });

        this.props.navigation.goBack();
        
    }

    _onPressReligiousAffiliation = () => {
        this.setState({showReligiousModal : true});       
    }
    _onChangeDistance = (a) => {        
        this.setState({ distance : a });
    }
    // _onChangeReligiousAffiliation = (value) => {
    //     this.setState({filter_religious : value});
    // }
    _onPressOccupation = () => {
        this.setState({showOccupationModal : true});
    }   
    // _onChangeOccupation = (value) => {
    //     this.setState({filter_occupation : value});
    // }

    _onCloseModal = () =>{
        this.setState({showReligiousModal: false, showOccupationModal : false});

        if ( this.state.filter_occupation.length != 0) {
            this.setState ({
                filter_occupationStatus : this.state.filter_occupation.map(item => (
                <Text style={{fontSize: 16, margin : 10}}>
                            {occupations[item]}
                </Text>
            ))
        })
        } else{
            this.setState ({
                filter_occupationStatus : <Text style={{fontSize: 16, margin : 10}}>Any</Text>
            }) 
        };

        if ( this.state.filter_religious.length != 0) {
            this.setState ({
                filter_religiousStatus : this.state.filter_religious.map(item => (
                    <Text style={{fontSize: 16, margin : 10}}>
                            {religiousAffiliation[item]}
                    </Text>
                ))
            })
        } else {
            this.setState ({
                filter_religiousStatus : <Text style={{fontSize: 16, margin : 10}}>Any</Text>
            })
            
        }

    };

    _onChangeAgeRange = (value) => {
        console.warn(this.state.distance);
        this.setState({ minAge: value[0], maxAge: value[1] });
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
                        if (Platform.OS === 'ios') Geolocation.requestAuthorization();
                        Geolocation.getCurrentPosition(
                            info => {
                                const position = { lat: info.coords.latitude, lng: info.coords.longitude }
                                Geocoder.geocodePosition(position).then(res => {
                                    console.warn(res);
                                    const { updateUserState } = this.props;
                                    updateUserState({ position : position, country : res[0].countryCode, city : res[0].adminArea });
                                    this.setState({ position : position, country : res[0].countryCode, city : res[0].adminArea });
                                })
                                    .catch(err => {
                                        console.warn(err)
                                        alert(JSON.stringify(err));
                                    })
                            },
                            error => { 
                                // alert("Sorry, we cann't get your location now, please check your permission!")
                                alert(JSON.stringify(error));
                                console.log(error) 
                            },
                            {
                                enableHighAccuracy: false,
                                timeout: 3000,
                                // maximumAge: 1000,
                            },

                        )
                    }
                }
            ],
            { cancelable: false }
        )


    }

    render() {
        return (
            <ScrollView style={style.bg}>
                <View style={style.itemContainer}>
                    <Text style={style.itemLabel}>Location</Text>
                    <TouchableOpacity style={style.item} onPress={this._getCurrentLocation}>
                        <Text style={{fontSize: 16, margin : 10}}>{(this.state.city == "" && this.state.country == "") ? "Get my current location" : `${this.state.city}, ${this.state.country}`}</Text>
                        <Icon name="location-arrow" color="white" size={24}/>
                    </TouchableOpacity>
                </View>
                <View style={style.itemContainer}>
                    <Text style={style.itemLabel}>Maximum Distance</Text>
                    <View style={{ position: "absolute", right: 5, flexDirection: "row" }}>
                                <Text style={{ color: "#DA1DA2", fontSize: 18, fontFamily: "DMSans-Bold" }}> {parseInt(this.state.distance) == 201 ? "Unlimited" : parseInt(this.state.distance) + " miles"} </Text>
                    </View>
                    <Slider
                            value={this.state.distance}
                            onValueChange={this._onChangeDistance}
                            minValue={1}
                            maxValue={200}
                            trackWidth="100%"
                            step={1}
                            trackStyle={{ backgroundColor: "#70707070" }}
                            data={this.state.distance}
                        />
                </View>

                <View style={style.itemContainer}>
                    <Text style={style.itemLabel}>Religious Affiliation</Text>
                    <TouchableOpacity style={style.item} onPress={this._onPressReligiousAffiliation}>
                        
                        <View>
                            {/* {this.state.filter_religious.map(item => (
                                <Text style={{fontSize: 16, margin : 10}}>
                                        {religiousAffiliation[item]}
                                </Text>
                            ))} */}
                            { this.state.filter_religiousStatus }
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={style.itemContainer}>
                    <Text style={style.itemLabel}>Occupation</Text>
                    <TouchableOpacity style={style.item} onPress={this._onPressOccupation}>
                        <View>
                            {/* {this.state.filter_occupation.map(item => (
                                <Text style={{fontSize: 16, margin : 10}}>
                                            {occupations[item]}
                                </Text>
                            ))} */}
                            { this.state.filter_occupationStatus }
                        </View>
                    </TouchableOpacity>
                   
                </View>
                <View style={style.itemContainer}>
                        <View style={{ flexDirection: "row", alignItems: "center", width: "100%" }}>
                            <Text style={style.itemLabel}>Age Range</Text>
                            <View style={{ position: "absolute", right: 5, flexDirection: "row" }}>
                                <Text style={{ color: "#DA1DA2", fontSize: 18, fontFamily: "DMSans-Bold" }}> {this.state.minAge} - {this.state.maxAge}</Text>
                            </View>
                        </View>
                        <MultiSlider
                            values={[this.state.minAge, this.state.maxAge]}
                            sliderLength={wp("100%") - 80}
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

                <Modal
                    isVisible={this.state.showReligiousModal}
					backdropColor="#B4B3DB"
					backdropOpacity={0.8}
					animationIn="zoomInDown"
					animationOut="zoomOutUp"
					animationInTiming={600}
					animationOutTiming={600}
					backdropTransitionInTiming={600}
					backdropTransitionOutTiming={600}
                >
                    <View style={style.modalContent}>
                        {/* <ScrollView showsVerticalScrollIndicator={false}>
                            <Text style={{fontSize: 24, fontFamily:"DMSans-Medium", marginTop : 20, textAlign: "center"}}>Religious Affiliation</Text>
                            <View style={{marginTop : 20, flex : 1, marginBottom : 60}}> 
                                <RadioForm data={this.state.religiousStatus} onChange = {this._onChangeReligiousAffiliation} value={this.state.religious}/>
                            </View>
                        </ScrollView> */}
                        <ScrollView style={style.bg}>
                                <Text style={{color : "#DA1DA2", fontSize: 28, fontFamily: "DMSans-Medium", marginTop : 10}}>Religious Affiliation</Text>
                                <View style={{justifyContent: 'center', alignItems: 'center', marginTop : 20}}>
                                    {this.state.religiousStatus.map(item => (
                                        <CheckBox 
                                            title = {item.label}
                                            checked={this.state.filter_religious.indexOf(item.value) !== -1}
                                            containerStyle={style.itemContainer, {backgroundColor : "#1F1F21", borderColor:"transparent",}}
                                            textStyle={style.labelStyle}
                                            onPress = {() => {
                                                const values = this.state.filter_religious;
                                                var selected = values.indexOf(item.value);
                                                
                                                if(selected === -1) {
                                                    values.push(item.value);
                                                    this.setState({filter_religious: values })
                                                }
                                                else {
                                                    values.splice(selected, 1);
                                                    this.setState({filter_religious: values}) 
                                                }
                                            }}
                                            checkedColor = "#DA1DA2"
                                            iconRight
                                        />
                                    ))}
                                </View>
                        </ScrollView>
                        <View style={{ width: width, position :"absolute", bottom : 0, paddingBottom : 20, justifyContent: "center", alignItems: "center" }}>
                            <TouchableOpacity onPress={this._onCloseModal} style={{width : 250, paddingVertical : 15, backgroundColor : "#AF1782", borderRadius : 30, justifyContent: "center", alignItems: "center"}}>
                                <Text style={{fontSize: 18, fontFamily:"DMSans-Medium"}}>Select</Text>
                            </TouchableOpacity>
                        </View>
                    </View>                    
                </Modal>
                <Modal
                    isVisible={this.state.showOccupationModal}
					backdropColor="#B4B3DB"
					backdropOpacity={0.8}
					animationIn="zoomInDown"
					animationOut="zoomOutUp"
					animationInTiming={600}
					animationOutTiming={600}
					backdropTransitionInTiming={600}
					backdropTransitionOutTiming={600}
                >
                    <View style={style.modalContent}>
                        {/* <ScrollView showsVerticalScrollIndicator={false}>
                            <Text style={{fontSize: 24, fontFamily:"DMSans-Medium", marginTop : 20, textAlign: "center"}}>Religious Affiliation</Text>
                            <View style={{marginTop : 20, flex : 1, marginBottom : 60}}> 
                                <RadioForm data={this.state.occupationStatus} onChange = {this._onChangeOccupation} value={this.state.religious}/>
                            </View>
                        </ScrollView> */}
                        <ScrollView style={style.bg}>
                            <Text style={{color : "#DA1DA2", fontSize: 28, fontFamily: "DMSans-Medium", marginTop : 10}}>Occupation</Text>
                            <View style={{justifyContent: 'center', alignItems: 'center', marginTop : 20}}>
                                {this.state.occupationStatus.map(item => (
                                    <CheckBox 
                                        title = {item.label}
                                        checked={this.state.filter_occupation.indexOf(item.value) !== -1}
                                        containerStyle={style.itemContainer, {backgroundColor : "#1F1F21", borderColor:"transparent",}}
                                        textStyle={style.labelStyle}
                                        onPress = {() => {
                                            const values = this.state.filter_occupation;
                                            var selected = values.indexOf(item.value);
                                            
                                            if(selected === -1) {
                                                values.push(item.value);
                                                this.setState({filter_occupation: values })
                                            }
                                            else {
                                                values.splice(selected, 1);
                                                this.setState({filter_occupation: values}) 
                                            }
                                        }}
                                        checkedColor = "#DA1DA2"
                                        iconRight
                                    />
                                ))}
                            </View>
                        </ScrollView>
                        <View style={{ width: width, position :"absolute", bottom : 0, paddingBottom : 20, justifyContent: "center", alignItems: "center" }}>
                            <TouchableOpacity onPress={this._onCloseModal} style={{width : 250, paddingVertical : 15, backgroundColor : "#AF1782", borderRadius : 30, justifyContent: "center", alignItems: "center"}}>
                                <Text style={{fontSize: 18, fontFamily:"DMSans-Medium"}}>Select</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        );
    }
}


const style = StyleSheet.create({
    bg: {
        width: width,
        backgroundColor: "#262628",
        flex : 1,
        paddingVertical : 20,
        paddingHorizontal : 20
    },
    itemContainer : {
        marginBottom : 20,
        margin: 10,
        zIndex :0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    labelStyle :{
        width : "85%", 
        fontSize : 18, 
        fontFamily :"DMSans-Medium", 
        color : "white"
    },
    tagContainer:{
        paddingHorizontal: 6,
        paddingVertical: 3,
        backgroundColor: "#DA1DA2",
        borderRadius: 10,
        marginHorizontal: 5,
    },
    tag: {
        color: "white",
        fontSize: 16
    },  
    itemLabel :{
        fontSize : 18,
        marginLeft : 5,
        marginBottom : 5, 
        width : "100%"
    },
    item : {
        // height: 50, 
        backgroundColor : "#1F1F21",
        width : '100%',
        borderRadius : 10,
        marginTop : 5,
        paddingHorizontal : 10,
        flexDirection: "row",
        alignItems :"center", 
        justifyContent : "space-between",
        zIndex : 0,
    },
    modalContent : {
        height : height, 
		width : width, 
		position: "absolute", 
		justifyContent:"center", 
        alignItems:"center", 
        backgroundColor : "black",
        marginLeft : -19,
        paddingHorizontal : 10
    }

})

const mapStateToProps = state => {
    return {
        user : state.UserReducer
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateUserState : data => dispatch(updateUserState(data)) 
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Filter);
