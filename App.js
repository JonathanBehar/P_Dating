import React, { Component, useEffect} from 'react';
import { StatusBar, Alert } from 'react-native';
import { Provider } from "react-redux";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import configureStore from  "./store/configureStore"; 
import rootSaga from "./sagas";
import { navigationRef } from './navigations/navHelper';
import SplashScreen from "./screens/SplashScreen";
import AuthStack from "./navigations/AuthStack";
import GuideStack from "./navigations/GuideStack";
import MainStack from "./navigations/MainStack";
import UserDetails from "./screens/main/UserDetails";
import ChatScreen from "./screens/main/chats/ChatScreen";
import Filter from "./screens/main/Filter";
import Text from "./components/Text";
import FastImage from "react-native-fast-image";
import { View, Platform } from "react-native";

import messaging from '@react-native-firebase/messaging' // Added By Zhao

const store = configureStore();
store.runSaga(rootSaga);

const Stack = createStackNavigator();

function App() {

	messaging().setBackgroundMessageHandler(async remoteMessage => {
		console.log('Message handled in the background!', remoteMessage);
	});
	
	useEffect(() => {
		requestUserPermission();
		const unsubscribe = messaging().onMessage(async remoteMessage => {
			Alert.alert(remoteMessage.notification.title, remoteMessage.notification.body);
		});
		return unsubscribe;
	}, []);
	
	requestUserPermission = async () => {
		const authStatus = await messaging().requestPermission();
		const enabled =
			authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
			authStatus === messaging.AuthorizationStatus.PROVISIONAL;
		if (enabled) {
			getFcmToken()
			console.log('Authorization status:', authStatus);
		}
	}
	
	getFcmToken = async () => {
		const fcmToken = await messaging().getToken();
		if (fcmToken) {
			console.log("Your Firebase Token is:", fcmToken);
		} else {
			console.log("Failed", "No token received");
		}
	}
	return (
		<Provider store={store}>
			<StatusBar hidden={true} />
			<NavigationContainer ref={navigationRef}>
				<Stack.Navigator screenOptions={{gestureEnabled : false}}>
					<Stack.Screen name="Splash" component={SplashScreen} options={{headerShown : false}}/>
					<Stack.Screen name="AuthStack" component={AuthStack} options={{headerShown : false}} />
					<Stack.Screen name="GuideStack" component={GuideStack} options={{headerShown : false}} />
					<Stack.Screen name="MainStack" component={MainStack} options={{headerShown : false}} />
					<Stack.Screen name="UserDetails" component={UserDetails}
						options={(props) => ({
							title : props.route.params.user.fullname,
							headerStyle: {
								backgroundColor:  "black",
							},
							headerTintColor: "white",
							headerTitleStyle: {
								fontFamily: "DMSans-Medium",
								fontSize: 20, 
							},
							headerBackTitleVisible : false,
						})}
					/>
					<Stack.Screen name="ChatScreen" component={ChatScreen}
						options={(props) => ({
							title : props.route.params.user.fullname,
							headerStyle: {
								backgroundColor:  "black",
							},
							headerTintColor: "white",
							headerTitleStyle: {
								fontFamily: "DMSans-Medium",
								fontSize: 20, 
							},
							headerBackTitleVisible : false,
							headerRight : () => (<></>),
							headerTitle : () => (
								<View style={{flexDirection :"row", marginLeft : Platform.OS == "ios"?40:10, justifyContent:"center", alignItems:"center"}}>
									<FastImage 
										source={{uri : props.route.params.user.photos[0]}}
										style={{width : 40, height:40, borderRadius : 20}}
									/>
									<Text style={{width : "100%", fontSize : 18, marginLeft : 10,}}>
										{props.route.params.user.fullname}
									</Text>
								</View>)
						})
					}
					/>
					<Stack.Screen
						name="FilterScreen"
						component={Filter} 
						options={{
							title : " Filters for Pursuing",
							headerStyle: {
								backgroundColor:  "black",
							},
							headerTintColor: "white",
							headerTitleStyle: {
								fontFamily: "DMSans-Medium",
								fontSize: 20, 
							},
							headerBackTitleVisible : false,
						}}
					/>
				</Stack.Navigator>
			</NavigationContainer>
		</Provider>
	);
}

export default App;