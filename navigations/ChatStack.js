import React, { Component } from "react";
import { createStackNavigator } from '@react-navigation/stack';
import {isIphoneX } from 'react-native-iphone-x-helper';
import Friends from "../screens/main/chats/Friends";
import ChatScreen from "../screens/main/chats/ChatScreen";
import Text from "../components/Text";
import FastImage from "react-native-fast-image";
import { View, Image } from "react-native";

const Stack = createStackNavigator();

function ChatStack() {
    return (
        <Stack.Navigator 
            tabBarOptions={{
                style: {
                    backgroundColor: "#1F1F21",
                    minHeight: 55,
                    paddingTop : 5
                },
                labelStyle: {
                    fontSize: 14,
                    fontFamily: "DMSans-Medium",
                    marginBottom: 5,
                },
                activeTintColor: "#DA1DA2",
                inactiveTintColor :"white",
                
            }}
        >
            <Stack.Screen 
                name="Friends" 
                component={Friends} 
                options={{ 
                    headerStyle: {
                        backgroundColor: "black",
                    },
                    headerTintColor: "white",
                    headerTitleStyle: {
                        fontFamily: "DMSans-Medium",
                        fontSize: 20, 
                    },
                    headerLeft : () => (<></>),
                    headerRight : () => (<></>),
                    headerTitle : () => (
                        <View>
                            <Image style={{width: 30, height: 30, position: "absolute", marginLeft: isIphoneX()? -80 : 20}} source={require("../assets/images/msg12.png")} />
                            <Text style={{width : "100%", textAlign:"center", fontSize : 18}}>Message</Text>
                        </View>
                           )
                }}

            />
            
        </Stack.Navigator>
    );
}

export default ChatStack;