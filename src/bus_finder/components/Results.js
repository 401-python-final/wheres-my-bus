import React from "react";

import { ScrollView, Dimensions, Text, View, StyleSheet } from "react-native";
import HTML from "react-native-render-html";

// export default class Results extends React.Component {
//     render() {
//         return (
//             <ScrollView style={{ flex: 1 }}>
//                 <HTML html={htmlContent} imagesMaxWidth={Dimensions.get('window').width} />
//             </ScrollView>
//         );
//     }
// }
export default class Results extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const htmlContent = `
        <h2>Route Number: ${this.props.busNumber}</h2>
        <h3>Bus will come to the ${this.props.closest.closestName} [${this.props.closest.closestDirection} direction] bus stop in ${this.props.closest.closestMinutes} minutes</h3>
        <h3>Bus will come to the ${this.props.nextClosest.nextClosestName} [${this.props.nextClosest.nextClosestDirection} direction] bus stop in ${this.props.nextClosest.nextClosestMinutes} minutes</h3>
        `

        return (
            <>
                <View style={styles.top}>
                    <View>
                        <Text style={styles.header}>
                            Your Route Number is: {this.props.busNumber}
                        </Text>
                        <Text style={styles.header}>
                            The Waiting time for
                            {this.props.closest.closestDirection} Direction:
                            {this.props.closest.closestMinutes}
                        </Text>
                        <Text style={styles.header}>
                            The Waiting time for
                            {this.props.nextClosest.nextClosestDirection}
                            Direction:
                            {this.props.nextClosest.nextClosestMinutes}
                        </Text>
                    </View>
                    {/* <BusMap lat={props.lat} long={props.long} closest={this.props.closest} nextClosest={this.props.nextClosest}/> */}
                </View>
            </>
        );
    }
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
        height: "30%",
        alignItems: "center",
        justifyContent: "center"
    },
    header: {
        color: "#f7f5f5",
        fontWeight: "bold",
        fontSize: 20
    },

    center: {
        height: "35%",
        alignItems: "center",
        justifyContent: "center"
    },

    bottom: {
        height: "25%",
        alignItems: "center",
        justifyContent: "center"
    },

    container: {
        flex: 1,
        backgroundColor: "#54123B",
        ...StyleSheet.absoluteFillObject
    }
});
