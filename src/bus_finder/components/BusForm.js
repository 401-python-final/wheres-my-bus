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
import BusMap from "./BusMap.js";
import Results from "./Results.js";
import TextCarousel from "react-native-text-carousel";
import Ripple from "react-native-material-ripple";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Audio } from 'expo-av';
import * as Permissions from 'expo-permissions';

import { Sound } from "expo-av/build/Audio";
// import Voice from "react-native-voice";

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

export default class BusForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            busRoute: '',
            mapDisplay: false,
            isRecording: false,
            isFetching: false,
            _recording: null,
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
        this.submitHandler = this.submitHandler.bind(this)
        this.returnHome = this.returnHome.bind(this)
        this.handleOnPressIn = this.handleOnPressIn.bind(this)
        this.handleOnPressOut = this.handleOnPressOut.bind(this)
        this.startRecording = this.startRecording.bind(this)
        this.stopRecording = this.stopRecording.bind(this)
        this.resetRecording = this.resetRecording.bind(this)
        this.deleteRecordingFile = this.deleteRecordingFile.bind(this)
        this.getTranscription = this.getTranscription.bind(this)

        // this._startRecognition = this._startRecognition.bind(this)
        // this.componentDidMount = this.componentDidMount.bind(this)
        // Voice.onSpeechStart = this.onSpeechStart.bind(this)
        // Voice.onSpeechRecognized = this.onSpeechRecognized.bind(this)
        // Voice.onSpeechResults = this.onSpeechResults.bind(this)
    };

    // componentWillUnmount() {
    //     // Voice.destroy().then(Voice.removeAllListeners);
    // }
    // onSpeechStart(e) {
    //     this.setState({
    //       started: '√',
    //     });
    // }
    // onSpeechRecognized(e) {
    //     this.setState({
    //       recognized: '√',
    //     });
    // }
    // onSpeechResults(e) {
    //     this.setState({
    //       results: e.value,
    //     });
    // }
    // async _startRecognition(e) {
    //     console.log('pressed voice button')
    //     this.setState({
    //       recognized: '',
    //       started: '',
    //       results: [],
    //     });
    //     try {
    //     //   await Voice.start('en-US');
    //     } catch (e) {
    //       console.error(e);
    //     }
    // }

    async handleOnPressIn() {
        console.log('pressed in')
        await this.startRecording();
    }

    async handleOnPressOut() {
        console.log('pressed out')
        await this.stopRecording();
        await this.getTranscription();
    }

    async startRecording() {
        const { status } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
        if (status !== 'granted') return;
        this.setState({isRecording:true, _recording: new Audio.Recording()})

        // some of these are not applicable, but are required
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
          playThroughEarpieceAndroid: true,

        });

        try {
            await this.state._recording.prepareToRecordAsync(recordingOptions);
            await this.state._recording.startAsync();
        } catch (error) {
          console.log(error);
          this.stopRecording();
        }
        console.log('should be an object: ', this.state._recording)
    }

    async stopRecording() {
        this.setState({isRecording: false})
        await this.state._recording.stopAndUnloadAsync();
        // try {
        //     // nothing
        //     console.log('rabbits lair')
        // } catch (error) {
        //     console.log('Dragons Lair $%55')
        //     // Do nothing -- we are already unloaded.
        // }
    }

    async deleteRecordingFile() {
        console.log("Deleting file");
        try {
            const info = await FileSystem.getInfoAsync(this.state._recording.getURI());
            await FileSystem.deleteAsync(info.uri)
        } catch(error) {
            console.log("There was an error deleting recording file", error);
        }
    }

    resetRecording() {
        this.deleteRecordingFile();
        this.state._recording = null;
    }

    async submitHandler() {
        console.log('pressed form button')

        const url = `http://178.128.6.148:8000/api/v1/${this.props.lat}/${this.props.long}/${this.state.busRoute}`;
        console.log(url);

        const response = await fetch(url);
        const json = await response.json();

        this.setState({
            closestData: {
                closestName: json.closest_stop.closest_name,
                closestDirection: json.closest_stop.closest_direction,
                closestMinutes: json.closest_stop.closest_minutes,
                closestLat: json.closest_stop.closest_lat,
                closestLon: json.closest_stop.closest_lon
            },
            nextClosestData: {
                nextClosestName: json.next_closest_stop.next_closest_name,
                nextClosestDirection:
                    json.next_closest_stop.next_closest_direction,
                nextClosestMinutes: json.next_closest_stop.next_closest_minutes,
                nextClosestLat: json.next_closest_stop.next_closest_lat,
                nextClosestLon: json.next_closest_stop.next_closest_lon
            },
            mapDisplay: true
        });
        console.log('closest data: ', this.state.closestData)
        console.log('nextClosest data: ', this.state.nextClosestData)
    }

    async getTranscription() {
        this.setState({isFetching: true})

        try {

            const uri = this.state._recording.getURI();
            console.log('here is the uri: ', uri);

            // const sound = new Sound(uri, Sound.MAIN_BUNDLE, (error) => {

            //     // console.log('making a sound========')
            //     if (error) {
            //         // console.log('failed to make a sound======')
            //         console.log('failed to load the sound', error);
            //     } else {
            //         // console.log('we made a new Sound!: =========')
            //         // sound.play(); // have to put the call to play() in the onload callback
            //     }
            // });
            // console.log('did we make a sound?:======', sound)
            // const slicedUri = uri.slice(7);
            // console.log('slicedUri', slicedUri);

            // const response = await fetch(uri);
            // console.log('response: ', JSON.stringify(response))
            // theFile = JSON.stringify(response)

            let wav = new FormData();
            wav.append('file', { uri: uri });

            const res = await fetch(`http://178.128.6.148:8000/api/v1/${this.props.lat}/${this.props.long}`, {
                method: 'POST',
                body: wav
            })
            console.log('response? ', res)
            console.log('response? ', JSON.stringify(res))
            // fetch(uri).then((response) => {
            //     console.log('response: ', response.json())
            //     console.log('made it here???xxxx')
            // });
            console.log('made it here???')
            // const fetchdURI = await fetch(uri);
            // console.log('fetchdURI: ', fetchdURI);

        } catch(error) {
          console.log('There was an error', error);
          this.stopRecording();
          this.resetRecording();
        }
        this.setState({isFetching: false})
    }

    returnHome() {
        this.setState({
            mapDisplay: false,
        })
    }

    render(){
        let homeButton;
        let button;
        let busmap;
        let results;

        if(this.state.mapDisplay){
            results = (
                <Results
                    busNumber={this.state.busRoute}
                    closest={this.state.closestData}
                    nextClosest={this.state.nextClosestData}
                />
            );
            busmap = (
                <BusMap
                    lat={this.props.lat}
                    long={this.props.long}
                    closest={this.state.closestData}
                    nextClosest={this.state.nextClosestData}
                />
            );
            button = <></>;
            // homeButton = (
            //     <Button title="Start Over" onPress={this.setState({mapDisplay: false})}></Button>
            // );
        } else {
            busmap = <></>;
            button = (
                <Fragment>
                    <KeyboardAvoidingView style={{ flex: 1 }} behavior="position">
                        <View style={this.styles.top}>
                            <View>
                                <Text style={this.styles.header}>Where's My Bus?</Text>
                            </View>
                        </View>

                        <View style={this.styles.center}>
                            <TextCarousel>
                                <TextCarousel.Item>
                                    <View style={this.styles.carouselContainer}>
                                        <Text style={this.styles.opacityText}>
                                            Tap to speak
                                        </Text>
                                    </View>
                                </TextCarousel.Item>
                                <TextCarousel.Item>
                                    <View style={this.styles.carouselContainer}>
                                        <Text style={this.styles.opacityText}>
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
                                style={this.styles.submitButton}
                                // onPress={() => this._startRecognition()}
                                onPressIn={() => this.handleOnPressIn()}
                                onPressOut={() => this.handleOnPressOut()}
                            >
                                <Image
                                    style={this.styles.submitButton}
                                    source={require("./button.png")}
                                />
                            </Ripple>
                        </View>
                        <View style={this.styles.bottom}>
                            <Text style={this.styles.opacityText2}>
                                Or type your bus number and tap
                            </Text>
                            <TextInput
                                style={this.styles.input}
                                onChangeText={text => this.setState({busRoute: text})}
                                value={this.state.busRoute}
                            />
                            <Button onPress={() => this.submitHandler()} title="Search"></Button>
                        </View>
                    </KeyboardAvoidingView>
                </Fragment>
            );
        }
        return (
            <View style={this.styles.container}>
                {button}
                {results}
                {busmap}
                {homeButton}
            </View>
        );
    }

    styles = StyleSheet.create({
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
}

// when button Submit clicked > call event handler, that will make an API call to back end
// if call was successsful render Details component
// else render error message on the page

// export default BusForm;
