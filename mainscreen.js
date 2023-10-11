import React, {Component} from 'react';
import { StyleSheet, View, Text, TouchableOpacity, } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { connect } from 'react-redux';
import init from 'react_native_mqtt';
import { ActivityIndicator } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Modal from "react-native-modal";
//bổ sung
import AsyncStorage from '@react-native-async-storage/async-storage';
import Router from '../Router';
//import Navigation from '../Navigation';

init({
  size: 10000,
  storageBackend: AsyncStorage,
  defaultExpires: 1000 * 3600 * 24,
  enableCache: true,
  //reconnect: true,
  sync : {
  }
});


//const client = new Paho.MQTT.Client('service.tptechs.vn', 3000 , "");  
  //  client.connect({onSuccess:onConnect, userName: "iot_tptechs", password: "Tptechs@1234" , reconnect: true});
  const client = new Paho.MQTT.Client('13.212.27.168', 3000, ""); 
  client.connect({onSuccess:onConnect, reconnect: true});
    function onConnect() {
      client.subscribe("tp/MQTT",{qos: 1});
      client.publish("tp/MQTT", "Connect", 0)
    }

class MainScreen extends Component{

  componentWillMount() {
      this.props.changeTitle();
      this.props.changeClient();       
  }


  MessMQTT = () => {  
      if(this.props.Title === 'Main'){
          this.props.Client.onMessageArrived = (message) => {
              switch(message.destinationName){
                  case "tp/MQTT":
                      this.props.changeMQTTMODAL(false);
                      //alert("Connected!")
                  break;
              }
          }
      }

      this.props.Client.onConnectionLost = (responseObject) => {
          if (responseObject.errorCode !== 0) {           
            this.props.changeMQTTMODAL(true);
          }
      }
  }

  render() {

    {this.MessMQTT()}

    return (
        <PaperProvider >
          <Router ref={navigatorRef => { Navigation.setTopLevelNavigator(navigatorRef); }} />

          {/* <Modal
                isVisible={this.props.isMQTTVisible}
                backdropColor={"black"}
                animationIn="zoomInDown"
                animationOut="zoomOutUp"
                animationInTiming={1000}
                animationOutTiming={1000}
                backdropTransitionInTiming={1000}
                backdropTransitionOutTiming={1000}>

              <TouchableOpacity style={styles.modalStyle} >
                <View style={{marginTop: hp('2%')}}>
                  <ActivityIndicator style={styles.horizontal} size={0} color="#ff9933" />
                </View>
                <Text style = {styles.modalText }>
                  Connecting...
                </Text>
              </TouchableOpacity>
            </Modal> */}

        </PaperProvider>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
    return {
      Client: state.Client,
      Title: state.Title,
      MQTTConnect: state.MQTTConnect,
      BSSID: state.BSSID,
      isMQTTVisible: state.isMQTTVisible
    }
  }
  
  const mapDispatchToProps = (dispatch, ownProps) => {
    return {
    changeTitle: () => {
        dispatch({
            type: "CHANGE_TITLE",
            Title: 'Main'
        })
    },
    changeClient: () => {
        dispatch({
        type: "CHANGE_CLIENT",
        Client: client
        })
    },
    changeMQTTMODAL: (Status) => {
        dispatch({
        type: "CHANGE_MQTTMODAL",
        isMQTTVisible: Status
        })
    },
    }
  }

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundContainer: {
    flex: 1,
    width: null,
    height: null,
  },
  modalStyle:{
    paddingVertical: wp('5%'),
    paddingHorizontal: wp('5%'),
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderColor:'black',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },  
  modalText:{
    fontWeight: 'bold',
    fontSize: 19, 
    color: 'black',
    textAlign: 'center',
    textAlignVertical: "center",
    padding: hp('3%'),
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10
  }
})
