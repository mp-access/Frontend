//TODO how is an answer represented/stored/submitted

import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';
// import { StyleSheet, View, TextInput} from 'react-native';

class TextExercise extends Component {

    constructor(props) {
        super(props);
        this.state = {
            question: undefined,
        };
    }

    componentDidMount = async () => {
        const { exercise } = this.props;

        this.setState({
            question: exercise.question,
        });
    };

    render() {
        return (
            <>
                <div className="row">
                    <div className="col-12">
                        <ReactMarkdown source={this.state.question}/>
                    </div>
                <div className="col-12">
                    <form>
                        Answer:
                        <br/>
                        <input type="text" name="answer"/>
                        <br/>
                        <input type="submit" value="Submit"/>
                    </form>
                    {/*<View style={styles.container}>*/}

                    {/*    <TextInput*/}
                    {/*        placeholder="Enter Your Mobile Number"*/}
                    {/*        underlineColorAndroid='transparent'*/}
                    {/*        style={styles.TextInputStyle}*/}
                    {/*        keyboardType={'numeric'}*/}
                    {/*    />*/}

                    {/*</View>*/}
                </div>
                </div>
            </>
        );
    }
}
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//     },
//     headerText: {
//         fontSize: 20,
//         textAlign: "center",
//         margin: 10,
//         fontWeight: "bold"
//     },
//     TextInputStyle: {
//         textAlign: 'center',
//         height: 40,
//         borderRadius: 10,
//         borderWidth: 2,
//         borderColor: '#009688',
//         marginBottom: 10
//     }
// });

export default TextExercise;