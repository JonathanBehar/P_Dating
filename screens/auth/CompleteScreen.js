import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native';
import ProgressCircle from "react-native-progress-circle";
import { connect } from "react-redux";
import firestore from "@react-native-firebase/firestore";
import Text from "../../components/Text";

const { width, height } = Dimensions.get("window");

class CompleteScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            percent : 0
        };
    }

    async componentDidMount() {
        const that = this;
        var timer = setInterval(function(){
            that.setState({percent : that.state.percent + 1})
            if(that.state.percent == 100) clearInterval(timer);
        }, 100)
        
        const { user } = this.props;
        console.log(user);
        try{
            const result = await firestore().collection('users').doc(user.uid).set(user);
        }
        catch(e){
            alert(JSON.stringify(e));
        }
    }

    render() {
        return (
            <View style={style.bg}>
                <ProgressCircle 
                    percent={this.state.percent}
                    radius={90}
                    borderWidth={12}
                    color="#DA1DA2"
                    shadowColor="#707070"
                    bgColor="#262628"
                >
                    {this.state.percent > 99 && <Image source={require("../../assets/images/icons-checked.png")} />}
                </ProgressCircle>
                <Text style={style.awesome}>Awesome!</Text>
                <Text style={style.desc}>Your profile looks great, ready to <Text style={style.pursue}>Pursue</Text>.</Text>
                {this.state.percent > 99 && 
                <TouchableOpacity style={style.pursueButton} onPress={() => this.props.navigation.navigate("GuideStack")}>
                    <Text style={{fontSize:22, fontFamily:"DMSans-Medium"}}>PURSUE</Text>
                </TouchableOpacity>
                }
            </View>
        );
    }
}

const style= StyleSheet.create({
    bg : {
        width:width,
        flex : 1,
        backgroundColor :"#262628",
        paddingHorizontal:40,
        alignItems: 'center',
        paddingTop : 80
    },
    awesome : {
        fontFamily: "DMSans-Bold", 
        fontSize: 42,
        marginTop : 25
    }, 
    desc : {
        marginTop : 25,
        fontSize : 20, 
        marginHorizontal : 40,
        fontFamily:"DMSans-Medium", 
        textAlign :"center"
    },
    pursue : {
        color : "#DA1DA2",
        fontFamily:"DMSans-Medium", 
    },
    pursueButton : {
        position :"absolute", 
        bottom : 60, 
        height : 50, 
        width : 300,
        backgroundColor : "#DA1DA2", 
        justifyContent : "center", 
        alignItems : "center", 
        borderRadius : 10
    }
})

const mapStateToProps = state => ({
    user : state.UserReducer
});

const mapDispatchToProps = dispatch => ({
    updateUserState : data => dispatch(updateUserState(data))
})


export default connect(mapStateToProps, mapDispatchToProps)(CompleteScreen);
