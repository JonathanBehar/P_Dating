import React, { Component } from 'react';
import { View, StyleSheet, ImageBackground, Dimensions, Image } from 'react-native';
import Text from "../../components/Text";
import Icon from "react-native-vector-icons/FontAwesome";
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import Loading from "../Loading";
import { registerSuccess, loginSuccess } from "../../actions/AuthActions";
import { connect } from "react-redux";
const { width, height } = Dimensions.get("window");

class StartScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading : true
        };
    }

     loginWithFacebook = async () => {
        const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
        if (result.isCancelled) {
            // throw 'User cancelled the login process';
            // alert("Sorry, Something went wrong, please use another start method");
            return;
        }
        // Once signed in, get the users AccesToken
        const data = await AccessToken.getCurrentAccessToken();
        if (!data) {
            // throw 'Something went wrong obtaining access token';
            alert("Sorry, Something went wrong, please use another start method");
            return;

        }
        // Create a Firebase credential with the AccessToken
        const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
        // Sign-in the user with the credential
        this.setState({loading : true});
        auth().signInWithCredential(facebookCredential).then(async res => {
            const { additionalUserInfo, user } = res;
            const { registerSuccess, loginSuccess } = this.props;
            const userDoc = await firestore().collection("users").doc(user.uid).get();
            const userData = userDoc.data();
            if(userData === undefined ){ 
                const data = { email : user.email, uid : user.uid }
                registerSuccess(data);
                this.props.navigation.navigate("PhoneVerify");
            }else{ 
                loginSuccess(userData);
            }
            this.setState({loading : false});
        }).catch(e => {
            this.setState({loading : false});
            alert("Sorry, Something went wrong, please use another start method");
            console.warn(e);
        });
    }

    loginWithEmail = () => {
        this.props.navigation.navigate("Login");
    }

    loginWithPhone = () => {
        this.props.navigation.navigate("PhoneVerify");
    }

    componentDidMount() {

        const that = this;
        const { loginSuccess, registerSuccess } = this.props;
        auth().onAuthStateChanged(function (user) {
            if (user) {
                const { uid, email } = user;
                firestore().collection("users").doc(uid).get()
                .then(doc => {
                    const userData = doc.data();
                    if (userData === undefined) { 
                        const data = {
                            uid : uid,
                            email : email
                        };
                        registerSuccess(data);
                        that.setState({ loading : false });
                    }
                    else {
                        if(userData.isVerifiedPhone) {
                            loginSuccess(userData);
                            that.props.navigation.navigate("UploadPhoto");
                            that.setState({ loading : false });
                        } else {
                            that.setState({ loading: false });
                        }
                    }
                })
                .catch(e=>{
                    that.setState({ loading : false });
                });
            }
            else {
                that.setState({ loading : false })
            }
        });
    }

    render() {
        return (
            <ImageBackground style={style.container} source={require("../../assets/images/splash.png")}>
                <View style={style.overlay}></View>
                <View style={style.top}>
                    <Image source={require("../../assets/images/heart.png")} />
                    <Text style={{fontSize : 60, color:"white", fontFamily:"DMSans-Regular"}}>Pursue</Text>
                    <Text style={{fontSize : 20, color:"white", fontFamily:"DMSans-Regular"}}>Black | Christian | Singles</Text>
                </View>
                <View style={{position:"absolute", bottom : 100, width:width-50, justifyContent:"center", paddingLeft : 50}}>
                    <View style={{ marginBottom: 10 }}>
                        <Icon.Button borderRadius={10} name="facebook" backgroundColor="#0C66FF" onPress={this.loginWithFacebook} style={style.button} >
                            <Text style={{ ...style.buttonText, color: "white" }}>Connect with Facebook</Text>
                        </Icon.Button>
                    </View>
                    <View style={{ marginBottom: 10 }}>
                        <Icon.Button borderRadius={10} name="envelope" backgroundColor="#f3f3f3" onPress={this.loginWithEmail} color="#DA1DA2" style={style.button}>
                            <Text style={{ ...style.buttonText, color: "#DA1DA2" }}>Connect with Email</Text>
                        </Icon.Button>
                    </View>
                    <View style={{ marginBottom: 10 }}>
                        <Icon.Button borderRadius={10} name="phone" backgroundColor="#DA1DA2" onPress={this.loginWithPhone} color="#f3f3f3" style={style.button}>
                            <Text style={{ ...style.buttonText, color: "#f3f3f3" }}>Connect with Phone</Text>
                        </Icon.Button>
                    </View>
                </View>
                {this.state.loading && <Loading backgroundColor="#111111"/>}
            </ImageBackground>
        );
    }
}

const style = StyleSheet.create({

    container : {
        width : width, 
        height : height
    },
    overlay : {
        width : width,
        height : height,
        position: "absolute",
        backgroundColor: "rgba(144,19,254,0.43)"
    },
    top : {
        marginTop : 80, 
        justifyContent : 'center', 
        alignItems : 'center'
    },
    button: {
        paddingVertical: 15,
        paddingLeft : 20, 

    },
    buttonText: {
        fontFamily: "DMSans-Bold",
        width : width-160,
        textAlign: "center", 
        fontSize:16
    },

})

const mapDispatchToProps = dispatch => ({

    registerSuccess : data => dispatch(registerSuccess(data)),
    loginSuccess : data => dispatch(loginSuccess(data))

})
export default connect(null, mapDispatchToProps)(StartScreen);
