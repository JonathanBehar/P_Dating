import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Platform, Dimensions} from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome5";
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from "moment"
class DatePicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: props.value?props.value:new Date(),
            show: false
        };
    }

    _onChange = (event, date) => {
        // console.log(date)
        if(Platform.OS == "android") {
            if(event.type == "set"){
                this.setState({date : date, show : false});
                this.props.onChangeDate(date);
            }
            else{ 
                this.setState({show:false});
            }
        }
        else{
            this.setState({date : date});
            this.props.onChangeDate(date);
        }
        
    } 

    render() {
        const { dark } = this.props;
        const defaultContainerStyle = { justifyContent: 'center', paddingHorizontal: 20, marginTop: 10, borderRadius: 10, height: 50, width: 350, backgroundColor: dark ? "#70707022" : "rgba(255,255,255,0.25)" }
        const defaultTextStyle = { fontSize: 18, color: this.state.date == "" ? "#C9C9C9" : "white" }
        return (
            <>
                <TouchableOpacity style={{ ...defaultContainerStyle, ...this.props.style }} onPress={()=>this.setState({show : true})}>
                    <Text style={defaultTextStyle}>{this.state.date == "" ? this.props.placeholder : moment(this.state.date).format("MMM DD, YYYY")}</Text>
                    <Icon name="calendar-alt" size={28} color="white" style={{ position: "absolute", right: 20 }} />
                </TouchableOpacity>
                {this.state.show && (
                    <DateTimePicker
                        style={{width:"100%"}}
                        textColor="white"
                        testID="dateTimePicker"
                        value={this.state.date}
                        mode={"date"}
                        is24Hour={true}
                        display="default"
                        onChange={this._onChange}
                    />
                )}
            </>
        );
    }
}

export default DatePicker;
