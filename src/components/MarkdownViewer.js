import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';
import PropTypes from 'prop-types';

import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneLight as codeBlockStyle } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import CourseDataService from '../utils/CourseDataService';

class MarkdownViewer extends Component {

    state = {
        imagesInMarkdown: {},
    };

    imageRenderer = (props) => {
        if (!!props.src) {
            const isAbsoluteUrl = this.isAbsoluteUrl(props.src);
            if (isAbsoluteUrl) {
                // This is an external link to an image
                return <img src={props.src} alt={props.src}/>;
            }

            // Fetch the image from the backend
            const { imagesInMarkdown } = this.state;

            // If we already fetched the image, use that instead of sending another request
            const cachedSrc = imagesInMarkdown[props.src] || '';
            if (!cachedSrc) {
                this.cacheImageIntoState(props.src);
            }

            return <img src={cachedSrc} alt={props.src}/>;
        }
    };

    cacheImageIntoState = (filename) => {
        const { exerciseId, authHeader } = this.props;
        CourseDataService.getExerciseFileByName(exerciseId, filename, authHeader)
            .then(result => this.setState({
                imagesInMarkdown: {
                    ...this.state.imagesInMarkdown,
                    [filename]: URL.createObjectURL(result),
                },
            }))
            .catch(error => console.error('Error: ', error));
    };

    isAbsoluteUrl = (url) => {
        const pat = /^https?:\/\//i;
        const isAbsolute = pat.test(url);
        debugger;
        return isAbsolute;
    };


    render() {
        const { markdown } = this.props;
        return (
            <ReactMarkdown source={markdown}
                           renderers={{
                               image: this.imageRenderer,
                               code: CodeBlock,
                           }}
            />
        );
    }
}

class CodeBlock extends React.PureComponent {

    render() {
        const { language, value } = this.props;

        return (
            <SyntaxHighlighter language={language} style={codeBlockStyle}>
                {value}
            </SyntaxHighlighter>
        );
    }
}

MarkdownViewer.propTypes = {
    markdown: PropTypes.string.isRequired,
    exerciseId: PropTypes.string.isRequired,
    authHeader: PropTypes.func.isRequired,
};

export default MarkdownViewer;