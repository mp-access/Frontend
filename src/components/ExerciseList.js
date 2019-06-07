import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class ExerciseList extends Component {

    render() {
        const {exercises} = this.props;

        const listItems = exercises.map((e) =>
            <Link to={`/exercises/${e.id}`}>
                <li className="list-group-item"> <p className="h6">{e.id} - {e.type} / {e.language} </p></li>
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