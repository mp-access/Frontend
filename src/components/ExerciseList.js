import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Util from '../utils/Util';

class ExerciseList extends Component {

    render() {
        const { exercises, selectedId } = this.props;

        const listItems = exercises.map((e, index) =>
            <li key={index} className={selectedId === e.id ? 'active' : ''}>
                <Link to={`/exercises/${e.id}`}>
                    <strong>Exercise {index + 1}{!e.isGraded ? ' (Bonus)' : ''}</strong>
                    <br/>
                    <small>{Util.humanize(e.type)} {(e.type === 'code' || e.type === 'codeSnippet') ? '(' + Util.humanize(e.language) + ')' : ''}</small>
                </Link>
            </li>,
        );

        return (
            <ul className="style-list">
                {listItems}
            </ul>
        );
    }

}

export default ExerciseList;