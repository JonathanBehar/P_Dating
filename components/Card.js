import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native';
import FastImage from "react-native-fast-image";
import Text from "./Text";
import moment from "moment";
import { occupations, religiousAffiliation } from "../constants";
import Carousel, { Pagination } from 'react-native-snap-carousel';
import * as RootNavigation from "../navigations/navHelper.js";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {isIphoneX } from 'react-native-iphone-x-helper';
const { width, height } = Dimensions.get("window");

class Card extends Component {
    constructor(props) {
        super(props);
        const item = props.item;
        const firstname = item.fullname.split(' ')[0];
        const age = moment().diff(item.birthdate.toDate(), "year");
        var photos = [];
        item.photos.map(item => { if (item != "") photos.push(item); })
        this.state = {
            item: item,
            firstname: firstname,
            age: age,
            photos: photos,
            activeSlide: 0
        };
        this._carousel = React.createRef();
    }
    _renderSlider = ({ item }) => {
        return (
            <View>
                <FastImage
                    source={{ uri: item }}
                    style={style.image}
                />
                <TouchableOpacity style={{height: hp("100%")-440, position:"absolute", width : 100, backgroundColor :"transparent"}} onPress={() => this._carousel.snapToPrev()}></TouchableOpacity>
                <TouchableOpacity style={{height: hp("100%")-440, position:"absolute", width : 100, backgroundColor :"transparent", right:20}} onPress={() => this._carousel.snapToNext()}></TouchableOpacity>
            </View>
        )
    }

    onPressInfo = () => {
        RootNavigation.navigate("UserDetails", { user :  this.props.item });
    }

    get pagination() {
        const { photos, activeSlide } = this.state;
        return (
            <Pagination
                dotsLength={photos.length}
                activeDotIndex={activeSlide}
                containerStyle={{ position: "absolute", backgroundColor: 'transparent', paddingHorizontal: 0, paddingVertical: 5, marginTop: 10 }}
                dotStyle={{
                    width: 16,
                    height: 16,
                    borderRadius: 8,
                    marginHorizontal: 8,
                    backgroundColor: 'white',
                    borderWidth: 4,
                    borderColor: "white"
                }}
                inactiveDotStyle={{ backgroundColor : "transparent" }}
                inactiveDotOpacity={0.4}
                inactiveDotScale={0.6}
                vertical={true}
            />
        );
    }
    render() {
        return (
            <View style={style.cardContainer}>
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
                <View style={{ marginHorizontal: 10, alignItems: "center", marginTop: -40, flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={{ fontFamily: "DMSans-Bold", fontSize: 28 }}>{this.state.firstname}, {this.state.age}</Text>
                    <TouchableOpacity onPress={() => this.onPressInfo()} style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: "white", justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ color: "black", fontFamily: "DMSans-Bold" }}>i</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: "row", marginTop: 20, flexWrap :"wrap" }}>
                    <View style={style.tagContainer}><Text style={style.tag} >{occupations[this.state.item.religious]}</Text></View>
                    <View style={style.tagContainer}><Text style={style.tag}>{religiousAffiliation[this.state.item.occupation]}</Text></View>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                    <Text style={style.location}>{(this.state.item.city !="" && this.state.item.country !="")?`${this.state.item.city}, ${this.state.item.country}` :"Unknown Location"}</Text>
                </View>
                {this.props.superLiked&&<Image source={require("../assets/images/heart.png")} style={{width : 40, height : 40, position:"absolute", bottom: 5, right : 5}}/>}
            </View>
        );
    }
}

const style = StyleSheet.create({
    cardContainer: {
        width: wp("65%"),
        height: isIphoneX()?height - 350 : height - 280,
        backgroundColor: "white",
        borderRadius: 10,
    },
    image : { 
        width: wp("65%"), 
        // height: isIphoneX()?height - 430 : height - 360,
        height : "100%", 
        borderRadius: 10 
    },
    tagContainer : {
        paddingHorizontal: 6,
        paddingVertical: 3,
        backgroundColor: "#DA1DA2",
        marginHorizontal: 5,
        borderRadius: 10,
    },
    tag: {
        color: "white",
        fontSize: 18, 
        fontFamily: "DMSans-Medium"
    },
    location: {
        fontSize: 24,
        fontFamily: "DMSans-Bold",
        color: "black",
        marginLeft: 10,
        marginTop: 5
    }
})

export default Card;
