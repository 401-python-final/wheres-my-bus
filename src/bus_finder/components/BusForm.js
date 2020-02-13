import React, { Component, Fragment } from "react";
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
    Animated,
    KeyboardAvoidingView
} from "react-native";
import { render } from "react-dom";
import { Audio } from 'expo-av';
import BusMap from "./BusMap.js";
import Results from "./Results.js";
import TextCarousel from "react-native-text-carousel";
import * as Permissions from 'expo-permissions';
import * as FileSystem from 'expo-file-system';
import Ripple from "react-native-material-ripple";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
const { width } = Dimensions.get("screen");
const { height } = Dimensions.get("screen");
const recordingOptions = {
    // android not currently in use, but parameters are required
    android: {
        extension: '.m4a',
        outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
        audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
        sampleRate: 44100,
        numberOfChannels: 2,
        bitRate: 128000,
    },
    ios: {
        extension: '.wav',
        audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
        sampleRate: 44100,
        numberOfChannels: 1,
        bitRate: 128000,
        linearPCMBitDepth: 16,
        linearPCMIsBigEndian: false,
        linearPCMIsFloat: false,
    },
};
export default function BusForm(props) {
    const busState = {
        isRecording: false,
        isFetching: false,
        _recording: new Audio.Recording(),
        query: null,
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
    handleOnPressIn = () => {
        console.log('pressed in')
        startRecording();
    }
    handleOnPressOut = () => {
        console.log('pressed out')
        stopRecording();
        console.log('stopped recording')
        getTranscription();
        console.log('finished getting transcription')
    }
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
        console.log(busData);
    }
    function returnHome() {
        setMapDisplay(false);
    }
    startRecording = async () => {
        const { status } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
        if (status !== 'granted') return;
        busState.isRecording = true;
        console.log('isRecording (should now be true): ', busState.isRecording)
        // some of these are not applicable, but are required
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
          playThroughEarpieceAndroid: true,
        });
        console.log('made it here i suspect')
        // const recording = new Audio.Recording();
        try {
            await busState._recording.prepareToRecordAsync(recordingOptions);
            await busState._recording.startAsync();
            console.log('and here?')
        } catch (error) {
          console.log(error);
          stopRecording();
        }
        // console.log('(from startRecording) the recording: ', recording)
        // busState._recording = recording;
        console.log('should be an object: ', busState._recording)
    }
    stopRecording = async () => {
        busState.isRecording = false;
        console.log('trying to stop recording')
        await busState._recording.stopAndUnloadAsync();
        console.log('audio?: ', busState._recording)
        try {
            // nothing
            console.log('rabbits lair')
        } catch (error) {
            console.log('Dragons Lair $%55')
            // Do nothing -- we are already unloaded.
        }
    }
    getTranscription = async () => {
        busState.isFetching = true;
        try {
          const info = await FileSystem.getInfoAsync(busState._recording.getURI());
          console.log(`FILE INFO: ${JSON.stringify(info)}`);
          const uri = info.uri;
          const formData = new FormData();
          formData.append('file', {
            uri,
            type: 'audio/x-wav',
            // could be anything
            name: 'speech2text'
          });
          const response = await fetch(config.CLOUD_FUNCTION_URL, {
            method: 'POST',
            body: formData
          });
          const data = await response.json();
          busState.query = data.transcript;
        } catch(error) {
          console.log('There was an error', error);
          stopRecording();
          resetRecording();
        }
        busState.isFetching = false;
    }
    deleteRecordingFile = async () => {
        console.log("Deleting file");
        try {
            const info = await FileSystem.getInfoAsync(busState._recording.getURI());
            await FileSystem.deleteAsync(info.uri)
        } catch(error) {
            console.log("There was an error deleting recording file", error);
        }
    }
    resetRecording = () => {
        deleteRecordingFile();
        busState._recording = null;
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
            <Button title="Start Over" onPress={() => returnHome()}></Button>
        );
    } else {
        busmap = <></>;
        button = (
            <Fragment>
                <KeyboardAvoidingView style={{ flex: 1 }} behavior="position">
                    <View style={styles.top}>
                        <View>
                            <Text style={styles.header}>Where's My Bus?</Text>
                        </View>
                    </View>
                    <View style={styles.center}>
                        <TextCarousel>
                            <TextCarousel.Item>
                                <View style={styles.carouselContainer}>
                                    <Text style={styles.opacityText}>
                                        Tap to speak
                                    </Text>
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
                        <Ripple
                            rippleColor="rgb(52, 61, 235)"
                            rippleDuration="2400"
                            // rippleContainerBorderRadius="100" //aj commented this out
                            rippleCentered="true"
                            style={styles.submitButton}
                            // onPress={() => submitHandler()}
                            onPressIn={() => handleOnPressIn()}
                            onPressOut={() => handleOnPressOut()}
                        >
                            <Image
                                style={styles.submitButton}
                                source={require("./button.png")}
                            />
                        </Ripple>
                    </View>
                    <View style={styles.bottom}>
                        <Text style={styles.opacityText2}>
                            Or type your bus number and tap
                        </Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={text => updateBusRoute(text)}
                            value={busRoute}
                        />
                    </View>
                </KeyboardAvoidingView>
            </Fragment>
        );
    }
    return (
        <View style={styles.container}>
            {button}
            {results}
            {busmap}
            {homeButton}
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
    top: {
        height: "25%",
        alignItems: "center",
        justifyContent: "center"
    },
    header: {
        color: "#f7f5f5",
        fontWeight: "bold",
        fontSize: 47
    },
    center: {
        height: "35%",
        alignItems: "center",
        justifyContent: "center"
    },
    bottom: {
        height: "35%", // aj changed this
        alignItems: "center",
        justifyContent: "center"
    },
    container: {
        flex: 1,
        backgroundColor: "#54123B",
        ...StyleSheet.absoluteFillObject
    },
    input: {
        width: width / 2,
        height: 40,
        borderColor: "#29c7ac",
        borderWidth: 3,
        backgroundColor: "#f7f5f5",
        textAlign: 'center', //aj changed this
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