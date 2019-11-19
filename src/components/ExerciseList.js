import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {AlertCircle, CheckCircle, CheckSquare, Code, Type, Lock} from 'react-feather';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import Util from '../utils/Util';

class ExerciseList extends Component {


    getIcon(type) {
        let icon;
        switch (type) {
            case "code":
            case "codeSnippet":
                icon = <Code size={12}/>
                break;
            case "text":
                icon = <Type size={12}/>
                break;
            case "singleChoice":
                icon = <CheckCircle size={12}/>
                break;
            case "multipleChoice":
                icon = <CheckSquare size={12}/>
                break;
            default:
                break;
        }
        return icon;
    }

    render() {
        const {exercises, selectedId, gradedSubmissions, showScore, pastDueDate} = this.props;

        const listItems = exercises.map((e, index) => {

            const gradedSub = gradedSubmissions ? gradedSubmissions.find(gs => gs.exerciseId === e.id) : undefined;

            const score = gradedSub && gradedSub.result ? gradedSub.result.score : 0;
            const maxScore = e.maxScore ? e.maxScore : 1;

            return (
                <li key={index}
                    className={"h-flex" + (selectedId === e.id ? ' active' : '') + (gradedSub || pastDueDate ? '' : ' fresh')}>
                    <Link to={`/exercises/${e.id}`} className="flex-grow-1">
                        <span>{'Task ' + (index + 1)} {pastDueDate ? <Lock size={15}/> : ''}</span>
                        <span>{!e.isGraded ? ' (Bonus)' : ''}</span>
                        <h5>{e.title}</h5>
                        <div><small>{this.getIcon(e.type)} {Util.humanize(e.type)}</small>
                            {showScore ? '' : <small  style={{float: "right"}}>{score} / {maxScore}</small>}</div>
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
                        <span className="p-1"></span>
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