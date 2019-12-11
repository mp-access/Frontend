import React, { Component } from 'react';
import MarkdownViewer from '../MarkdownViewer';
import Util from '../../utils/Util';

class TextExercise extends Component {

    constructor(props) {
        super(props);
        this.state = {
            question: undefined,
            value: '',
        };

        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount = async () => {
        const { exercise, authContext } = this.props;

        authContext.onLogout(() => Util.storeStateInSessionStorage(this.state));

        const exerciseState = Util.loadStateFromSessionStorage();
        if (exerciseState) {
            this.setState({
                ...exerciseState,
            });
            sessionStorage.removeItem('exerciseState');
        } else {
            try {
                this.setState({
                    question: exercise.question,
                    value: this.props.workspace.submission.answer,
                });
            } catch (e) {
                this.setState({
                    question: exercise.question,
                    value: '',
                });
            }
        }
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        try {
            if (prevProps.workspace !== this.props.workspace) {
                this.setState({ value: this.props.workspace.submission.answer });
            }
        } catch (e) {
            console.error(e);
        }
    }

    handleChange(event) {
        this.props.setIsDirty(true);

        this.setState({ value: event.target.value });
    }

    getPublicFiles = () => {
        let type = 'text';
        return {
            type: type,
            value: this.state.value,
        };
    };

    render() {
        const { workspace, authorizationHeader } = this.props;

        return (
            <>
                <div className="clearfix"/>
                <div className="row">
                    <div className="col-12">
                        <MarkdownViewer
                            markdown={workspace.question}
                            exerciseId={workspace.exerciseId}
                            authHeader={authorizationHeader}/>
                    </div>
                    <div className="col-12">
                        <label>
                            Answer:
                            <br/>
                            <input type="text" value={this.state.value}
                                   onChange={this.handleChange}/>
                        </label>
                    </div>
                </div>
            </>
        );
    }
}

export default TextExercise;