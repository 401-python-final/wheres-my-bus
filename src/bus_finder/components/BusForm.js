import React, { Component } from "react";
import { TextInput, Text, Button, ShadowPropTypesIOS, StyleSheet, View, TouchableOpacity } from "react-native";
import { render } from "react-dom";
import BusMap from './BusMap.js'

export default function BusForm(props) {

    const busState = {
        busNumber: "",

        closestData: {
            closest_name: null,
            closest_direction: null,
            closest_minutes: null,
            closest_lat: null,
            closest_lon: null,
        },
        nextClosestData: {
            next_closest_name: null,
            next_closest_direction: null,
            next_closest_minutes: null,
            next_closest_lat: null,
            next_closest_lon: null,
        },



    };
    const [mapDisplay, setMapDisplay] = React.useState(false)
    const [busData, updateBusData] = React.useState(busState);

    function submitHandler(event) {
        let url = `http://178.128.6.148:8000/api/v1/${props.lat}/${props.long}/${busData.busNumber}`;
        console.log(url);
        return fetch(url)
            .then(response => {
                console.log(response)
                // do some logic to update state

            })
            .catch(error => {
                console.error(error);
            });
    }

    if (mapDisplay === true) {
        busmap = <BusMap lat={props.lat} long={props.long} closest={busData.closestData} nextClosest={busData.nextClosestData}/>
    } else {
        busmap = <></>
    }

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                onChangeText={text => updateBusData({ busNumber: text })}
                value={busData.busNumber}
            />
            <TouchableOpacity
                style={styles.submitButton}
                onPress={() => submitHandler()}>
                <Text style={styles.submitButtonText}> Where's My Bus </Text>
            </TouchableOpacity>

            {busmap}
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
