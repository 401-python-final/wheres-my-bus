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
    Dimensions,
    Animated
} from "react-native";
import { render } from "react-dom";
import BusMap from "./BusMap.js";
import Results from "./Results.js";
import TextCarousel from "react-native-text-carousel";

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
        updateBusData({ busNumber: "" });
    }

    function returnHome() {
        setMapDisplay(false);
    }

    let homeButton;
    let button;
    let busmap;
    let results;

    if (mapDisplay) {
        results = (
            <Results
                busNumber={busData.busNumber}
                closest={busState.testData1}
                nextClosest={busState.testData2}
            />
        );
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

                <TextCarousel>
                    <TextCarousel.Item>
                        <View style={styles.carouselContainer}>
                            <Text style={styles.opacityText}>Tap to speak</Text>
                        </View>
                    </TextCarousel.Item>
                    <TextCarousel.Item>
                        <View style={styles.carouselContainer}>
                            <Text style={styles.opacityText}>
                                When does "8" get here?
                            </Text>
                        </View>
                    </TextCarousel.Item>
                </TextCarousel>

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
            {results}
            {busmap}
        </View>
    );
}

const styles = StyleSheet.create({
    opacityText: {
        opacity: 0.2,
        color: "white",
        fontWeight: "bold",
        fontSize: 20
    },

    carouselContainer: {
        margin: 0,
        justifyContent: "center", //Centered vertically
        alignItems: "center",
        paddingBottom: 0
    },
    header: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 20,
        color: "white",
        justifyContent: "center", //Centered vertically
        alignItems: "center", // Centered horizontally,
        fontWeight: "bold",
        fontSize: 47,
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
        borderColor: "#29c7ac",
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
