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
const { height } = Dimensions.get("screen");

export default function BusForm(props) {
    const busState = {
        closestData: {
            closestName: null,
            closestDirection: null,
            closestMinutes: null,
            closestLat: null,
            closestLon: null
        },
        nextClosestData: {
            nextClosestName: null,
            nextClosestDirection: null,
            nextClosestMinutes: null,
            nextClosestLat: null,
            nextClosestLon: null
        }
    };
    const [mapDisplay, setMapDisplay] = React.useState(false);
    const [busRoute, updateBusRoute] = React.useState("");
    const [busData, updateBusData] = React.useState(busState);

    async function submitHandler() {
        let url = `http://178.128.6.148:8000/api/v1/${props.lat}/${props.long}/${busRoute}`;
        console.log(url);

        const response = await fetch(url);
        const data = await response.json();

        // updateBusRoute("")
        updateBusData({
            closestData: {
                closestName: data.closest_stop.closest_name,
                closestDirection: data.closest_stop.closest_direction,
                closestMinutes: data.closest_stop.closest_minutes,
                closestLat: data.closest_stop.closest_lat,
                closestLon: data.closest_stop.closest_lon
            },

            nextClosestData: {
                nextClosestName: data.next_closest_stop.next_closest_name,
                nextClosestDirection:
                    data.next_closest_stop.next_closest_direction,
                nextClosestMinutes: data.next_closest_stop.next_closest_minutes,
                nextClosestLat: data.next_closest_stop.next_closest_lat,
                nextClosestLon: data.next_closest_stop.next_closest_lon
            }
        });
        setMapDisplay(true);
    }
    console.log(busData);

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
                busNumber={busRoute}
                closest={busData.closestData}
                nextClosest={busData.nextClosestData}
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
                <Text style={styles.opacityText2}>
                    Or type your bus number and tap
                </Text>

                <TextInput
                    style={styles.input}
                    onChangeText={text => updateBusRoute(text)}
                    value={busRoute}
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
    opacityText2: {
        opacity: 0.2,
        color: "white",
        fontWeight: "bold",
        fontSize: 20,
        margin: 50,
        marginBottom: 25,
        justifyContent: "space-between", //Centered vertically
        alignItems: "center"
    },
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
        color: "#f7f5f5",
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
        ...StyleSheet.absoluteFillObject,
        width: width,
        height: height
    },
    input: {
        width: width / 2,
        margin: 0,
        height: 40,
        borderColor: "#29c7ac",
        borderWidth: 3,
        textAlign: "center",
        backgroundColor: "#f7f5f5"
    },
    submitButton: {
        alignItems: "center",
        padding: 10,
        width: width / 1.5,
        height: width / 1.5
    }
});
// when button Submit clicked > call event handler, that will make an API call to back end
// if call was successsful render Details component
// else render error message on the page

// export default BusForm;
