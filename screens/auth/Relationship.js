import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Text from "../../components/Text";
import RadioForm from "../../components/RadioForm";
import {relationStatus} from "../../constants";
import { connect } from "react-redux";
import { updateUserState } from "../../actions/AuthActions";

const { width, height } = Dimensions.get("window");

class Relationship extends Component {
    constructor(props) {
        super(props);
        this.state = {
            relationship : 0
        };
        console.log(this.props.user);
    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerRight: navigation.state.params && navigation.state.params.headerRight
        }
    }

    _onNext = () => {
        const { updateUserState } = this.props;
        updateUserState(this.state);
        this.props.navigation.navigate("Interests");

    }

    componentDidMount = () => {
        const that = this;
        this.props.navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity style={{ marginRight: 20 }} onPress={that._onNext}>
                    <Text style={{ color: "white", fontSize: 18, fontFamily: "DMSans-Bold" }}>Next</Text>
                </TouchableOpacity>
            )
        })
    }

    _onChange = (value) =>{
        this.setState({relationship : value})
    }
    render() {
        var status = [];
        relationStatus.map((item, index) => {
            status.push({label:item, value :index});
        })
        
        return (
            <View style={style.bg}>
                <Text style={{color : "#DA1DA2", fontSize: 18, fontFamily: "DMSans-Medium"}}>4 / 7</Text>
                <Text style={{color : "#DA1DA2", fontSize: 28, fontFamily: "DMSans-Medium", marginTop : 10}}>Relationship Status</Text>
                <View style={{marginTop : 20, flex : 1}}> 
                    <RadioForm data={status} onChange = {this._onChange}/>
                </View>
            </View>
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
})

const mapStateToProps = state => ({
    user : state.UserReducer
});

const mapDispatchToProps = dispatch => ({
    updateUserState : data => dispatch(updateUserState(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(Relationship);
