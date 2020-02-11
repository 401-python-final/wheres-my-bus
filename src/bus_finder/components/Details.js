import React from 'react';
import MapView from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions, Platform } from 'react-native';
// import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements'

export default class Details extends React.Component {
    render() {
      return (
        <View style={styles.container}>
          <MapView style={styles.mapStyle} />
        </View>
      );
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    mapStyle: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    },
  });



// export default class Details extends React.Component {
//     constructor(props){
//       super(props)
//     }
// }
