import React, { Component } from "react";
import { TextInput, Text, Button, ShadowPropTypesIOS, StyleSheet, View, TouchableOpacity } from "react-native";
import { render } from "react-dom";
import BusMap from './BusMap.js'

export default function BusForm(props) {
    const state = {
        busNumber: ""
    };

    const [value, onChangeText] = React.useState(state.busNumber);

    function submitHandler(event) {
        let url = `https://swapi.co/api/people/${value}`;
        console.log(url);
        return fetch(url)
            .then(response => response.json())
            .then(responseJson => {
                console.log(responseJson.name);
                console.log(`bus number: ${value}`);
                console.log(props.lat);
                console.log(props.long);
                return responseJson.name;
            })
            .catch(error => {
                console.error(error);
            });
    }

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                onChangeText={text => onChangeText(text)}
                value={value}
            />
            <TouchableOpacity
                style={styles.submitButton}
                onPress={() => submitHandler()}>
                <Text style={styles.submitButtonText}> Where's My Bus </Text>
            </TouchableOpacity>
            <BusMap lat={props.lat} long={props.long} />

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        paddingTop: 23,

    },
    input: {
        margin: 15,
        height: 40,
        borderColor: '#7a42f4',
        borderWidth: 1,
        textAlign: 'center',

    },
    submitButton: {
        backgroundColor: '#7a42f4',
        padding: 10,
        margin: 15,
        height: 40,
        width: 150,


    },
    submitButtonText: {
        color: 'white'
    }


});
// when button Submit clicked > call event handler, that will make an API call to back end
// if call was successsful render Details component
// else render error message on the page

// export default BusForm;
