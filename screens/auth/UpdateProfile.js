import React, { Component } from 'react';
import { ScrollView, View, TouchableOpacity, StyleSheet, Dimensions, PermissionsAndroid } from 'react-native';
import { connect } from "react-redux";
import Textarea from 'react-native-textarea';
import Text from "../../components/Text"
import TextInput from "../../components/TextInput";
import DatePicker from "../../components/DatePicker";
import Slider from "../../components/Slider";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome5";
import { updateUserState } from "../../actions/AuthActions";
import Geolocation from "@react-native-community/geolocation";
import Geocoder from "react-native-geocoder";
import moment from "moment";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
const { width, height } = Dimensions.get("window");

class UpdateProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fullname : this.props.user.fullname,
            birthdate : "",
            height : 4,
            weight : 100, 
            bio :"",
            position : "", 
            country: "", 
            city : "",
            age : 18
        };
    }
    static navigationOptions = ({ navigation }) => {
        return {
            headerRight: navigation.state.params && navigation.state.params.headerRight
        }
    }

    _onNext = () => {
        const regName = /^[a-zA-Z]+ [a-zA-Z]+$/;
        if (!regName.test(this.state.fullname)) {
            alert("Please enter your fullname!");
            return;
        } 
        if(this.state.birthdate == "" || new Date(this.state.birthdate) == null){
            alert("Please enter validate your birthdate!");
            return;
        }
        if(this.state.bio == ""){
            alert("Please enter your Bio!");
            return;
        }
        const age = moment().diff(this.state.birthdate, 'years');
        const data = this.state;
        data.age = age;        
        data.birthdate = new Date(this.state.birthdate);
        const { updateUserState } = this.props;
        updateUserState(data);
        this.props.navigation.navigate("Relationship");
    }

    componentDidMount = async () => {
        const that = this;
        this.props.navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity style={{ marginRight: 20 }} onPress={ that._onNext }>
                    <Text style={{ color: "white", fontSize: 18, fontFamily: "DMSans-Bold" }}>Next</Text>
                </TouchableOpacity>
            )
        })
        Geolocation.setRNConfiguration({skipPermissionRequests: true, authorizationLevel : "always"});
        Geolocation.getCurrentPosition(
            info => {
                const position = { lat : info.coords.latitude, lng : info.coords.longitude }
                Geocoder.geocodePosition(position).then(res => {
                    console.warn(res);
                    this.setState({ position : position, country : res[0].countryCode, city : res[0].adminArea });
                })
                .catch(err => {
                    console.warn(err)
                })
            },
            error =>  { console.log(error) },
            {
                enableHighAccuracy: false,
                timeout: 5000,
            },

        )
    }

    _onChangeFullName = (fullname) => {
        this.setState({fullname : fullname})
    }
    _onChangeBirthday = (date) => {
        this.setState({birthdate : date})
    }
    _onChangeHeight = (value) => {
        this.setState({height : value})
    }
    _onChangeWeight = (value) => {
        this.setState({weight : value})
    }
    _onChangeBio = (text) => {
        this.setState({bio : text})
    }

    render() {
        return (
            <KeyboardAwareScrollView style={style.bg}>
                <Text style={{color : "#DA1DA2", fontSize: 18, fontFamily: "DMSans-Medium"}}>3 / 7</Text>
                <Text style={{color : "#DA1DA2", fontSize: 28, fontFamily: "DMSans-Medium", marginTop : 10}}>Account Information</Text>
                <View style={style.itemContainer}>
                    <View style={{flexDirection :"row",alignItems :"center", width:"100%", marginLeft : 10}}>
                        <FontAwesomeIcon name="user-alt" color="#DA1DA2" size={24} />
                        <Text style={style.itemLabel}>Name</Text>
                    </View>
                    <TextInput dark placeholder="Full Name" style={{width : "100%"}} value={this.state.fullname} onChangeText={this._onChangeFullName}/>
                </View>
                <View style={style.itemContainer}>
                    <View style={{flexDirection :"row",alignItems :"center", width:"100%", marginLeft : 10}}>
                        <FontAwesomeIcon name="birthday-cake" color="#DA1DA2" size={24} />
                        <Text style={style.itemLabel}>Birthday</Text>
                    </View>
                    <DatePicker style={{width:"100%"}} dark placeholder="Birthday" onChangeDate={this._onChangeBirthday}/>
                    {/* <TextInput dark placeholder="Please enter your valid birthday." style={{width : "100%"}} value={this.state.birthdate} onChangeText={this._onChangeBirthday}/> */}
                    {/* <View style={{flexDirection :"row",alignItems :"center", width:"100%", marginLeft : 10}}>
                        <FontAwesomeIcon name="birthday-cake" color="#DA1DA2" size={24} />
                        {/* <Text style={style.itemLabel} placeholder="Birthday">{this.state.birthdate}</Text> */}
                    {/* </View> */} 
                    
                </View>
                <View style={style.itemContainer}>
                    <View style={{flexDirection :"row",alignItems :"center", width:"100%" ,marginLeft : 10}}>
                        <FontAwesomeIcon name="ruler" color="#DA1DA2" size={24} />
                        <Text style={style.itemLabel}>Height</Text>
                        <View style={{position:"absolute", right : 5, flexDirection :"row"}}>
                            <Text style={{color : "#DA1DA2", fontSize : 18, fontFamily: "DMSans-Bold"}}>{parseFloat(this.state.height).toFixed(1)} feet </Text>
                            <Text style={{fontSize : 18}}>({(parseFloat(this.state.height) * 30.48).toFixed(2)} cm)</Text>
                        </View>
                    </View>
                    <Slider 
                        value={this.state.height} 
                        onValueChange={this._onChangeHeight}
                        minValue={4}
                        maxValue={8}
                        trackWidth="100%"
                        step={0.1}
                    />
                </View>
                {/* <View style={style.itemContainer}>
                    <View style={{flexDirection :"row",alignItems :"center", width:"100%", marginLeft : 10}}>
                        <FontAwesomeIcon name="weight" color="#DA1DA2" size={24} />
                        <Text style={style.itemLabel}>Weight</Text>
                        <View style={{position:"absolute", right : 5, flexDirection :"row"}}>
                            <Text style={{color : "#DA1DA2", fontSize : 18, fontFamily: "DMSans-Bold"}}>{this.state.weight} lbs </Text>
                            <Text style={{fontSize : 18}}>({(parseFloat(this.state.weight) * 0.453592).toFixed(2)} Kg)</Text>
                        </View>
                    </View>
                    <Slider 
                        value={this.state.weight} 
                        onValueChange={this._onChangeWeight}
                        minValue={100}
                        maxValue={300}
                        trackWidth="100%"
                        step={1}

                    />
                </View> */}

                <View style={style.itemContainer}>
                    <View style={{flexDirection :"row",alignItems :"center", width:"100%", marginLeft : 10}}>
                        <FontAwesomeIcon  name="bullhorn" color="#DA1DA2" size={24} />
                        <Text style={{marginLeft : 10, fontSize : 18, fontFamily :"DMSans-Medium"}}>About You</Text>
                    </View>
                    <Textarea
                        containerStyle={style.textareaContainer}
                        style={style.textarea}
                        onChangeText={this._onChangeBio}
                        defaultValue={this.state.text}
                        maxLength={350}
                        placeholder={'Please enter about you.'}
                        placeholderTextColor={'#c7c7c7'}
                        underlineColorAndroid={'transparent'}
                    />
                </View>
            </KeyboardAwareScrollView>
        );
    }
}

const style= StyleSheet.create({
    bg : {
        width:width,
        flex : 1,
        backgroundColor :"#262628",
        paddingVertical:30,
        paddingHorizontal:10
    },
    itemContainer:{
        marginTop : 20,
        alignItems:"center",
    },
    itemLabel : {
        marginLeft : 10, 
        fontSize : 18, 
        fontFamily:"DMSans-Medium"
    },
    textareaContainer: {
        height: 180,
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: '#70707022',
        marginTop : 10,
        borderRadius : 10,
        marginBottom : 50
    },
    textarea: {
        textAlignVertical: 'top',  // hack android
        height: 170,
        fontSize: 16,
        color: 'white',
        fontFamily: "DMSans-Regular"
    },
})

const mapStateToProps = state => ({
    user : state.UserReducer
});

const mapDispatchToProps = dispatch => ({
    updateUserState : data => dispatch(updateUserState(data))
})

export default connect(mapStateToProps,mapDispatchToProps)(UpdateProfile);
