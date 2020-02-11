import React from "react";

import { ScrollView, Dimensions } from 'react-native';
import HTML from 'react-native-render-html';



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
    };

    render() {
        const htmlContent = `
        <h2>Route Number: ${this.props.busNumber}</h2>
        <h3>Waiting Time for ${this.props.closest.closest_direction} Direction: ${this.props.closest.closest_minutes}</h3>
        <h3>Waiting Time for ${this.props.nextClosest.next_closest_direction} Direction: ${this.props.nextClosest.next_closest_minutes}</h3>
        `

        return (
            <>
                <ScrollView style={{ flex: 1 }}>
                    <HTML html={htmlContent} imagesMaxWidth={Dimensions.get('window').width} />
                </ScrollView>

                {/* <BusMap lat={props.lat} long={props.long} closest={this.props.closest} nextClosest={this.props.nextClosest}/> */}
            </>

        )
    }
}
