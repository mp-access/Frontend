import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, CheckCircle, CheckSquare, Code, Lock, Type } from 'react-feather';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import Util from '../utils/Util';

class ExerciseList extends Component {


    getIcon(type) {
        let icon;
        switch (type) {
            case 'code':
            case 'codeSnippet':
                icon = <Code size={12}/>;
                break;
            case 'text':
                icon = <Type size={12}/>;
                break;
            case 'singleChoice':
                icon = <CheckCircle size={12}/>;
                break;
            case 'multipleChoice':
                icon = <CheckSquare size={12}/>;
                break;
            default:
                break;
        }
        return icon;
    }

    render() {
        const { exercises, selectedId, gradedSubmissions, showScore, pastDueDate } = this.props;

        const listItems = exercises.map((exercise) => {

            const gradedSub = gradedSubmissions ? gradedSubmissions.find(gs => gs.exerciseId === exercise.id) : undefined;

            const score = gradedSub && gradedSub.result ? gradedSub.result.score : 0;
            const maxScore = exercise.maxScore ? exercise.maxScore : 1;

            return (
                <li key={exercise.id}
                    className={'h-flex' + (selectedId === exercise.id ? ' active' : '') + (gradedSub || pastDueDate ? '' : ' fresh')}>
                    <Link to={`/exercises/${exercise.id}`} className="flex-grow-1">
                        <span>{'Task ' + (exercise.index)} {pastDueDate ? <Lock size={15}/> : ''}</span>
                        <span>{!exercise.isGraded ? ' (Bonus)' : ''}</span>
                        <h5>{exercise.title}</h5>
                        <div><small>{this.getIcon(exercise.type)} {Util.humanize(exercise.type)}</small>
                            {showScore ? '' : <small style={{ float: 'right' }}>{score} / {maxScore}</small>}</div>
                    </Link>

                    {(gradedSub && gradedSub.invalid) &&
                    <div>
                        <OverlayTrigger
                            placement="top"
                            overlay={
                                <Tooltip id="tooltip-outdated">
                                    This submission is outdated!
                                </Tooltip>
                            }
                        >
                            <span className="style-btn warn"><AlertCircle size={14}/></span>
                        </OverlayTrigger>
                        <span className="p-1"/>
                    </div>
                    }

                    {showScore &&
                    <div className="score-display">
                        <span className="style-btn ghost">Score: {score} / {maxScore}</span>
                    </div>
                    }
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