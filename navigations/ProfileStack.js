import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import ProfileScren from "../screens/main/profile/ProfileScren";
import EditProfile from "../screens/main/profile/EditProfile"
import UpdateProfile from "../screens/main/profile/UpdateProfile";
import Occupation from "../screens/main/profile/Occupation";
import ReligiousAffilation from "../screens/main/profile/ReligiousAffilation";
import Ethnicity from "../screens/main/profile/Ethncity";
import Relationship from "../screens/main/profile/Relationship";
import LookingFor from "../screens/main/profile/LookingFor";
import Interests from "../screens/main/profile/Interests";
import AccountSetting from "../screens/main/profile/AccountSetting";
import GeneralContact from "../screens/main/profile/GeneralContact";
import PlansScreen from "../screens/main/payments/PlansScreen";
// import PaymentMethods from "../screens/main/payments/PaymentMethods";
const Stack = createStackNavigator();

function ProfileStack({ navigation }) {
    return (
        <Stack.Navigator screenOptions={{
            headerStyle: {
                backgroundColor: "#262628",
            },
            headerTintColor: "white",
            headerTitleStyle: {
                fontFamily: "DMSans-Medium",
                fontSize: 20, 
            },
            headerBackTitleVisible : false,
            headerTitleAlign : "center",
            gestureEnabled : false
        }}>
            <Stack.Screen name="ProfileScren" component={ProfileScren} options={{headerShown : false}} />
            <Stack.Screen name="EditProfile" component={EditProfile} />
            <Stack.Screen name="BasicProfile" component={UpdateProfile} options={{title : "Update Profile"}}/>
            <Stack.Screen name="OccupationEdit" component={Occupation} options={{title: "Update Profile"}} />
            <Stack.Screen name="ReligiousEdit" component={ReligiousAffilation} options={{title: "Update Profile"}} />
            <Stack.Screen name="EthnicityEdit" component={Ethnicity} options={{title: "Update Profile"}} />
            <Stack.Screen name="RelationshipEdit" component={Relationship} options={{title: "Update Profile"}} />
            <Stack.Screen name="LookingForEdit" component={LookingFor} options={{title: "Update Profile"}} />
            <Stack.Screen name="InterestsEdit" component={Interests} options={{title: "Update Profile"}} />
            <Stack.Screen name="AccountSetting" component={AccountSetting} options={{title : "Settings"}} />
            <Stack.Screen name="GeneralContact" component={GeneralContact} options={{title : "Update Profile"}} />
            <Stack.Screen name="PlansScreen" component={PlansScreen} options={{headerShown : false}} />
            {/* <Stack.Screen name="PaymentMethods" component={PaymentMethods} options={{title : "Select Payment Method"}} /> */}
            
        </Stack.Navigator>
    )
}

export default ProfileStack;