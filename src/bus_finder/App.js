import React from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import BusForm from './components/BusForm'
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements'



export default class App extends React.Component {
  cosntructor(props){
    super(props)
  }
  
  state = {
    location: null,
    errorMessage: null,
  };

  componentWillMount() {
      this._getLocationAsync();
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location });
  };


  render() {
    let location = 'Waiting..';
    if (this.state.errorMessage) {
      location = this.state.errorMessage;
    } else if (this.state.location) {
      location = JSON.stringify(this.state.location);
    }

    return (
      <View style={styles.container}>
        <BusForm location={this.state.location} />
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    textAlign: 'center',
  },
});
