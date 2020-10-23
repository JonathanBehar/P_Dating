import React, { Component } from 'react';
import { SafeAreaView, Alert, View, Image, TouchableOpacity, StyleSheet, Linking, Dimensions, ImageBackground } from 'react-native';
import LinearGradient from "react-native-linear-gradient";
import Text from "../../components/Text";
import Header from "../../components/Header";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/FontAwesome";
import Swiper from 'react-native-deck-swiper'
import Card from "../../components/Card";
import firestore from "@react-native-firebase/firestore";
import Loading from "../Loading";
import Modal from "react-native-modal";
import FastImage from "react-native-fast-image";
import { matchedUser, getMatches } from "../../actions/UserActions";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { updateUserState } from "../../actions/AuthActions";
import moment from "moment";

const { width, height } = Dimensions.get("window");

class HomeScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			cardIndex : 0,
			swipedAll : false, 
			loading : false,
			showMatchedModal : false,
			matchedUser : null
		};
		this.swiper = React.createRef();
		this._onPressMatchedMessage = this._onPressMatchedMessage.bind(this);
		this._onBack = this._onBack.bind(this);
		this._onPressBoost = this._onPressBoost.bind(this);
	}


    componentWillUnmount() {
        this._unsubscribe()
    }



	componentDidMount = () => {
		const { navigation } = this.props

		firestore().collection("users").doc(this.props.user.uid).onSnapshot(
			(QuerySnapshot, r) => {
				const { updateUserState } = this.props;
				updateUserState(QuerySnapshot.data());
			},
			(error) => { 
				console.warn(error);
			}
		)
		this._unsubscribe = navigation.addListener('focus', () => {
            const { getMatches, user } = this.props;
            getMatches(user);
        });
	}

	onPressSuccessStories = () => {
		Linking.openURL("https://pursuedating.com/successstories/");
	}


	renderCard = (item) => {
		const { super_like } = this.props.user;
		var temp = super_like.filter(one => one == item.uid);
		var superLiked = false;
		if(temp.length > 0) superLiked = true;
		return (<Card item={item} superLiked={superLiked} />)
	}

	onSwipedAllCards = () => {
		this.setState({swipedAll : true});
	}

	_onPressLike = () => {
		this.swiper.swipeTop();
	}

	_onPressPass = () => {
		this.swiper.swipeBottom();
	}
	_onPressSuperLike = () => {
		this.swiper.swipeRight();
	}

	_onPressBoost = () => {
        const { uid } = this.props.user;
        const expireAt =  new Date(moment().add(30, "minutes"));
        Alert.alert(
            "Boost your Profile!",
            "Do you want to boost your profile?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "OK", onPress: async () => {
                    try{
                        await firestore().collection("users").doc(uid).update({
                            boost : true,
                            boostExpireAt : expireAt
                        });
						const { updateUserState } = this.props;
                        updateUserState({ 
                            boost : true,
                            boostExpireAt : expireAt
                        });
                    }
                    catch(e){
                        console.warn(e);
                    }
                }}
            ],
            { cancelable: false }
        )
    }

	async _onBack(){
		const cardIndex = this.state.cardIndex - 1;
		if(cardIndex < 0) return false;
		const user = this.props.matches[cardIndex];
		const { uid } = this.props.user;
		await firestore().collection('users').doc(user.uid).update({ matched : firestore.FieldValue.arrayRemove(uid), like_me :firestore.FieldValue.arrayRemove(uid), pass_me: firestore.FieldValue.arrayRemove(uid)  })
		await firestore().collection('users').doc(uid).update({ matched : firestore.FieldValue.arrayRemove(user.uid), like_me :firestore.FieldValue.arrayRemove(user.uid), pass_me: firestore.FieldValue.arrayRemove(user.uid) })
		this.swiper.swipeBack()
		this.setState({cardIndex : this.state.cardIndex - 1});

	}

	onSwipedBottom = async (index, user) => {
		const {uid} = this.props.user;
        await firestore().collection('users').doc(user.uid).update({
            pass_me : firestore.FieldValue.arrayUnion(uid)
		})
		
		this.setState({cardIndex : this.state.cardIndex + 1});

	}
	onSwipedTop = async (index, user) => {
		const { uid } = this.props.user;
       	await firestore().collection('users').doc(user.uid).update({
            like_me : firestore.FieldValue.arrayUnion(uid)
		})
		const { matchedUserAction } = this.props;
		const { like_me } = this.props.user;
		const liked = like_me.filter(one => one == user.uid)
		if(liked.length > 0){ 
			this.setState({showMatchedModal : true, matchedUser : user});
			await firestore().collection('users').doc(user.uid).update({ matched : firestore.FieldValue.arrayUnion(uid) })
			await firestore().collection('users').doc(uid).update({ matched : firestore.FieldValue.arrayUnion(user.uid) })
			matchedUserAction(user);
		}

		this.setState({cardIndex : this.state.cardIndex + 1});

		
	}
	onSwipedRight = async (index, user) => {
		const {uid}=this.props.user;
        this.setState({index : index + 1});
        await firestore().collection('users').doc(user.uid).update({
            super_like : firestore.FieldValue.arrayUnion(uid),
            like_me : firestore.FieldValue.arrayUnion(uid)
		});
		const { matchedUserAction } = this.props;
		const { like_me } = this.props.user;
		const liked = like_me.filter(one => one == user.uid)
		if(liked.length > 0){
			this.setState({showMatchedModal : true, matchedUser : user});
			await firestore().collection('users').doc(user.uid).update({ matched : firestore.FieldValue.arrayUnion(uid) })
			await firestore().collection('users').doc(uid).update({ matched : firestore.FieldValue.arrayUnion(user.uid) })
			matchedUserAction(user);
		}

		this.setState({cardIndex : this.state.cardIndex + 1});


	}

	_onPressMatchedMessage(){
		const { navigation } = this.props;
		this.setState({showMatchedModal : false});
		navigation.navigate("ChatScreen", { user : this.state.matchedUser });
		
	}
	_onPressFilter = () => {
		this.props.navigation.navigate("FilterScreen");
	}
	render() {
		return (
			<View style={{ flex: 1 }}>
				<Header
					left={<TouchableOpacity onPress={this._onPressFilter}>
								<Image source={require("../../assets/images/settings.png")} />
							</TouchableOpacity>}						
					title="Pursue"
					right={
						<TouchableOpacity style={style.successStories} onPress={this.onPressSuccessStories}>
							<LinearGradient colors={["#DA1DA2", "#6D0F51"]} style={style.successStoriesGradient}>
								<Text style={style.successStoriesText}>Success Stories</Text>
							</LinearGradient>
						</TouchableOpacity>}
				/>

				{/* No More Card */}
				{(this.props.matches.length == 0 || this.state.swipedAll )&& <View style={{flex : 1, backgroundColor :"#262628", width : width}}> 
					<LinearGradient colors={["#DA1DA2", "#6D0F51"]} style={style.nocard}>
						<View style={{borderRadius : 200, borderWidth :35, borderColor:"rgba(255,255,255, .03)"}}>
							<View style={{borderRadius : 200, borderWidth :30, borderColor:"rgba(255,255,255, 0.06)"}}>
								<View style={{borderRadius : 200, borderWidth :25, borderColor:"rgba(255,255,255, 0.1)"}}>
									<View style={{borderRadius : 200, borderWidth :20, borderColor:"rgba(255,255,255, 0.2)"}}>
										<Image source={{uri : this.props.user.photos[0]}} style={style.nocardimage} />
									</View>
								</View>
							</View>
						</View>
					</LinearGradient>
				</View> }
				{/* No More Card */}
				{(this.props.matches.length > 0 && !this.state.swipedAll)  && 
				<View style={style.swiperView}>
					<LinearGradient colors={["#DA1DA2", "#6D0F51"]} style={style.swiperViewBackground}>
						<Swiper
							ref={swiper => { this.swiper = swiper }}
							horizontalSwipe={false}
							onSwipedRight={this.onSwipedRight}
							onSwipedTop={this.onSwipedTop}
							onSwipedBottom={this.onSwipedBottom}
							onTapCard={this.swipeLeft}
							cards={this.props.matches}
							cardIndex={this.state.cardIndex}
							renderCard={card => this.renderCard(card)}
							onSwipedAll={this.onSwipedAllCards}
							stackSize={3}
							stackSeparation={0}
							backgroundColor="transparent"
							cardVerticalMargin={20}
							cardHorizontalMargin={wp("17.5%")}
							containerStyle={{justifyContent:"center", width: width, alignItems: "center"}}
							overlayLabels={{
								bottom: {
									title: 'PASS',
									style: {
										label: {
											backgroundColor: 'black',
											borderColor: 'black',
											color: 'white',
											borderWidth: 1,
											fontSize: 28
										},
										wrapper: {
											flexDirection: 'column',
											alignItems: 'flex-end',
											justifyContent: 'flex-start',
											marginTop: 30,
											marginLeft: -30
										}
									}
								},
								top: {
									title: 'PURSUE',
									style: {
										label: {
											backgroundColor: '#DA1DA2',
											borderColor: '#DA1DA2',
											color: 'white',
											borderWidth: 1,
											fontSize : 28
										},
										wrapper: {
											flexDirection: 'column',
											alignItems: 'center',
											justifyContent: 'center'
										}
									}
								},
								right: {
									title: 'SUPER LIKE',
									style: {
										label: {
											backgroundColor: '#DA1DA2',
											borderColor: '#DA1DA2',
											color: 'white',
											borderWidth: 1
										},
										wrapper: {
											flexDirection: 'column',
											alignItems: 'center',
											justifyContent: 'center'
										}
									}
								}
							}}
							animateOverlayLabelsOpacity
							animateCardOpacity
							swipeBackCard
						/>

						<View style={style.swipeButtonContainer}>
							<View style={style.swipeMainButtonContainer}>
								<TouchableOpacity style={style.starAndFlashButton} onPress={this._onPressSuperLike}>
									<Icon name="star-o" size={30} color="white" />
								</TouchableOpacity>
								<ImageBackground
									source={require("../../assets/images/swipe-button-background.png")}
									style={{
										width: 210,
										height: 100,
										flexDirection: "row",
										justifyContent: "space-between",
										alignItems: "center",
										paddingHorizontal: 15
									}}
								>
									<TouchableOpacity style={style.passAndLikeButton} onPress={this._onPressPass}>
										<Icon name="times" color="white" size={32} />
									</TouchableOpacity>
									<TouchableOpacity style={{ ...style.passAndLikeButton, backgroundColor: "white" }} onPress={this._onPressLike}>
										<Icon name="heart-o" color="#E7455A" size={32} />
									</TouchableOpacity>
								</ImageBackground>
								<TouchableOpacity style={style.starAndFlashButton} onPress={this._onPressBoost}>
									<Icon name="flash" size={30} color="white" />
								</TouchableOpacity>
							</View>
							<TouchableOpacity style={style.rewindButton} onPress={this._onBack}>
								<Icon name="undo" color="white" size={24} />
							</TouchableOpacity>
						</View>

					</LinearGradient>
				</View>
			}

				{this.state.showMatchedModal && <Modal
					isVisible={this.state.showMatchedModal}
					backdropColor="#B4B3DB"
					backdropOpacity={0.8}
					animationIn="zoomInDown"
					animationOut="zoomOutUp"
					animationInTiming={600}
					animationOutTiming={600}
					backdropTransitionInTiming={600}
					backdropTransitionOutTiming={600}
				>
					<LinearGradient colors={["#DA1DA2", "#6D0F51"]} style={style.matchedGradientContainer}>
						<View style={{flexDirection: "row",justifyContent:"center", alignItems:"center"}}>
							<FastImage source={{uri : this.props.user.photos[0]}} style={style.matchedAvatar}/>
							<FastImage source={require("../../assets/images/heart.png")} style={style.matchedPursueIcon}/>
							<FastImage source={{uri : this.state.matchedUser.photos[0]}} style={style.matchedAvatar}/>
						</View>
						<View style={{justifyContent: "center", alignItems:"center", marginTop : 20}}>
							<Text style={{fontFamily : "DMSans-Bold", fontSize : 48}}>Matched!</Text>
							<Text style={{fontFamily : "DMSans-Medium", fontSize : 18}}>You and Sam just liked each other!</Text>
						</View>

						<View style={{width : 20, height : 5, backgroundColor : "grey", marginTop : 20}}></View>

						<TouchableOpacity onPress={this._onPressMatchedMessage} style={{marginTop : 50, backgroundColor :"white", paddingVertical : 10, paddingHorizontal : 30, borderRadius : 5}}>
							<Text style={{color : "black", fontSize : 20}}>Send a Message</Text>
						</TouchableOpacity>
						<TouchableOpacity style={{marginTop : 15}} onPress={() => this.setState({showMatchedModal : false })}>
							<Text style={{fontSize : 20, fontFamily:"DMSans-Medium"}}  >Pursue Others</Text>
						</TouchableOpacity>
					</LinearGradient>
				</Modal>}
			</View>
		);
	}
}

const style = StyleSheet.create({
	successStories: {
		width: 80,
		alignItems: "center",
		justifyContent: 'center',
	},
	successStoriesGradient: {
		paddingHorizontal: 10,
		borderRadius: 5,
		height: 35,
		alignItems: "center",
		justifyContent: 'center',
	},
	successStoriesText: {
		textAlign: "center",
		lineHeight: 13,
		textTransform: "uppercase",
		fontSize: 12
	},
	nocard: {
		flex: 1,
		marginVertical: 20,
		marginHorizontal: 10,
		borderRadius: 10,
		justifyContent: "center",
		alignItems: "center"
	},
	nocardimage: {
		width: 120,
		height: 120,
		borderRadius: 60,
		borderWidth: 5,
		borderColor: "white"
	},
	swiperView: {
		flex: 1,
	},
	swiperViewBackground: {
		flex: 1,
		alignItems: "center",
		justifyContent:"center",
		width : width, 
	},

	swipeMainButtonContainer: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center"
	},
	starAndFlashButton: {
		width: 60,
		height: 60,
		borderRadius: 34,
		backgroundColor: 'rgba(34,34,34,0.2)',
		justifyContent: "center",
		alignItems: "center",
		marginHorizontal: 10
	},
	passAndLikeButton: {
		backgroundColor: "rgba(250,250,250,0.15)",
		width: 70,
		height: 70,
		borderRadius: 40,
		justifyContent: "center",
		alignItems: "center"
	},
	swipeButtonContainer: {
		position: "absolute",
		bottom: 35,
		justifyContent: 'center',
		alignItems: "center"
	},
	rewindButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		justifyContent: 'center',
		alignItems: "center",
		backgroundColor: "rgba(34,34,34,0.2)",
		position: "absolute",
		bottom: -20
	},
	matchedGradientContainer :{ 
		marginLeft : -20, 
		height : height, 
		width : width, 
		position: "absolute", 
		justifyContent:"center", 
		alignItems:"center"
	},
	matchedAvatar: { 
		width: 140, 
		height: 140, 
		borderRadius:70, 
		marginHorizontal:5 
	},
	matchedPursueIcon : {
		width : 50, 
		height:50, 
		position:"absolute", 
		zIndex:2
	}
	

})

const mapStateToProps = state => ({
	user: state.UserReducer,
	matches : state.MatchReducer.matches
})

const mapDispatchToProps = dispatch => ({
	matchedUserAction: data => dispatch(matchedUser(data)),
	updateUserState : data => dispatch(updateUserState(data)),
	getMatches : data => dispatch(getMatches(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
