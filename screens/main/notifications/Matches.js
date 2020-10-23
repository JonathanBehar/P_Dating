import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, ScrollView, TouchableOpacity,SafeAreaView } from 'react-native';
import Text from "../../../components/Text";
import FastImage from "react-native-fast-image";
import { connect } from "react-redux";
import { getMatched } from "../../../actions/UserActions";
const { width, height } = Dimensions.get("window");

class Matches extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        const { navigation } = this.props
        this._unsubscribe = navigation.addListener('focus', () => {
            const { getMatched, user } = this.props;
            getMatched({uid : user.uid});
        });
    }
    componentWillUnmount() {
        this._unsubscribe()
    }


    _onPressItem = item => { 
        const { navigation } = this.props;
        navigation.navigate("ChatScreen", { user : item})
    }

    render() {
        return (
            <SafeAreaView style={style.bg}>
                <ScrollView style={style.list}>
                    {this.props.matched.map((item, index)=>(
                        <TouchableOpacity key={index} style={style.item} onPress={() => this._onPressItem(item)}>
                            <FastImage source={{uri : item.photos[0]}} style={{width: 70, height:70, borderRadius : 35}} />
                             <View style={{justifyContent :"center", marginLeft : 30}}>
                                <Text style={{fontSize : 20, fontFamily:"DMSans-Medium"}}>{item.fullname}</Text>
                                <Text style={{ fontSize: 16, color: "#8e8e8e", marginTop: 5 }}>{(item.city !="" && item.country)?`${item.city}, ${item.country}` :"Unknown Location"}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
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
    item : {
        paddingHorizontal : 10,
        flexDirection: "row",
        marginBottom : 20
    },
    list : {
        paddingTop : 20
    }
})

const mapStateToProps = state => {
    return {
        matched : state.MatchReducer.matched,
        user : state.UserReducer
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getMatched : data => dispatch(getMatched(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Matches);

