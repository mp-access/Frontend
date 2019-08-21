import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Util from '../utils/Util';

class ExerciseList extends Component {

    render() {
        const { exercises, selectedId, gradedSubmissions } = this.props;

        console.debug(exercises);
        console.debug(gradedSubmissions);
        const listItems = exercises.map((e, index) => {
            const gradedSub = gradedSubmissions ? gradedSubmissions.find(gs => gs.exerciseId === e.id) : undefined;
            const exerciseResult = gradedSub && gradedSub.result ? gradedSub.result : undefined;

            return (
                <li key={index} className={selectedId === e.id ? 'active' : ''}>
                    <Link to={`/exercises/${e.id}`}>
                        <strong>Exercise {index + 1}{!e.isGraded ? ' (Bonus)' : ''}</strong>
                        {exerciseResult &&
                            <button className="style-btn ghost float-right">Score:  {exerciseResult.score} / {exerciseResult.maxScore}</button>
                        }

                        <br/>
                        <small>{Util.humanize(e.type)} {(e.type === 'code' || e.type === 'codeSnippet') ? '(' + Util.humanize(e.language) + ')' : ''}</small>
                    </Link>
                </li>
            );

        });

        return (
            <ul className="style-list">
                {listItems}
            </ul>
        );
    }

}

export default ExerciseList;