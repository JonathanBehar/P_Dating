import React, { Component } from 'react'
import Carousel, { Pagination } from 'react-native-snap-carousel';
import FastImage from "react-native-fast-image";
import { View, StyleSheet, Dimensions, Image, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'
import FontAwesome from "react-native-vector-icons/FontAwesome"
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import LinearGradient from "react-native-linear-gradient";
import moment from "moment";
import { occupations, religiousAffiliation, interests,ethnicity,lookingfor, relationStatus } from "../../constants";
import Text from "../../components/Text";

const { width, height } = Dimensions.get("window");

export class UserDetails extends Component {

    constructor(props) {
        super(props);
        var photos = [];
        this.props.route.params.user.photos.map(item => {
            if (item != "") photos.push(item);
        })
        const firstname = this.props.route.params.user.fullname.split(' ')[0];
        const age = moment().diff(this.props.route.params.user.birthdate.toDate(), "year");
        this.state = {
            user : this.props.route.params.user,
            photos: photos,
            activeSlide: 0,
            age : age,
            firstname : firstname
        }

        this._carousel = React.createRef();
    }

    _renderSlider = ({ item }) => {
        return (
            
			        // <View>
                    //     <LinearGradient colors={["#cc00ff", "#f0b3ff"]} style={style.profileGradient}>
                    //         <FastImage
                    //             source={{ uri: item }}
                    //             style={{ width: wp("65%"), height: 340, marginHorizontal: wp("17.5"), borderRadius: 50 }}
                    //         />
                    //         <TouchableOpacity style={{ height: height - 450, position: "absolute", width: 100, backgroundColor: "transparent" }} onPress={() => this._carousel.snapToPrev()}></TouchableOpacity>
                    //         <TouchableOpacity style={{ height: height - 450, position: "absolute", width: 100, backgroundColor: "transparent", right: 80 }} onPress={() => this._carousel.snapToNext()}></TouchableOpacity>
                    //     </LinearGradient>
                    // </View>
                    
                    <View>
                            <FastImage
                                source={{ uri: item }}
                                style={{ width: width, height: 300 }}
                            />
                            <TouchableOpacity style={{ height: height - 450, position: "absolute", width: 100, backgroundColor: "transparent" }} onPress={() => this._carousel.snapToPrev()}></TouchableOpacity>
                            <TouchableOpacity style={{ height: height - 450, position: "absolute", width: 100, backgroundColor: "transparent", right: 80 }} onPress={() => this._carousel.snapToNext()}></TouchableOpacity>
                    </View>
			
            
        )
    }
    get pagination() {
        const { photos, activeSlide } = this.state;
        return (
            <Pagination
                dotsLength={photos.length}
                activeDotIndex={activeSlide}
                containerStyle={{ position: "absolute", backgroundColor: 'transparent', paddingHorizontal: 70, paddingVertical: 5, marginTop: 10 }}
                dotStyle={{
                    width: 16,
                    height: 16,
                    borderRadius: 8,
                    marginHorizontal: 8,
                    backgroundColor: 'white',
                    borderWidth: 4,
                    borderColor: "white"
                }}
                inactiveDotStyle={{ backgroundColor: "transparent" }}
                inactiveDotOpacity={0.4}
                inactiveDotScale={0.6}
                vertical={true}
            />
        );
    }
    render() {
        return (
            <ScrollView style={style.bg}>
                <Carousel
                    ref={(c) => { this._carousel = c; }}
                    data={this.state.photos}
                    renderItem={this._renderSlider}
                    sliderWidth={width}
                    itemWidth={width}
                    onSnapToItem={(index) => this.setState({ activeSlide: index })}
                    enableSnap={false}
                />
                {this.pagination}

                <View style={{marginTop : -70}}>
                    <View style={{ marginHorizontal: 10, alignItems: "center", flexDirection: "row", justifyContent: "space-between" }}>
                        <Text style={{ fontFamily: "DMSans-Bold", fontSize: 30 }}>{this.state.firstname}, {this.state.age}</Text>
                    </View>                    
                    <View style={{ marginTop : 50, marginBottom: 20,  flexDirection: "row", alignItems: "center",}}>
                        <FontAwesome style={style.awesome} name={"map-marker"} size={30} color={'white'} />
                        <Text style={style.location}>{(this.state.user.city !="" && this.state.user.country !="")?`${this.state.user.city}, ${this.state.user.country}` :"Unknown Location"}</Text>
                    </View>
                    <View style={{ flexDirection: "row", marginBottom: 20, alignItems: "center" }}>
                        <FontAwesome style={style.awesome} name={"tags"} size={25} color={'white'} />
                        <View style={style.tagContainer}><Text style={style.tag}>{occupations[this.state.user.occupation]}</Text></View>
                        <View style={style.tagContainer}><Text style={style.tag}>{religiousAffiliation[this.state.user.religious]}</Text></View>
                    </View>
                </View>

                <View >
                    <View style={{ flexDirection: "row", marginBottom : 20, width : "80%" }}>
                        <FontAwesome style={style.awesome} name={"comment"} size={25} color={'white'} />
                        <Text style={style.location}>{this.state.user.bio}</Text>
                    </View>
                    <View style={{ flexDirection: "row"}}>
                        <FontAwesome style={style.awesome} name={"user-o"} size={25} color={'white'} />
                        <View style={style.location}>
                            <View style={{flexDirection: "row"}}>
                                <Text style={style.label}>Height:</Text>
                                <Text style={style.value}>{this.state.user.height} ft</Text>
                            </View>
                            {/* <View style={{flexDirection: "row", marginTop : 5}}>
                                <Text style={style.label}>Weight:</Text>
                                <Text style={style.value}>{this.state.user.weight} lbs</Text>
                            </View> */}
                            <View style={{flexDirection: "row", marginTop : 5}}>
                                <Text style={style.label}>Relationship Status:</Text>
                                <Text style={style.value}>{relationStatus[this.state.user.relationship]}</Text>
                            </View>
                        </View>
                        
                        {/* <View style={{flexDirection: "row", marginTop : 5}}>
                            <Text style={style.label} >Ethnicity:</Text>
                            <Text style={style.value} >{ethnicity[this.state.user.ethnicity]}</Text>
                        </View>                         */}
                    </View>
                    {/* <View>
                        <Text style={style.title}>Interests</Text>
                        <View style={{flexDirection: "row", flexWrap :"wrap"}}>
                            {this.state.user.interest.map(item => {
                                return (<Text style={style.blankTag}>
                                    {interests[item]}
                                </Text>)
                            })}
                        </View>
                    </View>
                    <View>
                        <Text style={style.title}>Looking For</Text>
                        <View style={{flexDirection: "row", flexWrap:"wrap"}}>
                        {this.state.user.lookingfor.map(item => {
                            return (<Text style={style.blankTag}>
                                {lookingfor[item]}
                            </Text>)
                        })}
                        </View>
                    </View> */}

                    <TouchableOpacity style={{marginTop : 40, marginBottom : 40, justifyContent:"center", alignItems: "center"}}>
                        <Text style={{fontSize : 22,textTransform :"uppercase"}}>Report {this.state.firstname}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        )
    }
}

const style = StyleSheet.create({
    bg: {
        width: width,
        backgroundColor: "black",
        flex: 1,
    },
    awesome: {
        marginLeft: 30, 
        marginRight: 20
    },
    profileGradient: {
        flex: 1,
    }, 
    border: {
        borderBottomColor: "grey",
        borderBottomWidth: 0.5, 
        // paddingHorizontal : 30
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
        fontSize: 18
    },
    blankTag: {
        paddingHorizontal: 10,
        paddingVertical: 3,
        backgroundColor: "transparent",
        color: "white",
        borderRadius: 10,
        marginHorizontal: 5,
        fontSize: 16, 
        borderWidth : 2,
        borderColor :"white",
    },
    location: {
        fontSize: 20,
        fontFamily: "DMSans-Regular",
        color: "white",
        marginLeft: 10,
        marginTop: 5
    },
    title : {
        fontSize: 24, 
        fontFamily: "DMSans-Bold",
        marginVertical : 10
    },
    bio : {
        fontSize: 16,
        fontFamily: "DMSans-Regular",

    },
    label : {
        fontSize : 20,
        fontFamily: "DMSans-Regular",

    },
    value : {
        fontSize : 20,
        fontFamily: "DMSans-Regular", 
        marginLeft: 10, 
        // color : "#707070"
    }
})


export default UserDetails
