import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { connect } from "react-redux";
import LinearGradient from "react-native-linear-gradient";
import { GiftedChat, Bubble, Time, InputToolbar, Actions, Composer, Send, MessageText } from "react-native-gifted-chat";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import firestore from '@react-native-firebase/firestore';
import ImagePicker from "react-native-image-picker";
import storage from "@react-native-firebase/storage";
import FastImage from "react-native-fast-image";

const { width, height } = Dimensions.get("screen");
class ChatScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: []
        };
    }
    componentDidMount(){
        this.getMessages(message => {
            this.setState(previous => ({
				messages: GiftedChat.append(previous.messages, message),
				loading: false
			}))
        });
    }

    onSend =  async (messages) => {
        const item = messages[0];
        const { uid } = this.props.user;
        const rid = this.props.route.params.user.uid;
        const uidArray = [uid, rid];
        const from_to = uidArray.sort().join("-");
        const message = {
            _id : item._id,
            text : item.text, 
            user : item.user,
            createdAt : firestore.FieldValue.serverTimestamp(),
            image : item.image?item.image:"",
            receiver : rid,
            received : false,
            system : false,
            index : from_to
        }
        try{
            await firestore().collection("messages").doc(message._id).set(message);
         }catch(e){ 
             console.warn(e);
         }

    }

    get user() {
		return {
			_id: this.props.user.uid,
			username: this.props.user.fullname,
			avatar: this.props.user.photos[0]
		}
    }
    
    getMessages = (callback) => { 
        const that = this;
        const { uid } = this.props.user;
        const rid = this.props.route.params.user.uid;
        const uidArray = [uid, rid];
        const index = uidArray.sort().join("-");
        firestore().collection("messages")
        .orderBy("createdAt","asc")
        .onSnapshot(function(snapshot){
            if(!snapshot) return callback([]);
            const docs = snapshot.docChanges();
            docs.forEach( change => {
                if (change.type === "added") {
                    let message;
                    try{
                        message = change.doc.data();
                        console.log(change.doc);
                        if(message.index == index){
                            if(message.receiver == uid)
                                firestore().collection("messages").doc(message._id).update({received : true})
                            callback(that.parseMessage(message));
                        }
                    }catch(e){
                        console.warn(e)
                    }
                }
                else {
                    callback([]);
                }
            })
            if(docs.length == 0) callback([]);
        });

    }

    parseMessage = message => {

        const {_id, user, text, createdAt, image, video } = message;
        var timestamp;
        if(!createdAt) timestamp = new Date();
        else timestamp = new Date(createdAt.toDate());
        return {
            _id,
            createdAt : timestamp,
            user,
            text,
            image,
        }
    }
    renderSend = (props) => {
		return (
			<Send
				{...props}
				disabled={!props.text}
				containerStyle={{
					width: 44,
					height: 44,
					alignItems: 'center',
					justifyContent: 'center',
					marginHorizontal: 4,
					marginVertical: 4,
			    }}
            >
				<Icon name="send" size={28} color="#DA1DA2" />
			</Send>
		)
	};

    renderTime(props) {
		const { currentMessage } = props;
		return (
			<Time
				{...props}
				timeTextStyle={{
					right: {
						color: "white",
						fontSize: 12
					},
					left: {
						color:  "#88C343",
						fontSize: 12
					}
				}}
				containerStyle={{
					right: { },
					left: {  }
				}}
			/>
		);
    }
    renderInputToolbar = (props) => {
		return <InputToolbar
			{...props}
			containerStyle={{
				backgroundColor: '#1F1F21',
				// paddingTop: 5,
                borderTopWidth: 0,
                // paddingBottom : 10
			}}
			primaryStyle={{ alignItems: 'center' }}
		/>
    }
    
    renderComposer = (props) => {
		return <Composer
			{...props}
			textInputStyle={{
				color: 'white',
				backgroundColor: '#262628',
				borderRadius: 40,
				paddingHorizontal: 12,
				marginLeft: 5,
				justifyContent: 'center',
				alignItems: "center",
				fontSize: 15,
				fontFamily: "DMSans-Medium",
				paddingTop: 14,
				paddingLeft: 10,
				paddingRight: 10, 
			}}
			composerHeight={42}
			placeholder="Type a message..."
		/>
    };
    
    _uploadImageToFirebase = async (response) => {
        const time = new Date().getTime();
        const ext = response.uri.split(".").pop();
        var reference = `messages/${time}.${ext}`;
        var ref = storage().ref(reference);
        var task = await ref.putFile(response.uri);
        const url = await ref.getDownloadURL();
        return url;
    }

    renderActions = (props) => {
        const that = this;
        return (<View style={{ justifyContent: "center", alignItems: "center"}}>
            <Actions 
                icon= {()=>(
                    <Icon name="camera" color="white" size={28} style={{marginTop : 2}}/>
                )}

                options={{
                    "Send a Image" : () => {
                        const options = {
                            title : "Select Photo",
                            noData : true,
                            mediaType : "photo",
                            allowEditing : true,
                            quality : 0.7
                        }
                        const that = this;
                        ImagePicker.showImagePicker(options, async (response)=>{
                            if(response.didCancel){
                                console.log("User cancelled image picker");
                            } else if( response.error ){
                                console.log("ImagePicker Error:", response.error)
                            } else {
                                this.setState({loading : true});
                                const url = await this._uploadImageToFirebase(response);
                                const time = new Date().getTime();
                                var message = [ {
                                    _id : "image" + time,
                                    text : "",
                                    user : that.user,
                                    image : url,
                                }]
                                this.onSend(message); 
                            }

                        })

                    }
                }}
            />

        </View>)


    }

	renderMessageText = (props) => {
		return <MessageText {...props}
			customTextStyle={{
				fontSize: 15,
				fontFamily: "DMSans-Medium",
				padding : 5
			}}
		/>
    }

    renderAvatar = (props) => {
        return (
            <FastImage 
                resizeMode={FastImage.resizeModel.contain}
                source={{uri : this.props.route.params.photos[0]}}
                style={{width : 48, height : 48}}
            />
        )
    }

    renderBubble = (props) => {
        return (
            <Bubble 
                {...props}
                wrapperStyle={{

                    right : {
                        backgroundColor :"#6D0F51"
                    },
                    left : {
                        backgroundColor :"white"
                    }
                

                }}
            />
        )

    }

    render() {
        const chat = <GiftedChat
            messages={this.state.messages}
            onSend={(message) => this.onSend(message)}
            user={this.user}
            // showAvatarForEveryMessage={true}
            renderSend={this.renderSend}
            alwaysShowSend={true}
            isLoadingEarlier={true}
            renderInputToolbar={this.renderInputToolbar}
            renderComposer={this.renderComposer}
            scrollToBottom={true}
            renderTime={this.renderTime}
            renderMessageText={this.renderMessageText}
            renderActions={this.renderActions}
            alignTop={true}
            multiline={true}
            renderBubble={this.renderBubble}
            renderAavatar={this.renderAavatar}
        />
        return (
            <View style={style.bg}>
                <LinearGradient colors={["#DA1DA2", "#6D0F51"]} style={style.chatArea}>
                    <View style={{backgroundColor:"rgba(0,0,0,.85)", position :"absolute", width : width, height: "100%"}}></View>
                    {chat}
                </LinearGradient>
            </View>
        );
    }
}

const style = StyleSheet.create({
    bg: {
        width: width,
        backgroundColor: "black",
        flex: 1,
        paddingTop: 10,
    },
    item: {
        paddingHorizontal: 10,
        flexDirection: "row",
        marginBottom: 20
    },
    listContainer : {
        width: width,
        flex : 1,
        borderTopRightRadius : 70
    },
    chatArea :{
        flex : 1,
        width : width,
        borderTopRightRadius : 70
    }
})

const mapStateToProps = state => ({
    user : state.UserReducer
});

export default connect(mapStateToProps,null)(ChatScreen);
