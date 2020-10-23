import React, { Component } from 'react';
import { ScrollView, View, TouchableOpacity, StyleSheet, Dimensions, SafeAreaView } from 'react-native';
import Text from "../../components/Text";
import RadioForm from "../../components/RadioForm";
import {occupations} from "../../constants";
import { connect } from "react-redux";
import { updateUserState } from "../../actions/AuthActions";

const { width, height } = Dimensions.get("window");

class Occupation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            occupation : 0
        };
    }

    componentDidMount = () => {
        
    }

    _onChange = (value) => {
        this.setState({occupation : value})
    }
    _onPressDone = () =>{
        const { updateUserState }  = this.props;
        updateUserState(this.state);
        this.props.navigation.navigate("CompleteScreen");
    }

    render() {
        var status = [];
        occupations.map((item, index) => {
            status.push({label:item, value :index});
        })
        return (
            <SafeAreaView style={{flex : 1}}> 
                <ScrollView style={style.bg}>
                    <Text style={{color : "#DA1DA2", fontSize: 18, fontFamily: "DMSans-Medium"}}>7 / 7</Text>
                    <Text style={{color : "#DA1DA2", fontSize: 28, fontFamily: "DMSans-Medium", marginTop : 10}}>What is your Profession?</Text>
                    <View style={{marginTop : 20, flex : 1, marginBottom : 100}}> 
                        <RadioForm data={status} onChange = {this._onChange}/>
                    </View>
                </ScrollView>
                <View style={style.doneContainer}>
                    <TouchableOpacity style={style.done} onPress={this._onPressDone} >
                        <Text style={style.doneText}>DONE</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
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
    doneContainer :{
        position :"absolute", 
        bottom : 0, 
        width : width, 
        paddingVertical : 5, 
        backgroundColor :"black"
    },
    done : {
        backgroundColor:"#AF1782", 
        height:50, 
        marginHorizontal : 20, 
        borderRadius : 10, 
        justifyContent:"center", 
        alignItems:"center" 
    },
    doneText:{
        fontSize : 20, 
        fontFamily:"DMSans-Bold"
    }
})

const mapStateToProps = state => ({
    user : state.UserReducer
});

const mapDispatchToProps = dispatch => ({
    updateUserState : data => dispatch(updateUserState(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(Occupation);
