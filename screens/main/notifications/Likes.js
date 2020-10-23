import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import Text from "../../../components/Text";
import FastImage from "react-native-fast-image";
import { connect } from "react-redux";
import firestore from "@react-native-firebase/firestore";
import Loading from "../../Loading";
const { width, height } = Dimensions.get("window");

class Likes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            likes : [],
            loading : false
        };
    }


    componentDidMount() {
        const { navigation } = this.props
        this._unsubscribe = navigation.addListener('focus', () => {
            this.setState({likes : []});
            const { like_me } = this.props.user;
            like_me.map( async (uid, index) => {
                const snapshot = await firestore().collection("users").doc(uid).get();
                var data = [];
                try{ data = snapshot.data();}
                catch(e) { console.log(e)}
                if(data != undefined)
                this.setState({ likes : [...this.state.likes, data]});
            });
        });
    }

    componentWillUnmount() {
        this._unsubscribe()
    }

    _onPressItem = item => {

        this.props.navigation.navigate("UserDetails", { user : item })
    }

    render() {
        return (
            <SafeAreaView style={style.bg}>
                <ScrollView style={style.list}>
                    {this.state.likes.map((item, index) => (
                        <TouchableOpacity key={index} style={style.item} onPress={() => this._onPressItem(item)}>
                            <FastImage source={{ uri: item.photos[0] }} style={{ width: 70, height: 70, borderRadius: 35 }} />
                            <View style={{ justifyContent: "center", marginLeft: 20 }}>
                                <Text style={{ fontSize: 20, fontFamily: "DMSans-Medium" }}>{item.fullname}</Text>
                                <Text style={{ fontSize: 16, color: "#8e8e8e", marginTop: 5 }}>{(item.city !="" && item.country)?`${item.city}, ${item.country}` :"Unknown Location"}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
                {this.state.loading && <Loading />}
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
    item: {
        paddingHorizontal: 10,
        flexDirection: "row",
        marginBottom: 10
    },

    list : {
        marginTop : 20
    }
})

const mapStateToProps = state => {
    return {
        liked: state.MatchReducer.liked,
        user : state.UserReducer
    }
}

export default connect(mapStateToProps, null)(Likes);
