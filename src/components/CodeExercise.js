import React, { Component } from 'react';
import MonacoEditor from 'react-monaco-editor';
import ReactMarkdown from 'react-markdown';

class CodeExercise extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedFile: undefined,
            workspace: [],
        };
    }

    componentDidMount() {
        console.debug(this.props.exercise);

        this.setState({
            selectedFile: this.props.exercise.public_files[0],
            workspace: this.props.exercise.public_files,
        });
    }

    select(file) {
        console.debug('select', file);
        this.setState({ selectedFile: file });
    }

    submitButtonClick() {
        console.log('Submit Button pressed');

        fetch('http://localhost:8080/api/submissions/3', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'type': 'code',
                'details': {
                    'graded': 'true',
                    'publicFiles': [
                        {
                            'path': '/script.py',
                            'name': 'script',
                            'extension': 'py',
                            'content': 'if _name_ == \'_main\':\n    p1 = UniPerson("Hans Muster")\n    assert p1.str() == "Name: Hans Muster"\n\n    p1.receive_email("Email 1")\n    p1.receive_email("Email 2")\n    assert p1.read_emails() == ["Email 1", "Email 2"]\n    assert p1.read_emails() == []  # Because inbox was emptied after reading the first time\n\n    s1 = Student("Student 1", 2017, False, 40)\n    assert "Student 1" in s1.str()\n    assert "2017-00000" in s1.str()\n    assert "False" in s1.str()\n    assert "40" in s1.str()\n\n    s2 = Student("Student 2", 2017, True, 120)\n    assert "Student 2" in s2.str()\n    assert "2017-00001" in s2.str()\n    assert "True" in s2.str()\n    assert "120" in s2.str()\n\n    s3 = Student("Student 3", 2016, True, 180)\n    assert "Student 3" in s3.str()\n    assert "2016-00000" in s3.str()\n    assert "True" in s3.str()\n    assert "180" in s3.str_()\n\n    mgmt = UniManagement()\n\n    lecturer = Lecturer("Prof. Dr. Harald Gall", "Informatik 1")\n\n    mgmt.add_person(s1)\n    mgmt.add_person(s2)\n    mgmt.add_person(s3)\n    mgmt.add_person(lecturer)\n\n    assert mgmt.count_alumni() == 2\n\n    mgmt.send_email("This test email is sent to all university persons.")\n    assert s1.read_emails() == ["This test email is sent to all university persons."]\n    assert s2.read_emails() == ["This test email is sent to all university persons."]\n    assert s3.read_emails() == ["This test email is sent to all university persons."]\n    assert lecturer.read_emails() == ["This test email is sent to all university persons."]\n',
                        },
                        {
                            'path': '/testsuite.py',
                            'name': 'testsuite',
                            'extension': 'py',
                            'content': 'from unittest import TestCase\n\nfrom task_2 import UniPerson, Student, Lecturer, UniManagement\n\n\nclass Task2Test(TestCase):\n\n    def setUp(self):\n        self.person1 = UniPerson("Person1")\n\n        self.student1 = Student("Student1", 2000, True, 120)\n        self.student2 = Student("Student2", 2000, False, 119)\n        self.student3 = Student("Student3", 2001, True, 180)\n\n        self.lecturer1 = Lecturer("Lecturer1", "Info1")\n\n        self.mgmt = UniManagement()\n\n    def test_uni_person_init(self):\n        self.assertTrue(hasattr(self.person1, "name"), "You must initialize the _name variable for UniPerson")\n        self.assertEqual(self.person1._name, "Person1", "_name seems wrong")\n\n        self.assertTrue(hasattr(self.person1, "_UniPersoninbox"), "You must initialize __inbox as an empty list")\n        self.assertEqual(self.person1._UniPersoninbox, [], "inbox seems wrong")\n\n    def test_uni_person_str(self):\n        self.assertEqual(self.person1.str(), "Name: Person1", "str_ of UniPerson seems wrong")\n\n    def test_uni_person_email(self):\n        self.assertTrue(hasattr(self.person1, "read_emails"), "You must declare read_emails")\n        self.assertTrue(hasattr(self.person1, "receive_email"), "You must declare receive_email")\n\n        self.assertEqual(self.person1.read_emails(), [], "Reading emails before receiving any emails should return an empty inbox")\n\n        self.person1.receive_email("Email1")\n        self.person1.receive_email("Email2")\n\n        self.assertEqual(self.person1.read_emails(), ["Email1", "Email2"], "Reading emails seems wrong")\n\n        self.assertEqual(self.person1.read_emails(), [], "Reading emails should clear inbox")\n\n    def test_student_init(self):\n        self.assertTrue(isinstance(self.student1, UniPerson), "Student must inherit from UniPerson")\n\n        self.assertTrue(hasattr(self.student1, "name"), "You must initialize the _name variable for Student")\n        self.assertEqual(self.student1._name, "Student1", "_name seems wrong")\n\n        self.assertTrue(hasattr(self.student1, "has_graduated"), "You must initialize has_graduated for Student")\n        self.assertTrue(self.student1.has_graduated, "has_graduated seems wrong")\n\n        self.assertTrue(hasattr(self.student1, "has_graduated"), "You must initialize __ects for Student")\n        self.assertEqual(self.student1._Studentects, 120, "ects seems wrong")\n\n    def test_student_legi_nr(self):\n        # Create new students to avoid side effects\n        s1 = Student("S1", 2015, False, 0)\n\n        for i in range(1500):\n            s = Student("", 2015, False, 0)\n\n        s1502 = Student("S1502", 2015, False, 0)\n\n        s3 = Student("S3", 2016, False, 0)\n\n        self.assertTrue(hasattr(s1, "_Studentlegi_nr"), "You must initialize __legi_nr for Student")\n\n        self.assertEqual(s1._Studentlegi_nr, "2015-00000", "Your implementation of legi_nr seems wrong")\n        self.assertEqual(s1502._Studentlegi_nr, "2015-01501", "Your implementation of legi_nr seems wrong")\n        self.assertEqual(s3._Studentlegi_nr, "2016-00000", "Your implementation of legi_nr seems wrong")\n\n    def test_student_str(self):\n        self.assertTrue("True" in self.student1.str(), "Your __str_ implementation of Student must contain the value of has_graduated")\n        self.assertTrue("False" in self.student2._str(), "Your __str_ implementation of Student must contain the value of has_graduated")\n\n        self.assertTrue("119" in self.student2._str(), "Your __str_ implementation of Student must contain the value of _ects")\n\n        s1 = Student("S1", 2018, False, 0)\n        self.assertTrue("2018-00000" in s1.str(), "Your __str implementation of Student must contain the value of _legi_nr")\n\n    def test_lecturer_init(self):\n        self.assertTrue(isinstance(self.lecturer1, UniPerson), "Lecturer must inherit from UniPerson")\n\n        self.assertTrue(hasattr(self.lecturer1, "_name"), "You must initialize the _name variable for Lecturer")\n        self.assertEqual(self.lecturer1._name, "Lecturer1", "_name seems wrong")\n\n        self.assertTrue(hasattr(self.lecturer1, "_Lecturerlecture_name"), "You must initialize the __lecture_name variable for Lecturer")\n        self.assertEqual(self.lecturer1._Lecturerlecture_name, "Info1", "lecture_name seems wrong")\n\n    def test_lecturer_str(self):\n        self.assertTrue("Info1" in self.lecturer1.str(), "Your __str_ implementation of Lecturer must contain the value of _lecture_name")\n\n    def test_mgmt_init(self):\n        self.assertTrue(hasattr(self.mgmt, "_UniManagementpersons"), "You must initialize __persons for UniManagement")\n        self.assertEqual(self.mgmt._UniManagementpersons, [], "persons seems wrong")\n\n    def test_mgmt_add_person(self):\n        self.assertTrue(hasattr(self.mgmt, "add_person"), "You must implement the add_person method for UniManagement")\n\n        self.mgmt.add_person(self.student1)\n        self.assertEqual(self.mgmt._UniManagementpersons, [self.student1], "Your implementation of add_person seems wrong")\n\n        self.mgmt.add_person(self.lecturer1)\n        self.assertEqual(self.mgmt._UniManagementpersons, [self.student1, self.lecturer1], "Your implementation of add_person seems wrong")\n\n        self.mgmt.add_person("Wrong data type")\n        self.assertEqual(self.mgmt._UniManagementpersons, [self.student1, self.lecturer1], "Your implementation of add_person seems wrong; it shouldn\'t be possible to add a wrong data type")\n\n    def test_mgmt_list_persons(self):\n        self.assertTrue(hasattr(self.mgmt, "list_persons"), "You must implement the list_persons method for UniManagement")\n\n        self.assertEqual(self.mgmt.list_persons(), [], "list_persons seems wrong")\n\n        self.mgmt.add_person(self.person1)\n        self.mgmt.add_person(self.student1)\n        self.mgmt.add_person(self.lecturer1)\n\n        persons = self.mgmt.list_persons()\n\n        self.assertTrue(isinstance(persons, list), "list_persons must return a list")\n        self.assertEqual(len(persons), 3, "The length of your list seems wrong")\n\n        self.assertEqual(persons[0], self.person1.str(), "The elements of list_persons should be the __str_ representations of the persons")\n        self.assertEqual(persons[1], self.student1._str(), "The elements of list_persons should be the __str_ representations of the persons")\n        self.assertEqual(persons[2], self.lecturer1._str(), "The elements of list_persons should be the __str_ representations of the persons")\n\n    def test_mgmt_send_email(self):\n        self.assertTrue(hasattr(self.mgmt, "send_email"), "You must implement the send_email method for UniManagement")\n\n        self.mgmt.add_person(self.person1)\n        self.mgmt.add_person(self.student1)\n        self.mgmt.add_person(self.lecturer1)\n\n        self.mgmt.send_email("Email1")\n\n        self.assertEqual(self.person1.read_emails(), ["Email1"], "send_email seems wrong")\n        self.assertEqual(self.student1.read_emails(), ["Email1"], "send_email seems wrong")\n        self.assertEqual(self.lecturer1.read_emails(), ["Email1"], "send_email seems wrong")\n\n    def test_mgmt_count_alumni(self):\n        self.assertTrue(hasattr(self.mgmt, "count_alumni"), "You must implement the count_alumni method for UniManagement")\n\n        self.assertEqual(self.mgmt.count_alumni(), 0, "count_alumni seems wrong")\n\n        self.mgmt.add_person(self.person1)\n        self.mgmt.add_person(self.student1)\n        self.mgmt.add_person(self.student2)\n        self.mgmt.add_person(self.lecturer1)\n\n        self.assertEqual(self.mgmt.count_alumni(), 1, "count_alumni seems wrong")\n        self.mgmt.add_person(self.student3)\n        self.assertEqual(self.mgmt.count_alumni(), 2, "count_alumni seems wrong")\n',
                        },
                    ],
                },
            }),
        }).then(response => {
            if (response.status === 202) {
                console.log('202 - Submission Successful');
                return response.json();
            } else {
                throw new Error('Something went wrong on api server!');
            }
        }).then(response => {
            console.debug(response);
        }).catch(error => {
            console.error(error);
        });
    }

    //update workspace if code gets edited by user
    onChange = (newValue) => {
        let workspace = this.state.workspace.slice();
        let index = workspace.indexOf(this.state.selectedFile);
        let file = workspace[index];
        file = { ...file, content: newValue };
        workspace[index] = file;
        this.setState(({ workspace, selectedFile: file }));
    };

    render() {
        if (!this.state.selectedFile) {
            return null;
        }

        const options = { selectOnLineNumbers: true };

        let files = this.state.workspace.map((f) =>
            <button key={f.id} className="btn btn-light" onClick={() => this.select(f)}>
                {f.name + '.' + f.extension}
            </button>,
        );

        return (
            <div>
                <div className="border border-secondary rounded">
                    <ReactMarkdown source={this.props.exercise.question}/>
                </div>

                <div className="border border-secondary rounded">
                    <div className="btn-group btn-group-sm" role="group" aria-label="files">
                        {files}
                    </div>
                    <div className="border">
                        <MonacoEditor
                            height="450px"
                            language={this.props.exercise.language}
                            value={this.state.selectedFile.content}
                            automaticLayout={true}
                            options={options}
                            quickSuggestions={true}
                            snippetSuggestions={true}
                            wordBasedSuggestions={true}
                            onChange={this.onChange}
                        />

                        <button onClick={this.submitButtonClick}>
                            Testrun
                        </button>
                    </div>
                </div>

            </div>
        );
    }

}

export default CodeExercise;