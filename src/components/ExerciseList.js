import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class ExerciseList extends Component {

    render() {
        const {exercises} = this.props;

        const listItems = exercises.map((e, index) =>
            <Link to={`/exercises/${e.id}`} key={e.id}>
                <li className="list-group-item"> 
                    <p className="h6">Exercise {index + 1} - TITLE
                    <br />
                    <small>{e.type} {(e.type === 'code' || e.type === 'codeSnippet' ) ? '(' + e.language + ')' : '' }</small>
                </p></li>
            </Link>
        );

        return (
            <ul className="list-group">
                {listItems}
            </ul>
        );
    }

}

export default ExerciseList;