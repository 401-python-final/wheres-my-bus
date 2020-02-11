import React, { Component } from "react";
import { TextInput, Text, Button, ShadowPropTypesIOS, StyleSheet, View, TouchableOpacity } from "react-native";
import { render } from "react-dom";
import BusMap from './BusMap.js'
import Results from './Results.js'

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

        testData1: {
            closest_name: 1,
            closest_direction: "N",
            closest_minutes: "12 minutes",
            closest_lat: 1,
            closest_lon: 1
        },

        testData2: {
            next_closest_name: 2,
            next_closest_direction: "SE",
            next_closest_minutes: "5 minutes",
            next_closest_lat: 2,
            next_closest_lon: 2
        }



    };
    const [mapDisplay, setMapDisplay] = React.useState(false)
    const [busData, updateBusData] = React.useState(busState);


    function submitHandler(event) {
        let url = `http://178.128.6.148:8000/api/v1/${props.lat}/${props.long}/${busData.busNumber}`;
        console.log(url);
        // return fetch(url)
        //     .then(response => {
        //         console.log(response)
        //         // do some logic to update state

        //     })
        //     .catch(error => {
        //         console.error(error);
        //     });

        setMapDisplay(true)
    }

    function returnHome(){
        setMapDisplay(false)
    }

    let homeButton;
    let button;
    let busmap;
    let results;

    if (mapDisplay) {
        results = <Results busNumber ={busData.busNumber} closest={busState.testData1} nextClosest={busState.testData2}/>
        busmap = <BusMap lat={props.lat} long={props.long} closest={busData.closestData} nextClosest={busData.nextClosestData} />
        button = <></>
        homeButton= <Button title='back' onPress={() => returnHome()} > </Button>
    } else {
        busmap = <></>
        button = <View style={styles.container}>
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

        </View>
    }



    return (
        <View>
            {homeButton}
            {button}
            {results}
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
