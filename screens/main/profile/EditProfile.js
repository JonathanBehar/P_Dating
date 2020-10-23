import React, { Component } from 'react';
import { ScrollView ,View, StyleSheet, Dimensions, Image, TouchableOpacity, Alert } from 'react-native';
import { connect } from "react-redux";
import Text from "../../../components/Text";
import ImagePicker from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import firestore from "@react-native-firebase/firestore";
import moment from "moment";
import { occupations, ethnicity, interests,lookingfor, religiousAffiliation, relationStatus } from "../../../constants"
import Loading from "../../Loading";
import { updateUserState } from "../../../actions/AuthActions";
import FastImage from "react-native-fast-image";
import Geolocation from "@react-native-community/geolocation";
import Geocoder from "react-native-geocoder";

const { width, height } = Dimensions.get("window");
const imageBigDimention = (width-20) * 2 / 3;
const imageSmallDimention = (width-20)/3 - 5 ;

class EditProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading : false
        };
        console.warn(this.props.user)
    }

    _goToBasic = () =>{
        this.props.navigation.navigate("BasicProfile");
    }
    _goToOccupation = () => {
        this.props.navigation.navigate("OccupationEdit");
    }
    _goToReligious = () => {
        this.props.navigation.navigate("ReligiousEdit");
    }
    _goToEthncity = () => {
        this.props.navigation.navigate("EthnicityEdit");
    }
    _goToRelationshipEdit = () => {
        this.props.navigation.navigate("RelationshipEdit");
    }
    _goToLookingFor = () => {
        this.props.navigation.navigate("LookingForEdit");
    }
    _goToInterest = () => {
        this.props.navigation.navigate("InterestsEdit");
    }

    updatePhoto(index){
        const options = {
			title: 'Select Photo',
			noData: true,
			mediaType: "photo",
			allowsEditing: true,
			quality: 0.7
		};
		/**
		 * The first arg is the options object for customization (it can also be null or omitted for default options),
		 * The second arg is the callback which sends object: response (more info in the API Reference)
		 */
        ImagePicker.showImagePicker(options, (response) => {
			if (response.didCancel) {
				console.log('User cancelled image picker');
			} else if (response.error) {
				console.log('ImagePicker Error: ', response.error);
			} else {
                // this.setState({imageUri : response.uri});
                this.setState({loading : true});
                const uri = response.uri;
                const ext = uri.split(".").pop();
                var reference = `users/${this.props.user.uid}/photo-${index}.${ext}`;
                var ref = storage().ref(reference);
                var task = ref.putFile(uri);
                task.on('state_changed', taskSnapshot => {
                    // console.warn(`${taskSnapshot.bytesTransferred} transferred out of ${task.totalBytes}`);
                });
                task.then(async (res) => {
                    const downloadURL = await ref.getDownloadURL();
                    const { updateUserState } = this.props;
                    var photos = this.props.user.photos;
                    photos[index] = downloadURL;
                    await firestore().collection("users").doc(this.props.user.uid).update({photos : photos})
                    updateUserState({photos: photos});
                    this.setState({loading: false });
                });
			}
		});
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
                                    // this.setState({ position : position, country : res[0].countryCode, city : res[0].adminArea });
                                })
                                    .catch(err => {
                                        console.warn(err)
                                        alert(JSON.stringify(err));
                                    })
                            },
                            error => { 
                                alert("Sorry, we cann't get your location now, please check your permission!")
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
            <>
            <ScrollView style={style.bg}>
                <View style={{ paddingHorizontal: 10, paddingVertical: 10, backgroundColor:"black" }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <View>
                            <TouchableOpacity onPress={() => this.updatePhoto(0)}>
                                {this.props.user.photos[0] == ""?<View style={{...style.emptyImage, width:imageBigDimention, height:imageBigDimention}}>
                                    <Image source={require('../../../assets/images/upload-icon.png')} />
                                </View>:
                                <FastImage source={{ uri: this.props.user.photos[0] }} style={{ width:imageBigDimention, height:imageBigDimention, borderRadius:10 }} />
                                }
                                <View style={style.imageNumber}>
                                    <Text style={style.imageNumberText}>1</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{ marginLeft: 7 }}>
                            <TouchableOpacity onPress={() => this.updatePhoto(1)}>
                                {this.props.user.photos[1] == ""?<View style={style.emptyImage}>
                                    <Image source={require('../../../assets/images/upload-icon.png')} />
                                </View>:
                                <FastImage source={{ uri: this.props.user.photos[1] }} style={{ width: imageSmallDimention, height: imageSmallDimention, borderRadius:10 }} />
                                }   
                                <View style={style.imageNumber}>
                                    <Text style={style.imageNumberText}>2</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ marginTop: 10 }} onPress={() => this.updatePhoto(2)}>
                                {this.props.user.photos[2] == ""?<View style={style.emptyImage}>
                                    <Image source={require('../../../assets/images/upload-icon.png')} />
                                </View>:
                                <FastImage source={{ uri: this.props.user.photos[2] }} style={{ width: imageSmallDimention, height: imageSmallDimention, borderRadius:10 }} />
                                }
                                <View style={style.imageNumber}>
                                    <Text style={style.imageNumberText}>3</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                        <TouchableOpacity onPress={() => this.updatePhoto(3)}>
                            {this.props.user.photos[3] == ""?<View style={style.emptyImage}>
                                <Image source={require('../../../assets/images/upload-icon.png')} />
                            </View>:
                            <FastImage source={{ uri: this.props.user.photos[3] }} style={{ width: imageSmallDimention, height: imageSmallDimention, borderRadius:10 }} />
                            }
                            <View style={style.imageNumber}>
                                <Text style={style.imageNumberText}>4</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.updatePhoto(4)}>
                            {this.props.user.photos[4] == ""?<View style={style.emptyImage}>
                                <Image source={require('../../../assets/images/upload-icon.png')} />
                            </View>:
                            <FastImage source={{ uri: this.props.user.photos[4] }} style={{ width: imageSmallDimention, height: imageSmallDimention, borderRadius:10 }} />
                            }
                            <View style={style.imageNumber}>
                                <Text style={style.imageNumberText}>5</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.updatePhoto(5)}>
                            {this.props.user.photos[5] == ""?<View style={style.emptyImage}>
                                <Image source={require('../../../assets/images/upload-icon.png')} />
                            </View>:
                            <FastImage source={{ uri: this.props.user.photos[5] }} style={{ width: imageSmallDimention, height: imageSmallDimention, borderRadius:10 }} />
                            }
                            <View style={style.imageNumber}>
                                <Text style={style.imageNumberText}>6</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ backgroundColor:"#262628", width:width}}>
                    <TouchableOpacity style={style.itemContainer} onPress={this._goToBasic}>
                        <Text style={style.itemLabel}>Full name</Text>
                        <Text style={style.itemValue}>{this.props.user.fullname}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={style.itemContainer} onPress={this._goToOccupation}>
                        <Text style={style.itemLabel}>Occupation</Text>
                        <Text style={style.itemValue}>{occupations[this.props.user.occupation]}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={style.itemContainer} onPress={this._goToBasic}>
                        <Text style={style.itemLabel}>Birthday</Text>
                        <Text style={style.itemValue}>{
                            moment(
                                typeof this.props.user.birthdate.toDate == "undefined"?
                                this.props.user.birthdate:
                                this.props.user.birthdate.toDate())
                            .format("MMM DD, YYYY")
                        }
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={style.itemContainer} onPress={this._goToReligious}>
                        <Text style={style.itemLabel}>Religious Preference</Text>
                        <Text style={style.itemValue}>{religiousAffiliation[this.props.user.religious]}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this._goToBasic} style={{paddingVertical :10, paddingHorizontal : 20, borderBottomWidth : 1, borderBottomColor : "black"}}>
                        <Text style={{...style.itemLabel, fontSize :24}}>About You</Text>
                        <Text style={{...style.itemValue, marginTop : 10}}>{this.props.user.bio}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={style.itemContainer} onPress={this._goToBasic}>
                        <Text style={style.itemLabel}>Height</Text>
                        <Text style={style.itemValue}>{parseFloat(this.props.user.height).toFixed(1)} ft</Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity style={style.itemContainer} onPress={this._goToBasic}>
                        <Text style={style.itemLabel}>weight</Text>
                        <Text style={style.itemValue}>{this.props.user.weight} lbs</Text>
                    </TouchableOpacity> */}
                    {/* <TouchableOpacity style={style.itemContainer} onPress={this._goToEthncity}>
                        <Text style={style.itemLabel}>Ethnicity</Text>
                        <Text style={style.itemValue}>{ethnicity[this.props.user.ethnicity]}</Text>
                    </TouchableOpacity> */}  
                    <TouchableOpacity style={style.itemContainer} onPress={this._goToRelationshipEdit}>
                        <Text style={style.itemLabel}>Relationship Status</Text>
                        <Text style={style.itemValue}>{relationStatus[this.props.user.relationship]}</Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity style={style.itemContainer} onPress={this._goToLookingFor}>
                        <Text style={style.itemLabel}>Looking For</Text>
                        <View style={{flexDirection:"row"}}>{this.props.user.lookingfor.map((item, index) => {
                            return(
                            <Text style={style.itemValue}>{lookingfor[item]}{index != this.props.user.lookingfor.length - 1 ?", ":""}</Text>
                            )
                        })}
                        </View>
                    </TouchableOpacity> */}
                    {/* <View style={{paddingVertical :10, paddingHorizontal : 20}}>
                        <Text style={{...style.itemLabel, fontSize :24}}>Interests</Text>
                        <View style={{flexDirection:"row", flexWrap : "wrap"}}>
                            {this.props.user.interest.map((item, index) => {
                                return (<View style={style.interest}>
                                    <Text style={{fontSize : 16}}>{interests[item]}</Text>
                                </View>)
                            })}
                        </View>
                    </View> */}
                    {/* <TouchableOpacity style={{width : "100%", justifyContent:"center", alignItems : "center"}} onPress={this._goToInterest} >
                        <LinearGradient colors={["#DA1DA2", "#6D0F51"]} style={style.moreInterests}>
                            <Text style={{fontSize : 20, fontFamily:"DMSans-Medium", textTransform:"uppercase"}}>Add More Interests</Text>
                        </LinearGradient>
                    </TouchableOpacity> */}
                    <TouchableOpacity onPress={this._getCurrentLocation} style={{paddingVertical :10, paddingHorizontal : 20}}>
                        <Text style={{...style.itemLabel, fontSize :24}}>Location</Text>
                        <View style={{marginTop : 15, flexDirection:"row", justifyContent:"space-between"}}>
                            <Text style={style.itemLabel}>Current Location</Text>
                            <Text style={style.itemValue}>{this.props.user.city}, {this.props.user.country}</Text>
                        </View>
                    </TouchableOpacity>
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
        backgroundColor: "#262628",
        flex : 1
    },
    itemContainer :{
        paddingHorizontal : 15,
        paddingVertical : 15, 
        borderBottomWidth: 1,
        borderBottomColor : "black",
        justifyContent : "space-between", 
        flexDirection: "row"
    },
    itemLabel : {
        fontSize : 16, 
        fontFamily: "DMSans-Medium", 
        color : "white"
    },
    itemValue : {
        fontSize : 14, 
        fontFamily: "DMSans-Medium", 
        color : "#9B9B9B"
    },
    interest :{
        paddingVertical : 5,
        paddingHorizontal : 15,
        borderColor : "white", 
        borderWidth : 1,
        borderRadius : 5,
        marginHorizontal :5,
        marginTop : 10
    },
    moreInterests : {
        width : 350,
        marginVertical : 15,
        paddingVertical : 15,
        borderRadius : 10,
        justifyContent: 'center',
        alignItems:"center", 
        flexDirection : "row"
    },
    imageNumber :{
        width : 30,
        height : 30, 
        backgroundColor : "white",
        borderRadius : 15,
        position: "absolute",
        bottom : 5,
        right : 5,
        justifyContent: 'center',
        alignItems:"center"
    },
    imageNumberText : {
        color:"#4A4A4A", 
        fontSize:18, 
        fontFamily :"DMSans-Medium"
    },
    emptyImage : {
        width : imageSmallDimention ,
        height : imageSmallDimention , 
        backgroundColor : "#1F1F21",
        borderRadius : 10,
        justifyContent: 'center',
        alignItems:"center"
    }
})

const mapStateToProps = state => ({
    user: state.UserReducer
})

const mapDispatchToProps = dispatch => ({
    updateUserState : data => dispatch(updateUserState(data))
})



export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);
