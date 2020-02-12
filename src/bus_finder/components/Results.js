import React from "react";

import { ScrollView, Dimensions } from "react-native";
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
                <ScrollView style={{ flex: 1 }}>
                    <HTML
                        html={htmlContent}
                        imagesMaxWidth={Dimensions.get("window").width}
                    />
                </ScrollView>

                {/* <BusMap lat={props.lat} long={props.long} closest={this.props.closest} nextClosest={this.props.nextClosest}/> */}
            </>
        );
    }
}
