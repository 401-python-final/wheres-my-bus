import React from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';
// import Constants from 'expo-constants';

// import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements'


export default class Details extends React.Component {
    constructor(props){
      super(props)
    }


    state = {
      location: null,
      errorMessage: null,
    };
