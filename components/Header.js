import React, { Component } from 'react';
import { View, Dimensions, Image, StyleSheet} from 'react-native';
import { isIphoneX, ifIphoneX } from 'react-native-iphone-x-helper';
import Text from "./Text";

const { width, height } = Dimensions.get("window");

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <View style={style.bg}>
                <View style={style.left}>{ this.props.left }</View>
                <Image style={style.logo} source={require("../assets/images/heart.png")} />
                <Text style={style.title}> { this.props.title } </Text>
                <View style={style.right}>{ this.props.right }</View>
            </View>
        );
    }
}

const style = StyleSheet.create({
    bg : {
        width : width, 
        height : isIphoneX()?80 : 60,
        ...ifIphoneX({
            paddingTop : 40
        },{}),
        backgroundColor : "#262628",
        flexDirection :"row",
        paddingHorizontal : 10,
        alignItems : "center", 
        justifyContent :"center"
    },
    left : {
        position: "absolute",
        left : 30,
        ...ifIphoneX({
            top : 50
        },{}),
    },    
	logo: {
		width: 30,
        height: 30,
        marginLeft: -50,
        marginRight: 10
	},
    right : {
        position: "absolute",
        right : 10,
        ...ifIphoneX({
            top : 40
        },{}),
    },
    title : {
        fontFamily : "DMSans-Medium", 
        fontSize : 18
    }
})

export default Header;
