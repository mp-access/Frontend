import React, { Component } from 'react';
import { withAuth } from '../auth/AuthProvider';
import MyCourses from '../components/MyCourses';

class DummyCourses extends Component {

    state = {
        courses: [
            { "title": "Info1", "description": "Informatik 1 Grundkurs.", "owner": "Mike Shiva" },
            { "title": "Info2", "description": "Informatik 2 Vortgeschrittenenkurs.", "owner": "Mike Shiva" }
        ],
    };

    render() {
        const listItems = this.state.courses.map((c) =>
            <li>{c.title} - {c.description} </li>
        );

        return (
            <div className="dddd">
                <p>
                    My Courses:
                </p>
                <ul>
                    {listItems}
                </ul>
            </div>
        );
    }

}

export default withAuth(DummyCourses);