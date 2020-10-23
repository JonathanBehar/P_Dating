import React, { Component } from 'react';
import { ScrollView, View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Text from "../../../components/Text";
import RadioForm from "../../../components/RadioForm";
import {occupations} from "../../../constants";
import { connect } from "react-redux";
import { updateUserState } from "../../../actions/AuthActions";
import firestore from "@react-native-firebase/firestore";
import Loading from "../../Loading";

const { width, height } = Dimensions.get("window");

class Occupation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            occupation : props.user.occupation,
            loading : false
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
                <TouchableOpacity style={{ marginRight: 20 }} onPress={ that._onSave }>
                    <Text style={{ color: "white", fontSize: 18, fontFamily: "DMSans-Bold" }}>Save</Text>
                </TouchableOpacity>
            )
        })
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
            <View style={{flex : 1}}> 
                <ScrollView style={style.bg}>
                    <View style={{marginTop : 20, flex : 1, marginBottom : 100}}> 
                        <RadioForm data={status} onChange = {this._onChange} value={this.props.user.occupation} />
                    </View>
                </ScrollView>
                {this.state.loading && <Loading />}
            </View>
        );
    }
}

const style= StyleSheet.create({
    bg : {
        width:width,
        flex : 1,
        backgroundColor :"#262628",
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
