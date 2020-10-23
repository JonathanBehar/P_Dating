import React, { Component } from 'react';
import { ScrollView, View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Text from "../../../components/Text";
import { interests } from "../../../constants";
import { CheckBox } from "react-native-elements";
import { connect } from "react-redux";
import { updateUserState } from "../../../actions/AuthActions";
import Loading from "../../Loading";
import firestore from "@react-native-firebase/firestore";

const { width, height } = Dimensions.get("window");

class Interests extends Component {
    constructor(props) {
        super(props);
        this.state = {
            interest : props.user.interest,
            loading :false
        };
    }
    static navigationOptions = ({ navigation }) => {
        return {
            headerRight: navigation.state.params && navigation.state.params.headerRight
        }
    }

    _onSave = async () => {
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

    componentDidMount = () => {
        const that = this;
        this.props.navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity style={{ marginRight: 20 }} onPress={that._onSave}>
                    <Text style={{ color: "white", fontSize: 18, fontFamily: "DMSans-Bold" }}>Save</Text>
                </TouchableOpacity>
            )
        })
    }

    render() {

        const status = [];
        interests.map((item,index) => {
            status.push({label : item, value:index});
        })
        return (
            <ScrollView style={style.bg}>
                <View style={{justifyContent: 'center', alignItems: 'center', marginTop : 20}}>
                    {status.map(item => (
                        <CheckBox 
                            title = {item.label}
                            checked={this.state.interest.indexOf(item.value) !== -1}
                            containerStyle={style.itemContainer}
                            textStyle={style.labelStyle}
                            onPress = {() => {
                                const values = this.state.interest;
                                var selected = values.indexOf(item.value);
                                
                                if(selected === -1) {
                                    values.push(item.value);
                                    this.setState({interest: values })
                                }
                                else {
                                    values.splice(selected, 1);
                                    this.setState({interest: values}) 
                                }
                            }}
                            checkedColor = "#DA1DA2"
                            iconRight
                        />
                    ))}
                </View>
                {this.state.loading && <Loading />}
            </ScrollView>
        );
    }
}


const style= StyleSheet.create({
    bg : {
        width:width,
        flex : 1,
        backgroundColor :"#262628",
        paddingVertical:30,
        paddingHorizontal:10,
    },
    itemContainer : {
        backgroundColor : "#1F1F21", 
        borderRadius : 10, 
        height : 55, 
        width : " 100%",
        justifyContent:"center", 
        borderColor:"transparent",
    },
    labelStyle :{
        width : "85%", 
        fontSize : 18, 
        fontFamily :"DMSans-Medium", 
        color : "white"
    }
})

const mapStateToProps = state => ({
    user : state.UserReducer
});

const mapDispatchToProps = dispatch => ({
    updateUserState : data => dispatch(updateUserState(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(Interests);
