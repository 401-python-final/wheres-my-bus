import React from "react";
import MapView from "react-native-maps";
import { StyleSheet, Text, View, Dimensions, Platform } from "react-native";
// import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements'

export default function Details(props) {
    return (
        <View style={styles.container}>
            <MapView
                style={styles.mapStyle}
                initialRegion={{
                    latitude: props.lat,
                    longitude: props.long,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center"
    },
    mapStyle: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height
    }
});

// export default class Details extends React.Component {
//     constructor(props){
//       super(props)
//     }
// }
