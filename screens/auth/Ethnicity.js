import React, { Component } from 'react';
import { ScrollView, View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Text from "../../components/Text";
import RadioForm from "../../components/RadioForm";
import { ethnicity } from "../../constants";
import { connect } from "react-redux";
import { updateUserState } from "../../actions/AuthActions";
const { width, height } = Dimensions.get("window");

class Ethnicity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ethnicity : 0
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
    _onChange = (value) => {
        this.setState({ethnicity : value})
    }

    _onNext = () => {
        // if(this.state.birthdate == ""){
        //     alert("Please enter your birthdate!");
        //     return;
        // }
        const { updateUserState } = this.props;
        updateUserState(this.state);
        this.props.navigation.navigate("Relationship");
    }

    render() {
        var status = [];
        ethnicity.map((item, index) => {
            status.push({label:item, value :index});
        })
        return (
            <ScrollView style={style.bg}>
                <Text style={{color : "#DA1DA2", fontSize: 18, fontFamily: "DMSans-Medium"}}>4 / 9</Text>
                <Text style={{color : "#DA1DA2", fontSize: 28, fontFamily: "DMSans-Medium", marginTop : 10}}>Ethnicity</Text>
                <View style={{marginTop : 20, flex : 1, marginBottom : 60}}> 
                    <RadioForm data={status} onChange = {this._onChange}/>
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
})

const mapStateToProps = state => ({
    user : state.UserReducer
});

const mapDispatchToProps = dispatch => ({
    updateUserState : data => dispatch(updateUserState(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(Ethnicity);
