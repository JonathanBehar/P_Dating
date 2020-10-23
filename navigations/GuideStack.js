import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import FirstScreen from "../screens/guide/FirstScreen";

const Stack = createStackNavigator();

function GuideStack({ navigation }) {
    return (
        <Stack.Navigator screenOptions={{
            gestureEnabled :false,
        }}>
                <Stack.Screen name="First" component={FirstScreen} options={{headerShown : false}}/>
        </Stack.Navigator> 
    )
}

export default GuideStack;

