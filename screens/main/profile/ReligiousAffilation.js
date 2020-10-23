import React, { Component } from 'react';
import { ScrollView, View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Text from "../../../components/Text";
import RadioForm from "../../../components/RadioForm";
import {religiousAffiliation} from "../../../constants";
import { connect } from "react-redux";
import { updateUserState } from "../../../actions/AuthActions";
import Loading from "../../Loading";
import firestore from "@react-native-firebase/firestore";

const { width, height } = Dimensions.get("window");

class ReligiousAffilation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            religious : props.user.religious, 
            loading : false
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

    _onChange = (value) => {
        this.setState({religious : value})
    }

    render() {
        var status = [];
        religiousAffiliation.map((item, index) => {
            status.push({label:item, value :index});
        })
        return (
            <ScrollView style={style.bg}>
                <View style={{marginTop : 20, flex : 1, marginBottom : 60}}> 
                    <RadioForm data={status} onChange = {this._onChange} value={this.state.religious}/>
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
        paddingHorizontal:10,
    },
})

const mapStateToProps = state => ({
    user : state.UserReducer
});

const mapDispatchToProps = dispatch => ({
    updateUserState : data => dispatch(updateUserState(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(ReligiousAffilation);
