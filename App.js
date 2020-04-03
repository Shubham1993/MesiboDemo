/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TextInput,
  TouchableOpacity,
  NativeEventEmitter,
  FlatList,
  Dimensions
} from 'react-native';
import RNMesiboDemo from 'react-native-mesibo-demo';
import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import Toast from 'react-native-simple-toast';
const eventEmitter = new NativeEventEmitter(RNMesiboDemo);
const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);
class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      mobileNumber: null,
      connectionStatus: false,
      message: "",
      messages: []
    }
    this.subscription = null;
  }

  componentDidMount() {
    eventEmitter.removeAllListeners('MESSAGE_RECEIVED');
    eventEmitter.removeAllListeners('MESIBO_CONNECTED');
    eventEmitter.removeAllListeners('SENT_MESSAGE_STATUS');

    this.subscription = eventEmitter.addListener('MESSAGE_RECEIVED', this.messageRecieved);
    this.subscription = eventEmitter.addListener('MESIBO_CONNECTED', this.handleMesiboConnection);
    this.subscription = eventEmitter.addListener('SENT_MESSAGE_STATUS', this.handleSentMessage);

  }

  handleMesiboConnection = (data) => {
    console.log("Connection status", data);
    if(data.connectionStatus) { 
      Toast.showWithGravity('User Connected', Toast.SHORT, Toast.TOP);
    }
    this.setState({ connectionStatus: data.connectionStatus })
  }
  

  messageRecieved = (data) => {
    let messages = this.state.messages;
    messages.push(data.message);
    // Toast.showWithGravity(data.message);
    this.setState({ messages: messages });
  }

  login = () => {
    if(this.state.mobileNumber == null || this.state.mobileNumber.trim().length == 0) {
      Toast.show("Please enter correct mobile number");
      return;
    }
    RNMesiboDemo.loginUser(this.state.mobileNumber);
  }

  updateMobile = (value) => {
    this.setState({ mobileNumber: value })
  }

  sendMessage = () => {
    let to = "0";
    if(this.state.mobileNumber == "9783747471") {
      to = "1234567890";
    } else if (this.state.mobileNumber == "1234567890") {
      to = "9783747471";
    }
    RNMesiboDemo.sendTextMessage(to, this.state.message);
    this.setState({ message : "" });
  }

  handleSentMessage = (data) => {
    console.log("Send Message status == ", data);
  }

  renderLoginView = () => {
    return(
      <View>
        <TextInput
        style={styles.mobileNumberField}
        placeholder="Enter your mobile number"
        value={this.state.mobileNumber}
        onChangeText={(value) => {this.updateMobile(value)}}>
        </TextInput>

        <TouchableOpacity 
        onPress={() => this.login()}
        style={{ height: 40, width: 100, backgroundColor: 'blue', justifyContent: "center", alignItems: "center" }}>
          <Text style={{ padding: 5, color: 'white', fontSize: 17 }}>Login</Text>
        </TouchableOpacity> 
      </View>
    )
  }

  renderItem = (item) => {
    console.log("item == ", item);
    return(
      <Text style={{ color: 'black', fontSize: 15, flexWrap: 'wrap', padding: 2, paddingLeft: 15 }}>
        {item}
      </Text>
    )
  }

  renderMessageView = () => {
    return(
      <View style={{ flex: 1 }}>
        <FlatList
          style={{ paddingTop: 15, position: "absolute", top: 0, width: '100%', height: screenHeight - 85, backgroundColor: 'lightgray' }}
          data={this.state.messages}
          renderItem={({item}) => 
            this.renderItem(item)
          }/>
        <View style={{position: "absolute",  bottom: 0, width: '100%', height: 60, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <TextInput
          value={this.state.message}
          onChangeText={(value) => this.setState({ message: value })}
          style={styles.messageTextBox}
          placeholder="Enter message here"/>
          <TouchableOpacity style={styles.sendMessageButton} onPress={() => this.sendMessage()}>
            <Text style={styles.sendMessageText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
      
    )
  }

  render() {
    return (
      <View style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" />
          { this.state.connectionStatus == false ? 
           this.renderLoginView() : this.renderMessageView() }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    height: '100%',
    width: '100%',
    flex: 1
  },
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  mobileNumberField: {
    width: '100%',
    height: 50,
    alignSelf: "center",
    alignContent: "center",
    justifyContent: "center"
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
  sendMessageText: {
    padding: 5,
    color: 'white',
    fontSize: 15
  },
  sendMessageButton: {
    backgroundColor: 'blue',
    borderRadius: 5,
    height: 40,
    width: 70,
    justifyContent: 'center',
    alignItems: "center"
  },
  messageTextBox: {
    backgroundColor: 'lightgray',
    width: '80%',
    paddingLeft: 10,
    marginLeft: 5
  }
});

export default App;
