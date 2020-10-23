import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, Dimensions, View, Image, SafeAreaView, ScrollView } from 'react-native';
import Text from "../../components/Text";
import LinearGradient from "react-native-linear-gradient";
const { width, height } = Dimensions.get("window");

class FirstScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            active: 0,
        };
    }

    skip = () => {
        this.props.navigation.navigate("MainStack");
    }

    next = async () => {
        await this.setState({active: this.state.active + 1});
        this.scroll.scrollTo({x: this.state.active * width});
    }

    change = ({nativeEvent}) => {
        const slide = Math.ceil((nativeEvent.contentOffset.x - 0.1) / nativeEvent.layoutMeasurement.width);
        if(slide !== this.state.active) {
            this.setState({active: slide});
        }
    }

    render() {
        return (
            <SafeAreaView style={style.container}>
                <ScrollView 
                    horizontal={true} 
                    pagingEnabled={true} 
                    showsHorizontalScrollIndicator={false}
                    onScroll={this.change}
                    ref={(node) => this.scroll = node}
                >
                    <View key="1" style={style.viewPager}>
                        <LinearGradient colors={["#DA1DA2", "#6D0F51"]} style={style.bg}>
                            <Text style={style.welcome}>Welcome &{"\n"}Thank you!</Text>
                            <Text style={style.desc}>Thanks for pursuing with us. We pray you find your match.</Text>
                            <View style={{alignItems: 'center', paddingBottom: 70, paddingTop: 20, width: '100%', height: 350}}>
                                <Image source={require("../../assets/images/guide1.png")} style={{}} />
                            </View>
                        </LinearGradient>
                    </View>
                    <View key="2" style={style.viewPager}>
                        <LinearGradient colors={["#DA1DA2", "#6D0F51"]} style={style.bg} >
                            <Text style={style.welcome}>Swipe Up{"\n"}To Pursue</Text>
                            <Text style={style.desc}>Swipe Up = Pursue{"\n"}Swipe Down = Pass</Text>
                            <View style={{alignItems: 'center', paddingBottom: 70, paddingTop: 20, width: '100%', height: '100%', margin: 0, padding: 0}}>
                                <Image source={require("../../assets/images/guide2.png")} style={{height: height * 0.7, padding: 0, position: 'absolute', top: 20, right: 0}}/>
                            </View>
                        </LinearGradient>
                    </View>
                    <View key="3" style={style.viewPager}>
                        <LinearGradient colors={["#DA1DA2", "#6D0F51"]} style={style.bg} >
                            <Text style={style.welcome}>Boosts &{"\n"}SuperLikes</Text>
                            <Text style={style.descTitle}>Boost</Text>
                            <Text style={style.descSec}>Allows you to be one of the top{"\n"}profiles in your area for 30 minutes</Text>
                            <View style={{alignItems: 'center', paddingBottom: 70, paddingTop: 20, width: '100%', height: '100%', margin: 0, padding: 0}}>
                                <Image source={require("../../assets/images/guide3.png")}/>
                            </View>
                        </LinearGradient>
                    </View>
                    <View key="4" style={style.viewPager}>
                        <LinearGradient colors={["#DA1DA2", "#6D0F51"]} style={style.bg} >
                            <Text style={style.welcome}>More Matches{"\n"}Than Ever</Text>
                            <Text style={style.desc}>Be open to the possibility,{"\n"}and you may find your forever.</Text>
                            <View style={{alignItems: 'center', paddingBottom: 70, paddingTop: 20, width: '100%', height: '100%', margin: 0, padding: 0}}>
                                <Image source={require("../../assets/images/guide4.png")}/>
                            </View>
                        </LinearGradient>
                    </View>
                </ScrollView>
                
                <View style={this.state.active != 3? style.pagination: style.paginationLast}>
                    <Text key='0' style={style.pagingText}>{this.state.active == 0 ? '◯':'⬤'}</Text>
                    <Text key='1' style={style.pagingText}>{this.state.active == 1 ? '◯':'⬤'}</Text>
                    <Text key='2' style={style.pagingText}>{this.state.active == 2 ? '◯':'⬤'}</Text>
                    <Text key='3' style={style.pagingText}>{this.state.active == 3 ? '◯':'⬤'}</Text>
                </View>
                <TouchableOpacity onPress={this.skip} style={this.state.active != 3? style.buttonSkip : style.buttonHidden}>
                    <Text style={{fontSize : 18, fontFamily:"DMSans-Bold", left: 0}}>SKIP</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.next} style={this.state.active != 3? style.buttonNext : style.buttonHidden}>
                    <Text style={{fontSize : 18, fontFamily:"DMSans-Bold", right: 0}}>NEXT</Text>
                </TouchableOpacity>
                <TouchableOpacity style={this.state.active == 3? style.pursueButton : style.buttonHidden} onPress={() => this.props.navigation.navigate("MainStack")}>
                    <Text style={{fontSize:15, fontFamily:"DMSans-Bold", color: '#6D0F51'}}>GET STARTED</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }
}

const style= StyleSheet.create({
    buttonSkip: {
        position: 'absolute',
        left: 42,
        bottom: 30
    },
    buttonNext: {
        position: 'absolute',
        right: 42,
        bottom: 30
    },
    buttonHidden: {
        display: 'none'
    },
    container: {
        flex: 1,
        height: height,
        width: width,
        justifyContent: 'center',
        alignItems: 'center'
    },
    pagination: {
        flexDirection: 'row', 
        position: 'absolute', 
        bottom: 50
    },
    paginationLast: {
        flexDirection: 'row', 
        position: 'absolute', 
        bottom: 90
    },
    viewPager: {
        backgroundColor: 'transparent',
        width: width,
        justifyContent: 'center',
        alignContent: 'center', 
        flex:1
    },
    pagingText: {
        margin: 3
    },
    bottom : {
        position: "absolute",
        bottom: 60,
        width: width * 0.8
    },
    bg : {
        width: width,
        margin: 0,
        height: height + 50,
        alignItems: 'center',
        paddingTop : 23
    },
    welcome : {
        fontFamily: "DMSans-Bold", 
        fontSize: 40,
        marginTop : 25,
        textAlign: 'center'
    }, 
    desc : {
        marginTop : 12,
        fontSize : 18,
        width: width * 0.6,
        marginHorizontal : 40,
        fontFamily:"DMSans-Bold", 
        textAlign :"center"
    }, 
    descTitle : {
        fontWeight: "bold",
        marginTop : 12,
        fontSize : 18,
        width: width * 0.6,
        marginHorizontal : 40,
        fontFamily:"DMSans-Bold", 
        textAlign :"center"
    },
    descSec : {
        marginTop : 0,
        fontSize : 18,
        width: width * 0.8,
        marginHorizontal : 40,
        fontFamily:"DMSans-Bold", 
        textAlign :"center"
    },
    pursue : {
        color : "#DA1DA2",
        fontFamily:"DMSans-Bold", 
    },
    pursueButton : {
        position :"absolute", 
        bottom : 40, 
        height : 40, 
        width : 160,
        backgroundColor : "white", 
        justifyContent : "center", 
        alignItems : "center", 
        borderRadius : 50,
    }
})

export default FirstScreen;
