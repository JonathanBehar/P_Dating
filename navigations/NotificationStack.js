import React, { Component } from "react";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Likes from "../screens/main/notifications/Likes";
import Matches from "../screens/main/notifications/Matches";
import {isIphoneX} from "react-native-iphone-x-helper";

const Tab = createMaterialTopTabNavigator();

function NotificationStack() {
    return (
        <Tab.Navigator 
            lazy={false}
            tabBarOptions={{
                style: {
                    backgroundColor: "#1F1F21",
                    minHeight: 55,
                    paddingTop : isIphoneX()?35:5
                },
                labelStyle: {
                    fontSize: 14,
                    fontFamily: "DMSans-Medium",
                    marginBottom: 5,
                },
                activeTintColor: "#DA1DA2",
                inactiveTintColor :"white"
            }}
        >
            <Tab.Screen name="Likes" component={Likes} />
            <Tab.Screen name="Matches" component={Matches} />
        </Tab.Navigator>
    );
}

export default NotificationStack;