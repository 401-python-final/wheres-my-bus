import React, { Component } from "react";
import {
    TextInput,
    Text,
    Button,
    ShadowPropTypesIOS,
    StyleSheet,
    View,
    TouchableOpacity,
    Image,
    Dimensions
} from "react-native";
import { render } from "react-dom";
import BusMap from "./BusMap.js";
const { width } = Dimensions.get("screen");

export default function BusForm(props) {
    const busState = {
        busNumber: "",

        closestData: {
            closest_name: null,
            closest_direction: null,
            closest_minutes: null,
            closest_lat: null,
            closest_lon: null
        },
        nextClosestData: {
            next_closest_name: null,
            next_closest_direction: null,
            next_closest_minutes: null,
            next_closest_lat: null,
            next_closest_lon: null
        }
    };
    const [mapDisplay, setMapDisplay] = React.useState(false);
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

        setMapDisplay(true);
    }

    function returnHome() {
        setMapDisplay(false);
    }

    let homeButton;
    let button;
    let busmap;

    if (mapDisplay) {
        busmap = (
            <BusMap
                lat={props.lat}
                long={props.long}
                closest={busData.closestData}
                nextClosest={busData.nextClosestData}
            />
        );
        button = <></>;
        homeButton = (
            <Button title="back" onPress={() => returnHome()}>
                {" "}
            </Button>
        );
    } else {
        busmap = <></>;
        button = (
            <View style={styles.container}>
                <Text style={styles.header}>Where's My Bus?</Text>
                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={() => submitHandler()}
                >
                    <Image
                        style={styles.submitButton}
                        source={require("./button.png")}
                    />
                </TouchableOpacity>
                <TextInput
                    style={styles.input}
                    onChangeText={text => updateBusData({ busNumber: text })}
                    value={busData.busNumber}
                />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {homeButton}
            {button}
            {busmap}
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        color: "white",
        justifyContent: "center", //Centered vertically
        alignItems: "center", // Centered horizontally,
        fontWeight: "bold",
        fontSize: 50,
        paddingBottom: 70
    },
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "#54123B",
        paddingTop: 40,
        ...StyleSheet.absoluteFillObject
    },
    input: {
        width: width / 2,
        margin: 80,
        height: 40,
        borderColor: "#7A42F4",
        borderWidth: 1,
        textAlign: "center"
    },
    submitButton: {
        alignItems: "center",
        padding: 10,
        width: width / 1.5,
        height: width / 1.5
    },
    submitButtonText: {
        color: "white"
    }
});
// when button Submit clicked > call event handler, that will make an API call to back end
// if call was successsful render Details component
// else render error message on the page

// export default BusForm;
