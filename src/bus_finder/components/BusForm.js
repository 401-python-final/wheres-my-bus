import React, { Component } from 'react';
import { TextInput, Button } from 'react-native';
import { render } from 'react-dom';


//  class BusForm extends React.Component{
//     constructor(props){
//         super(props);
//         this.state = {
//             input: ""
//         };
//         this.handleInput = this.handleInput.bind(this);
//     }
//     hadleInput(){
//         this.setState({input: "str"})
//     }

// render() {
//     return (
//         <>
//         <TextInput
//         style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
//         onChangeText={this.hadleInput()}
//         value= {this.state.input}
//         />
//         <Button
//         onPress={() => console.log(value)}
//         title="Submit"
//         />
//         </>
//     );
//     }
// }
export default function BusForm(props) {
    const state = {
        input: ""
    };


  const [value, onChangeText] = React.useState(state.input);
  return (
    <>
    <TextInput
      style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1 }}
      onChangeText={text => onChangeText(text)}
      value={value}
    />
    <Button
    onPress={() => console.log(props.location)}
    title="Submit"
    />
    </>
  );
}



// export default BusForm;


