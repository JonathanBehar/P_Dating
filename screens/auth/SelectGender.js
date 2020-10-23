import React, { Component } from 'react';
import { View, StyleSheet, Dimensions,TouchableOpacity, Image, Platform } from 'react-native';
import { connect } from "react-redux";
import LinearGradient from 'react-native-linear-gradient';
import IonIcon from "react-native-vector-icons/Ionicons";
import Text from "../../components/Text";
import { updateUserState } from "../../actions/AuthActions";

const { width, height } = Dimensions.get("window");

class SelectGender extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gender : "men"
        };
    }
    
    static navigationOptions = ({navigation}) => {
        return {
            headerRight : navigation.state.params && navigation.state.params.headerRight
        }
    }
    
    _onNext = () => {
        const { updateUserState } = this.props;
        updateUserState({gender : this.state.gender});
        this.props.navigation.navigate("UpdateProfile");
    }

    componentDidMount = () => {
        const that = this;
        this.props.navigation.setOptions({
            headerRight : () => (
                <TouchableOpacity style={{marginRight : 20}} onPress={that._onNext}>
                    <Text style={{color : "white", fontSize :18, fontFamily:"DMSans-Bold"}}>Next</Text>
                </TouchableOpacity>
            )
        })
    }

    render() {
        return (
            <View style={style.bg}>
                <TouchableOpacity style={this.state.gender=="women"?style.selectedTouchable:style.unselectedTouchableFemale} onPress={()=>this.setState({gender :"women"})} activeOpacity={1}>
                    {this.state.gender=="men" && <View style={style.unselectedGenderContainer}>
                        <Image source={require("../../assets/images/icon-female.png")} />
                    </View> }
                    {this.state.gender =="women"&&<View style={style.femaleSelected}>
                        <LinearGradient colors={['#DA1DA2', "#6D0F51"]} style={style.selectedIconContainer}>
                            <Image source={require("../../assets/images/icon-female.png")} />
                            <View style={style.selectedCheckContainer}>
                                <LinearGradient colors={['#DA1DA2', "#6D0F51"]} style={style.selectedCheckInnerConainer}>
                                    <IonIcon name={Platform.OS=="android"?"md-checkmark-sharp":"ios-checkmark-sharp"} color="white" size={Platform.OS=="android"?24:18} />
                                </LinearGradient>
                            </View>
                        </LinearGradient>
                    </View>}
                </TouchableOpacity>
                <TouchableOpacity style={this.state.gender=="men"?style.selectedTouchable:style.unselectedTouchableMale} onPress={() => this.setState({gender :"men"})} activeOpacity={1}>
                    {this.state.gender =="men"&&<View style={style.maleSelected}>
                        <LinearGradient colors={['#DA1DA2', "#6D0F51"]} style={style.selectedIconContainer}>
                            <Image source={require("../../assets/images/icon-male.png")} />
                            <View style={style.selectedCheckContainer}>
                                <LinearGradient colors={['#DA1DA2', "#6D0F51"]} style={style.selectedCheckInnerConainer}>
                                    <IonIcon name={Platform.OS=="android"?"md-checkmark-sharp":"ios-checkmark-sharp"} color="white" size={Platform.OS=="android"?24:18} />
                                </LinearGradient>
                            </View>
                        </LinearGradient>
                    </View>}
                    {this.state.gender=="women" && <View style={style.unselectedGenderContainer}>
                        <Image source={require("../../assets/images/icon-male.png")} />
                    </View>}
                </TouchableOpacity>

            </View>
        );
    }
}

const style= StyleSheet.create({
    bg : {
        width:width,
        flex : 1,
        backgroundColor :"black",
    },
    selectedTouchable : {
        flex : 1, 
        backgroundColor :"#A7167C"
    },
    unselectedGenderContainer : {
        width : 120, 
        height :120, 
        borderRadius:60, 
        backgroundColor:"black", 
        justifyContent:"center", 
        alignItems:"center"
    },
    unselectedTouchableFemale :{
        justifyContent:"center",
        alignItems:"center",
        flex : 1,
        backgroundColor :"#A7167C",
        borderBottomLeftRadius : 70
    },
    unselectedTouchableMale :{
        justifyContent:"center",
        alignItems:"center",
        flex : 1,
        backgroundColor :"#A7167C",
        borderTopRightRadius : 70
    },
    selectedIconContainer : {
        width : 120, 
        height :120, 
        borderRadius:60, 
        justifyContent:"center", 
        alignItems:"center"
    },
    femaleSelected : {
        flex : 1, 
        backgroundColor :"black", 
        borderBottomLeftRadius : 70, 
        justifyContent: 'center', 
        alignItems:"center"
    },
    maleSelected : {
        flex : 1, 
        backgroundColor :"black", 
        borderTopRightRadius : 70, 
        justifyContent: 'center', 
        alignItems:"center", 
    },
    selectedCheckContainer : {
        padding : 5,
        position : "absolute", 
        bottom:Platform.OS=="android"?-5:15, 
        right:Platform.OS=="android"?-5:15, 
        width:Platform.OS=="android"?50:30, 
        height:Platform.OS=="android"?50:30, 
        borderRadius:25, 
        backgroundColor:"black",
    },
    selectedCheckInnerConainer : { 
        flex:1, 
        borderRadius : 20, 
        justifyContent:"center", 
        alignItems:"center"
    }

})

const mapStateToProps = state => ({
    user : state.UserReducer
});

const mapDispatchToProps = dispatch => ({
    updateUserState : data => dispatch(updateUserState(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(SelectGender);
