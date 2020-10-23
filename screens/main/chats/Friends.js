import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, Dimensions, TouchableHighlight } from 'react-native';
import Text from "../../../components/Text";
import { connect } from "react-redux";
import LinearGradient from "react-native-linear-gradient";
import firestore from "@react-native-firebase/firestore";
import Loading from "../../Loading";
import FastImage from "react-native-fast-image";

const { width, height } = Dimensions.get("screen");

class Friends extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            loading: false
        };
    }


    componentDidMount() {

        const { navigation } = this.props;
        this.onload = navigation.addListener("focus", async () => {
            this.setState({ loading: true });
            const { uid } = this.props.user;
            const that = this;
            const snapshots = await firestore().collection("users").where("matched", "array-contains", uid).get();
            if(snapshots.docs.length == 0){
                this.setState({loading : false});
            }
            var messages = [];
            snapshots.docs.map(async (doc, i) => {
                const data = doc.data();
                const { uid } = this.props.user;
                const rid = data.uid;
                const uidArray = [uid, rid];
                const index = uidArray.sort().join("-");
                const snaps = await firestore().collection("messages")
                    .orderBy("createdAt", "desc")
                    .where("index", "==", index)
                    .limit(1)
                    .get();
                var last_message = null;
                try { last_message = snaps.docs[0].data(); }
                catch (e) { console.log(e) }

                const unreadSnaps = await firestore().collection("messages")
                    .where("index", "==", index)
                    .where("received", "==", false)
                    .where("receiver", "==", uid)
                    .get();
                messages.push({...data, message:last_message, unreadCount : unreadSnaps.docs.length });
                if(i == snapshots.docs.length - 1) {
                    messages = messages.sort(function(a, b){
                        if(a.message == null && b.message == null) return false;
                        else if( a.message == null && b.message != null) return false;
                        else if (a.message != null && b.message == null) return true;
                        else  { 
                            return new Date(a.message.createdAt.toDate()) < new Date(b.message.createdAt.toDate()); }
                    })
                    this.setState({messages : messages, loading: false});
                }
            });


        })
    }

    componentWillUnmount(){
        this.onload()
    }

    _onPress = item => {

        const {message, ...user} = item;
        this.props.navigation.navigate("ChatScreen", { user : user});

    }

    render() {
        return (
            <View style={style.bg}>
                <Text style={{ fontSize: 20, paddingLeft: 10, paddingVertical: 10 }}> Matches </Text>
                <LinearGradient colors={["#DA1DA2", "#6D0F51"]} style={style.listContainer}>

                    <FlatList
                        data={this.state.messages}
                        renderItem={({ item, index, separators }) => (
                            <TouchableOpacity
                                key={item.index}
                                onPress={() => this._onPress(item)}
                                onShowUnderlay={separators.highlight}
                                onHideUnderlay={separators.unhighlight}
                            >   
                                <View style={style.item}>
                                    <View>
                                        <FastImage 
                                            source={{uri : item.photos[0]}}
                                            resizeMode ={FastImage.resizeMode.cover}
                                            style={{width : 60, height :60, borderRadius : 30}}
                                        />
                                        {item.unreadCount > 0 && <View style={{position:"absolute", right : 0, bottom : 0, width:20, height:20, borderRadius : 10, backgroundColor : "red", justifyContent:"center", alignItems:"center"}}>
                                            <Text>{item.unreadCount}</Text>
                                        </View>
                                        }
                                    </View>
                                    <View style={{justifyContent:"center", borderBottomWidth : 2, marginLeft : 20, width : 300, borderBottomColor :"rgba(255,255,255, 0.3)"}}>
                                        <Text style={{fontSize : 20, fontFamily :"DMSans-Medium"}}>{item.fullname}</Text>
                                        {item.message != null && <Text style={{marginTop : 5, color :"white" }}>{item.message.image !=""?"Photo":item.message.text}</Text> }
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}
                    />

                </LinearGradient>
                {this.state.loading && <Loading />}
            </View>
        );
    }
}

const style = StyleSheet.create({
    bg: {
        width: width,
        backgroundColor: "#262628",
        flex: 1,
        paddingTop: 10,
    },
    item: {
        paddingHorizontal: 10,
        flexDirection: "row",
        marginBottom: 20
    },
    listContainer: {
        width: width,
        flex: 1,
        borderTopRightRadius: 70,
        paddingVertical: 20
    }
})

const mapStateToProps = state => ({
    user: state.UserReducer
})

export default connect(mapStateToProps, null)(Friends);
