import React, { Component } from 'react';
import { ScrollView, View, TouchableOpacity, StyleSheet, Dimensions, PermissionsAndroid } from 'react-native';
import { connect } from "react-redux";
import Textarea from 'react-native-textarea';
import Text from "../../../components/Text"
import TextInput from "../../../components/TextInput";
import DatePicker from "../../../components/DatePicker";
import Slider from "../../../components/Slider";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome5";
import { updateUserState } from "../../../actions/AuthActions";
import firestore from "@react-native-firebase/firestore";
import moment from "moment";
import Loading from "../../Loading";

const { width, height } = Dimensions.get("window");

class UpdateProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fullname : props.user.fullname,
            birthdate : new Date(moment(typeof props.user.birthdate.toDate == "undefined"?props.user.birthdate:props.user.birthdate.toDate())),
            height : props.user.height,
            weight : props.user.weight, 
            bio : props.user.bio,
            loading : false
        };
    }
    static navigationOptions = ({ navigation }) => {
        return {
            headerRight: navigation.state.params && navigation.state.params.headerRight
        }
    }

    _onSave = async () => {
        const regName = /^[a-zA-Z]+ [a-zA-Z]+$/;
        if (!regName.test(this.state.fullname)) {
            alert("Please enter your fullname!");
            return;
        } 
        if(this.state.birthdate == ""){
            alert("Please enter your birthdate!");
            return;
        }
        if(this.state.bio == ""){
            alert("Please enter your Bio!");
            return;
        }
        this.setState({loading : true });
        const { loading, ...user } = this.state;
        try{
            await firestore().collection("users").doc(this.props.user.uid).update(user);
            const { updateUserState } = this.props;
            updateUserState(user);
            this.setState({loading : false})
        }
        catch(e){
            console.warn(e);
            this.setState({loading : false});
        }
    }

    componentDidMount = async () => {
        const that = this;
        this.props.navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity style={{ marginRight: 20 }} onPress={ that._onSave }>
                    <Text style={{ color: "white", fontSize: 18, fontFamily: "DMSans-Bold" }}>Save</Text>
                </TouchableOpacity>
            )
        })
    }

    _onChangeFullName = ( fullname ) => {
        this.setState({ fullname : fullname })
    }
    _onChangeBirthday = ( date ) => {
        this.setState({ birthdate : date })
    }
    _onChangeHeight = ( value ) => {
        this.setState({ height : value })
    }
    _onChangeWeight = ( value ) => {
        this.setState({ weight : value })
    }
    _onChangeBio = ( text ) => {
        this.setState({ bio : text })
    }

    render() {
        return (
            <ScrollView style={style.bg}>
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
                    <DatePicker 
                        style={{width:"100%"}} 
                        dark 
                        placeholder="Birthday" 
                        onChangeDate={this._onChangeBirthday}
                        value={this.state.birthdate}
                    />
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
                        defaultValue={this.state.bio}
                        maxLength={350}
                        placeholder={'Please enter about you.'}
                        placeholderTextColor={'#c7c7c7'}
                        underlineColorAndroid={'transparent'}
                    />
                </View>
                {this.state.loading && <Loading /> }
            </ScrollView>
        );
    }
}

const style= StyleSheet.create({
    bg : {
        width:width,
        flex : 1,
        backgroundColor :"#262628",
        paddingVertical:10,
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
