import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, Image, TouchableOpacity, Platform,ImageBackground, SafeAreaView } from 'react-native';
import Text from "../../../components/Text";
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { plansList } from "../../../constants";
import LinearGradient from "react-native-linear-gradient";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import Modal from "react-native-modal";
import { SQIPCore, SQIPCardEntry } from 'react-native-square-in-app-payments';
// import RNPaypal from 'react-native-paypal-lib';
import { connect } from "react-redux";
import api from "../../../utils/axios";
import firestore from "@react-native-firebase/firestore";
import moment from "moment";
import { updateUserState } from "../../../actions/AuthActions";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const { width, height } = Dimensions.get("window");

class PlansScreen extends Component {
    constructor(props) {
        super(props);
        var plans;
        if(this.props.user.plan == "free") plans = plansList;
        else if(this.props.user.plan == "plus") plans = [plansList[1], plansList[2]];
        else if(this.props.user.plan == "gold") plans = [plansList[2]];
        else if(this.props.user.plan == "matchmaker") plans = [plansList[2]];
        this.state = {
            selected: "",
            month: 1,
            price: 0,
            showPaymentOptions: false,
            showSuccessPaymentScreen : false,
            activeSlide : 0,
            plans : plans
        };
        this._carousel = React.createRef();
        this.onStartCardEntry = this.onStartCardEntry.bind(this);
        this.onCardNonceRequestSuccess = this.onCardNonceRequestSuccess.bind(this);
    }

    _onPressItem(item, month, price) {
        this.setState({ selected: item, month: month, price: price, showPaymentOptions: true });

    }

    _closePaymentOptions = () => {
        this.setState({ showPaymentOptions: false })
    }

    // _onSubscriptionPayPal = () => {
    //     RNPaypal.paymentRequest({
    //         clientId: 'AWqP_TNSUO5VHRGUBVR2nF7VYSuHD3VocpPjyZs5aOG_RUjJyzpC4lR3587Iz9U_orNh3X0AhY8xMnhf',
    //         environment: RNPaypal.ENVIRONMENT.SANDBOX,
    //         intent: RNPaypal.INTENT.SALE,
    //         price: this.state.price,
    //         currency: "USD",
    //         description: `Purchase pursue`,
    //         acceptCreditCards: false
    //     }).then(response => {
    //         console.warn(response);
    //         // this.setState({ paymentResult: response });
    //         // this.onSuccessPayment();
    //     }).catch(err => {
    //         console.warn(err.message)
    //     })
    // }

    _onSubscriptionCreditCard = () => {
        this.setState({ showPaymentOptions: false });
        const that = this;
        setTimeout(function(){that.onStartCardEntry()}, 500)
    }

    async componentDidMount() {
        await SQIPCore.setSquareApplicationId('sandbox-sq0idb-7zTFPpJs0YsMJAAht6gkKQ');
        if (Platform.OS === 'ios') {
            await SQIPCardEntry.setIOSCardEntryTheme({
                saveButtonFont: {
                    size: 25,
                    fontFamily: "Montserrat-Bold",
                },
                saveButtonTitle: 'Purchase Now',
                keyboardAppearance: 'Light',
                saveButtonTextColor: {
                    r: 255,
                    g: 0,
                    b: 125,
                    a: 0.5,
                },
            });
        }
    }

    onCardEntryComplete() {
        // Update UI to notify user that the payment flow is completed
    }

    async onCardNonceRequestSuccess(cardDetails) {
        try {
            // take payment with the card details
            // await chargeCard(cardDetails);
            var price = parseFloat(this.state.price) * 100;
            price = price.toFixed(0)
            const paymentData = {
                nonce: cardDetails.nonce,
                price: parseInt(price), // Unit => Cent
                username: this.props.user.fullname,
                user_id: this.props.user.uid,
                email: this.props.user.email,
                package: this.state.selected,
                months: this.state.month
            }
            try {
                const result = await api.post("chargePaymentFromCard", JSON.stringify(paymentData));
                this._onSuccessPayment(paymentData);
            }
            catch (e) {
                console.log(e);
                alert("Sorry, we cann't process your payment now, please try again later!");
            }
            // payment finished successfully
            // you must call this method to close card entry
            await SQIPCardEntry.completeCardEntry(
                this.onCardEntryComplete(),
            );
        } catch (ex) {
            // payment failed to complete due to error
            // notify card entry to show processing error
            await SQIPCardEntry.showCardNonceProcessingError(ex.message);
        }
    }

    onCardEntryCancel() {
        // Handle the cancel callback
    }

    async onStartCardEntry() {
        const cardEntryConfig = {
            collectPostalCode: true,
        };
        await SQIPCardEntry.startCardEntryFlow(
            cardEntryConfig,
            this.onCardNonceRequestSuccess,
            this.onCardEntryCancel,
        );
    }

    _onSuccessPayment = async (payment) => {
        try {
            const res = await firestore().collection("users").doc(this.props.user.uid).update({
                plan: payment.package,
                expireAt: moment().add(payment.months, "month").toDate(),
                subscription_months : payment.months
            });
            const { updateUserState } = this.props;
            updateUserState({ plan: payment.package, expireAt: moment().add(payment.months, "month") });
            this.setState({showSuccessPaymentScreen : true});
        }
        catch (e) {
            console.warn(e)
        }
    }

    _closeSuccessModal = () => {
        this.setState({showSuccessPaymentScreen : false});
        this.props.navigation.navigate("ProfileScren");
    }

    _renderItem = ({ item, index }) => {
        return (
            <View style={style.planContainer} >
                <View style={{ width: 70, height: 70, borderRadius: 35, backgroundColor: "#444444", justifyContent: "center", alignItems: "center", top: -30 }}>
                    <Image source={item.icon} style={{ width: 55, height: 40 }} />
                </View>
                <Text style={style.planTitle}>{item.title}</Text>
                <Text style={style.description}> {item.description}</Text>
                <View style={{ flexDirection: "row", justifyContent: "space-between", width: width - 40 }}>
                    <TouchableOpacity onPress={() => this._onPressItem(item.id, 1, item.prices[1].price)}>
                        <LinearGradient colors={item.colors} style={{ ...style.item, backgroundColor: item.colors[0] }}>
                            <Text style={style.month}>1</Text>
                            <Text>Month</Text>
                            <Text style={style.price}>${item.prices[1].price}</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this._onPressItem(item.id, 3, item.prices[3].price)}>
                        <LinearGradient colors={item.colors} style={{ ...style.item, backgroundColor: item.colors[0] }}>
                            <Text style={{ position: "absolute", top: 5 }}>Save {item.prices[3].save}%</Text>
                            <Text style={style.month}>3</Text>
                            <Text>Months</Text>
                            <Text style={style.price}>${item.prices[3].price}</Text>
                            <Text style={{ position: "absolute", bottom: 10 }}>${item.prices[3].ppm}/mo</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this._onPressItem(item.id, 6, item.prices[6].price)}>
                        <View colors={item.colors} style={{ ...style.item, backgroundColor: "white" }}>
                            <Text style={{ position: "absolute", borderTopLeftRadius: 20, borderTopRightRadius: 20, textAlign: "center", paddingVertical: 5, top: 0, width: "100%", backgroundColor: item.colors[0] }}>Save {item.prices[6].save}%</Text>
                            <Text style={{ ...style.month, color: item.colors[0] }}>6</Text>
                            <Text style={{ color: item.colors[0] }}>Months</Text>
                            <Text style={{ ...style.price, color: item.colors[0] }}>${item.prices[6].price}</Text>
                            <Text style={{ position: "absolute", bottom: 10, color: item.colors[0] }}>${item.prices[6].ppm}/mo</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{ width: width, paddingLeft: 20, height: 140, marginTop: 10, }}>
                    {item.features.map(one => (
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Image source={require("../../../assets/images/icons-checked.png")} style={{ width: 20, height: 25 }} />
                            <Text style={{ marginLeft: 10, fontSize: 16 }}>{one}</Text>
                        </View>
                    ))}
                </View>
                {/* <TouchableOpacity >
                    <LinearGradient colors={item.colors} style={style.getButton}>
                        <Text style={{ fontSize: 20, fontFamily: "DMSans-Medium", textTransform: "uppercase" }}>Get {item.title}</Text>
                    </LinearGradient>
                </TouchableOpacity> */}
            </View>
        );
    }

    get pagination () {
        const { plans, activeSlide } = this.state;
        return (
            <Pagination
              dotsLength={plans.length}
              activeDotIndex={activeSlide}
              containerStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.75)', paddingVertical: 0, marginTop : 10 }}
              dotStyle={{
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  marginHorizontal: 8,
                  backgroundColor: 'rgba(255, 255, 255, 0.92)'
              }}
              inactiveDotStyle={{
                  // Define styles for inactive dots here
              }}
              inactiveDotOpacity={0.4}
              inactiveDotScale={0.6}
            />
        );
    }


    render() {

        return (
            <SafeAreaView style={style.bg}>
                <View style={style.carouselContainer}>
                    <Carousel
                        ref={(c) => { this._carousel = c; }}
                        data={this.state.plans}
                        renderItem={this._renderItem}
                        sliderWidth={width}
                        itemWidth={width}
                        onSnapToItem={(index)=>this.setState({activeSlide: index})}
                    />
                </View>
                {this.pagination}
                <Modal
                    testID={"modal"}
                    isVisible={this.state.showPaymentOptions}
                    backdropColor="#000000"
                    backdropOpacity={0.8}
                    animationInTiming={600}
                    animationOutTiming={400}
                    backdropTransitionInTiming={600}
                    backdropTransitionOutTiming={400}
                    onSwipeComplete={this._closePaymentOptions}
                    swipeDirection={['down']}
                    style={style.view}
                    propagateSwipe={true}
                >
                    <View style={style.content}>
                        <View style={{ width: 50, height: 3, backgroundColor: "grey" }}></View>
                        <View style={{ width: "100%", marginVertical: 20, justifyConent: "center", alignItems: "center" }}>
                            <Text style={{ fontFamily: "DMSans-Medium", fontSize: 24, color: "black" }}>Select Payment Method</Text>
                        </View>
                        <View style={{ paddingHorizontal: 10, width: "100%", justifyContent: "center", alignItems: "center" }}>
                            {/* <TouchableOpacity style={style.paymentMethodButton} onPress={this._onSubscriptionPayPal}>
                                <FontAwesomeIcon name="paypal" size={24} color="darkblue" />
                                <Text style={style.paymentMethodText}>PayPal</Text>
                            </TouchableOpacity> */}
                            <TouchableOpacity style={style.paymentMethodButton} onPress={this._onSubscriptionCreditCard}>
                                <FontAwesomeIcon name="credit-card-alt" size={24} />
                                <Text style={style.paymentMethodText}>Credit Card</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <Modal
                    isVisible={this.state.showSuccessPaymentScreen}
                    backdropColor="#000000"
                    backdropOpacity={0.8}
                    animationIn="zoomInDown"
                    animationOut="zoomOutUp"
                    animationInTiming={600}
                    animationOutTiming={600}
                    backdropTransitionInTiming={600}
                    backdropTransitionOutTiming={600}
                    style={{justifyContent:"center", alignItems:"center"}}
                >
                    <View style={style.successModalContent}>
                        <Image source={require("../../../assets/images/purchase-success-head.png")}/>
                        <ImageBackground 
                            source={require("../../../assets/images/puchars-success-artwork.png")}
                            style={{position:"absolute", top : 25, left : 50, width : 210, height : 210, justifyContent :"center", alignItems:"center"}}
                        >
                            <Image source={{uri : this.props.user.photos[0]}} style={{width : 100, height : 100, borderRadius : 60, marginTop : 35}}/>
                            <Image source={require("../../../assets/images/vip-icon.png")} style={{position:"absolute", bottom : 40, right : 60}} />
                        </ImageBackground>

                        <Text style={{color :"black", marginTop : 100, fontSize : 24}}>Congratulations</Text>
                        <Text style={{color : "#707070"}}>Your purchase successfully.</Text>
                        <TouchableOpacity style={{marginTop :40}} onPress={this._closeSuccessModal}>
                            <LinearGradient colors={["#DA1DA2", "#6D0F51"]} style={{width : 200, paddingVertical : 10, borderRadius : 10, alignItems:"center"}} >
                                <Text style={{fontSize : 22}}>OK</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </SafeAreaView>
        );
    }
}

const style = StyleSheet.create({
    bg: {
        width: width,
        flex: 1,
        backgroundColor: "black",
        justifyContent: "center",
        alignItems: "center", 
        paddingHorizontal : 20
    },
    carouselContainer: { 
        justifyContent: "center", 
        alignItems: "center", 
        height : 510,
    },
    planContainer: {
        marginTop : 30,
        backgroundColor: "#181818",
        borderTopRightRadius: 60,
        borderBottomLeftRadius: 60,
        alignItems: "center", 
        height : 480
    },
    planTitle: {
        fontFamily: "DMSans-Bold",
        fontSize: 36,
        marginTop: -20,
    },
    description: {
        paddingVertical: 5,
        marginBottom: 10,
        height: 70,
        paddingHorizontal: 20
    },
    month: {
        fontFamily: "DMSans-Bold",
        fontSize: 32
    },
    price: {
        fontFamily: "DMSans-Medium",
        fontSize: 18
    },
    getButton: {
        width: width,
        height: 55,
        borderBottomLeftRadius: 50,
        justifyContent: 'center',
        alignItems: "center"
    },
    item: {
        width: width / 3 - 20,
        height: 140,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center"
    },
    content: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        paddingVertical: 20,
        alignItems: 'center',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        height: 260
    },
    contentTitle: {
        fontSize: 20,
        marginBottom: 12,
    },
    view: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    paymentMethodButton: {
        alignItems: "center",
        flexDirection: "row",
        width: "100%",
        backgroundColor: "#F5F9EA",
        paddingVertical: 15,
        borderColor: "#CFE094",
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        marginTop: 10
    },
    paymentMethodText: {
        color: "#17530D",
        marginLeft: 18,
        fontSize: 18,
        fontFamily: "DMSans-Medium"
    },
    successModalContent : {
        width : 302, 
        height : 400,
        backgroundColor : "white",
        borderRadius : 20, 
        alignItems: "center"
    }

})

const mapStateToProps = state => ({
    user: state.UserReducer
})

const mapDispatchToProps = dispatch => ({
    updateUserState: data => dispatch(updateUserState(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(PlansScreen);
