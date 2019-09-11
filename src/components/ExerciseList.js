import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Util from '../utils/Util';
import { Code, Type, CheckCircle, CheckSquare } from 'react-feather';

class ExerciseList extends Component {


    getIcon(type){
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
        const { exercises, selectedId, gradedSubmissions } = this.props;

        const listItems = exercises.map((e, index) => {
            const gradedSub = gradedSubmissions ? gradedSubmissions.find(gs => gs.exerciseId === e.id) : undefined;
            const exerciseResult = gradedSub && gradedSub.result ? gradedSub.result : undefined;

            return (
                <li key={index} className={"h-flex" + (selectedId === e.id ? ' active' : '')}>
                    <Link to={`/exercises/${e.id}`} className="flex-grow-1">
                        <strong>Exercise {index + 1}{!e.isGraded ? ' (Bonus)' : ''}</strong>
                        <br/>
                        <small>{this.getIcon(e.type)} {Util.humanize(e.type)} {(e.type === 'code' || e.type === 'codeSnippet') ? '(' + Util.humanize(e.language) + ')' : ''}</small>
                    </Link>
                    {exerciseResult &&
                        <div><span className="style-btn ghost">Score:  {exerciseResult.score} / {exerciseResult.maxScore}</span></div>
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