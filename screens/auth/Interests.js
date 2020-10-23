import React, { Component } from 'react';
import { ScrollView, View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Text from "../../components/Text";
import { interests } from "../../constants";
import { CheckBox } from "react-native-elements";
import { connect } from "react-redux";
import { updateUserState } from "../../actions/AuthActions";

const { width, height } = Dimensions.get("window");

class Interests extends Component {
    constructor(props) {
        super(props);
        this.state = {
            interest : props.user.interest
        };
    }
    static navigationOptions = ({ navigation }) => {
        return {
            headerRight: navigation.state.params && navigation.state.params.headerRight
        }
    }

    componentDidMount = () => {
        const that = this;
        this.props.navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity style={{ marginRight: 20 }} onPress={ that._onNext }>
                    <Text style={{ color: "white", fontSize: 18, fontFamily: "DMSans-Bold" }}>Next</Text>
                </TouchableOpacity>
            )
        })
    }
    _onNext = () => {
        if(this.state.interest.length == 0){
            alert("Please select your interests!");
            return;
        }
        const { updateUserState } = this.props;
        updateUserState(this.state);
        this.props.navigation.navigate("ReligiousAffiliation");
    }

    render() {

        const status = [];
        interests.map((item,index) => {
            status.push({label : item, value:index});
        })
        return (
            <ScrollView style={style.bg}>
                <Text style={{color : "#DA1DA2", fontSize: 18, fontFamily: "DMSans-Medium"}}>5 / 7</Text>
                <Text style={{color : "#DA1DA2", fontSize: 28, fontFamily: "DMSans-Medium", marginTop : 10}}>Interests</Text>
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
