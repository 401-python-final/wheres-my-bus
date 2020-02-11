import React, { Component } from "react";
import { TextInput, Button, ShadowPropTypesIOS } from "react-native";
import { render } from "react-dom";
import BusMap from './BusMap.js'

export default function BusForm(props) {
    const state = {
        busNumber: ""
    };

    const [value, onChangeText] = React.useState(state.busNumber);

    function submitHandler(event) {
        let url = `https://swapi.co/api/people/${value}`;
        console.log(url);
        return fetch(url)
            .then(response => response.json())
            .then(responseJson => {
                console.log(responseJson.name);
                console.log(`bus number: ${value}`);
                console.log(props.lat);
                console.log(props.long);
                return responseJson.name;
            })
            .catch(error => {
                console.error(error);
            });
    }

    return (
        <>
            <TextInput
                style={{
                    height: 40,
                    width: 200,
                    borderColor: "gray",
                    borderWidth: 1
                }}
                onChangeText={text => onChangeText(text)}
                value={value}
            />
            <Button onPress={() => submitHandler()} title="Submit" />
            <BusMap lat={props.lat} long={props.long} />
        </>
    );
}
// when button Submit clicked > call event handler, that will make an API call to back end
// if call was successsful render Details component
// else render error message on the page

// export default BusForm;
