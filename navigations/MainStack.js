import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from "../screens/main/HomeScreen";
import NotificationStack from "./NotificationStack";
import ChatStack from "./ChatStack";
import ProfileStack from "./ProfileStack";
import { useIsFocused } from "@react-navigation/native";
import { Image } from "react-native";
import { isIphoneX } from 'react-native-iphone-x-helper';
import { color } from 'react-native-reanimated';

const TabStack = createBottomTabNavigator();

function MainStack({ navigation }) {
    return (
        <TabStack.Navigator
            lazy={false}
            tabBarOptions={{
                style: {
                    backgroundColor: "#1F1F21",
                    minHeight: isIphoneX()?85 : 55,
                    paddingTop : 5,
                    borderTopWidth : 1,
                    borderTopColor : "white",     
                },
                labelStyle: {
                    fontSize: 14,
                    fontFamily: "DMSans-Medium",
                    marginBottom: 5,
                    color : "white"
                },
                activeTintColor: "#DA1DA2"
            }}
        >
            <TabStack.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    title: "Pursue",
                    tabBarIcon: () => {
                        const isFocused = useIsFocused();
                        if (isFocused) {
                            return <Image source={require("../assets/images/pursue-icon-active.png")} />
                        } else {
                            return <Image source={require("../assets/images/pursue-icon-inactive.png")} />
                        }
                    }
                }}
            />
            <TabStack.Screen name="Chat" component={ChatStack}
                options={{
                    title: "Chat",
                    tabBarIcon: () => {
                        const isFocused = useIsFocused();
                        if (isFocused) {
                            return <Image source={require("../assets/images/chat-icon-active.png")} />
                        } else {
                            return <Image source={require("../assets/images/chat-icon-inactive.png")} />
                        }
                    }
                }}
            />
            <TabStack.Screen name="Notification" component={NotificationStack}
                options={{
                    title: "Notifications",
                    tabBarIcon: () => {
                        const isFocused = useIsFocused();
                        if (isFocused) {
                            return <Image source={require("../assets/images/noti-icon-active.png")} />
                        } else {
                            return <Image source={require("../assets/images/noti-icon-inactive.png")} />
                        }
                    }
                }}
            />
            <TabStack.Screen name="Profile" component={ProfileStack}
                options={{
                    title: "Profile",
                    tabBarIcon: () => {
                        const isFocused = useIsFocused();
                        if (isFocused) {
                            return <Image source={require("../assets/images/profile-icon-active.png")} />
                        } else {
                            return <Image source={require("../assets/images/profile-icon-inactive.png")} />
                        }
                    }
                }}
            />

        </TabStack.Navigator>
    )
}

export default MainStack;


