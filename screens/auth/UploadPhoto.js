import React, { Component } from 'react';
import { View, Image, StyleSheet, Dimensions,TouchableOpacity, ActivityIndicator } from 'react-native';
import {isIphoneX} from 'react-native-iphone-x-helper';
import { connect } from "react-redux";
import ImagePicker from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import { updateUserState } from "../../actions/AuthActions";
import Text from "../../components/Text";
import LinearGradient from 'react-native-linear-gradient';
import Loading from  "../Loading"
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const { width, height } = Dimensions.get("window");
const iphonex = isIphoneX();

class UploadPhoto extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading : false,
            imageUri : null,
        };
    }
    
    _selectImage = () => {
        const options = {
			title: 'Select Photo',
			noData: true,
			mediaType: "photo",
			allowsEditing: true,
			quality: 0.7
		};
		/**
		 * The first arg is the options object for customization (it can also be null or omitted for default options),
		 * The second arg is the callback which sends object: response (more info in the API Reference)
		 */
        ImagePicker.showImagePicker(options, (response) => {
			if (response.didCancel) {
				console.log('User cancelled image picker');
			} else if (response.error) {
				console.log('ImagePicker Error: ', response.error);
			} else {
                this.setState({imageUri : response.uri});
			}
		});        
    }

    _onImageUpload = () => {
        if(this.state.imageUri == null) return;
        this.setState({loading : true});
        const uri = this.state.imageUri;
        const ext = uri.split(".").pop();
        var reference = `users/${this.props.user.uid}/headshot.${ext}`;
        var ref = storage().ref(reference);
        var task = ref.putFile(uri);
        task.on('state_changed', taskSnapshot => {
            // console.warn(`${taskSnapshot.bytesTransferred} transferred out of ${task.totalBytes}`);
        });
        task.then(async (res) => {
            const downloadURL = await ref.getDownloadURL();
            const { updateUserState } = this.props;
            const photos = [downloadURL, "","","","","",""];
            updateUserState({photos: photos});
            this.setState({loading: false });
            this.props.navigation.navigate("SelectGender");
        });

    }

    render() {
        return (
            <View style={style.bg}>
                <Text style={{color : "#DA1DA2", fontSize: 18, fontFamily: "DMSans-Medium"}}>4 / 7</Text>
                <Image source={require("../../assets/images/Oval.png")} style={{position:"absolute", top :-100, left : -80}} />
                <Image source={require("../../assets/images/Oval1.png")} style={{marginTop : -100, marginLeft : -50}} />
                <View style={style.imageUploaderContainer}>
                    <TouchableOpacity style={style.imageUploaderButton} onPress={this._selectImage}>
                       {!this.state.imageUri && <View style={style.imageUploaderButtonContainer} >
                            <Image source={require("../../assets/images/icons-camera.png")}/>
                            <Text style={{color : "#DA1DA2", fontSize :16}}>Take a Picture</Text>
                        </View> }
                        {this.state.imageUri && <Image source={{uri : this.state.imageUri}} style={{margin:-10,width : 210, height : 250}}/>}
                    </TouchableOpacity>
                    <View style={{marginTop : 20, alignItems:"center"}}>
                        <Text style={{fontSize :18, width : 250, textAlign:"center", marginBottom : 20}}>Take a photo or choose from your library</Text>
                        {/* <Text style={{fontSize : 16, marginBottom : 20}}>Please Wait...</Text>
                        <ActivityIndicator size="large" color="#00ff00" /> */}
                    </View>
                </View>
               
                <View style={{alignItems:"center", position: "absolute", bottom : iphonex?160:80, width :width}}>
                    <TouchableOpacity style={{width : 300}} onPress={this._onImageUpload}>
                        <LinearGradient colors={['#DA1DA2', '#6D0F51']} style={{paddingVertical:15,alignItems:"center",borderRadius : 10}}>
                            <Text style={{fontFamily :"DMSans-Bold", fontSize:18}}>Continue</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
                {this.state.loading && <Loading /> }
            </View>
        );
    }
}

const style= StyleSheet.create({
    bg : {
        width:width,
        height:height,
        backgroundColor :"black",
    },
    imageUploaderContainer : {
        alignItems:"center", 
        position: "absolute", 
        top :100, 
        width :width
    },
    imageUploaderButton:{
        padding : 10, 
        backgroundColor:"white", 
        width:210, 
        height:250, 
        borderRadius : 20, 
        overflow:"hidden"
    },
    imageUploaderButtonContainer : { 
        borderRadius :10, 
        borderWidth : 3, 
        borderColor :"#DA1DA2", 
        height:230, 
        borderStyle:"dashed", 
        justifyContent: 'center', 
        alignItems: 'center'
    }


})

const mapStateToProps = state => ({
    user : state.UserReducer
});

const mapDispatchToProps = dispatch => ({
    updateUserState : data => dispatch(updateUserState(data))
})

export default connect(mapStateToProps,mapDispatchToProps)(UploadPhoto);
