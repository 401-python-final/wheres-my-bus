import React from "react";
import { Platform, Text, View, StyleSheet } from "react-native";
import Constants from "expo-constants";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import BusForm from "./components/BusForm";
import BusMap from "./components/BusMap";
import {
    FormLabel,
    FormInput,
    FormValidationMessage
} from "react-native-elements";

export default class App extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        location: null,
        lat: 47.6062,
        long: -122.3321,
        errorMessage: null,
        busCoords: []
    };

    componentDidMount() {
        this._getLocationAsync();
    }

    _getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== "granted") {
            this.setState({
                errorMessage: "Permission to access location was denied"
            });
        }

        let location = await Location.getCurrentPositionAsync({});

        this.setState({ location });
        this.setState({ lat: location.coords.latitude });
        this.setState({ long: location.coords.longitude });
    };

    render() {
        let location = "Waiting..";
        if (this.state.errorMessage) {
            location = this.state.errorMessage;
        } else if (this.state.location) {
            location = JSON.stringify(this.state.location);
        }

        return (
            <View style={styles.container}>
                <BusForm
                    lat={this.state.lat}
                    long={this.state.long}
                    busCoords={this.state.busCoords}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingTop: Constants.statusBarHeight,
        backgroundColor: "#ecf0f1"
    },
    paragraph: {
        margin: 24,
        fontSize: 18,
        textAlign: "center"
    }
});

console.disableYellowBox = true;
