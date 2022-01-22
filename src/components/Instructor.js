import './App.css';
import React, {useState} from "react";
import ReactDOM from "react-dom";

import course from '../abis/Course.json';
import department from '../abis/Department.json';
import diploma from '../abis/Diploma.json';
import faculty from '../abis/Faculty.json';
import roles from '../abis/Roles.json';
import request from '../abis/Request.json';
import env from '../env.json';
import {ethers} from "ethers";

const courseAddress = env.courseAddress
const departmentAddress = env.departmentAddress
const diplomaAddress = env.diplomaAddress
const facultyAddress = env.facultyAddress
const requestAddress = env.requestAddress
const rolesAddress = env.rolesAddress

const courseAbi = course.abi;
const departmentAbi = department.abi;
const diplomaAbi = diploma.abi;
const facultyAbi = faculty.abi;
const rolesAbi = roles.abi;
const requestAbi = request.abi;

function returnButton(){
    ReactDOM.render(
        <React.StrictMode>
            <App/>
        </React.StrictMode>,
        document.getElementById('root')
    );
}
function ReadApplications(props){
    async function approve(index){
        let i = Number(index.slice(index.indexOf("i")+1, index.indexOf("j")))
        let j = Number(index.slice(index.indexOf("j")+1))
        let courseID = props.coursesGiven[i]
        let studentAddress = props.applications[i][j]
        await props.courseContract.approveDisapproveApplication(courseID,studentAddress, true)
        returnButton()

    }
    async function disapprove(index){
        let i = Number(index.slice(index.indexOf("i")+1, index.indexOf("j")))
        let j = Number(index.slice(index.indexOf("j")+1))
        let courseID = props.coursesGiven[i]
        let studentAddress = props.applications[i][j]
        await props.courseContract.approveDisapproveApplication(courseID,studentAddress, false)
        returnButton()
    }
    async function createTable() {
        var table = document.getElementById("courseRequestTable");
        table.removeChild(document.getElementById("tableBody"))

        let tbody = document.createElement("tbody")
        tbody.setAttribute("id", "tableBody")
        table.insertBefore(tbody, document.getElementById("buttons"))

        var newRow = tbody.insertRow(0)
        var cell0 = document.createElement("th")
        var cell1 = document.createElement("th")
        var cell2 = document.createElement("th")
        var cell3 = document.createElement("th")
        cell0.innerHTML = "Course Link";
        cell1.innerHTML = "Student Address";
        cell2.innerHTML = "Approve";
        cell3.innerHTML = "Disapprove";
        newRow.appendChild(cell0)
        newRow.appendChild(cell1)
        newRow.appendChild(cell2)
        newRow.appendChild(cell3)
        let count = 0;
        for (var i = 0; i < props.applications.length; i++) {
            for (var j = 0; j < props.applications[i].length; j++){
                count++
                var newRow = tbody.insertRow(count)
                var cell0 = newRow.insertCell(0);
                var cell1 = newRow.insertCell(1);
                var cell2 = newRow.insertCell(2);
                var cell3 = newRow.insertCell(3);
                var approveButton = document.createElement("button")
                approveButton.setAttribute("class", "approve-button")
                approveButton.setAttribute("type", "button")
                approveButton.setAttribute("id", "i" +i+"j"+j)
                approveButton.onclick = function () {approve(this.id)}
                approveButton.innerHTML = "Approve"
                cell2.appendChild(approveButton)
                var disapproveButton = document.createElement("button")
                disapproveButton.setAttribute("class", "disapprove-button")
                disapproveButton.setAttribute("type", "button")
                disapproveButton.setAttribute("id", "i" + i+"j"+j)
                disapproveButton.onclick = function () {disapprove(this.id)}
                disapproveButton.innerHTML = "Disapprove"
                cell3.appendChild(disapproveButton)
                let courseLinks = await props.courseContract.getCourseLinks();
                cell0.innerHTML = courseLinks[props.coursesGiven[i]-1];
                cell1.innerHTML = props.applications[i][j];
            }
        }
    }

    return (
        <body>
        <table id="courseRequestTable">
            <tbody id="tableBody"></tbody>
            <tr id="buttons">
                <button onClick={(e) => returnButton()}>Back</button>
                <button onClick={(e) => createTable()}>Show Requests</button>
            </tr>
        </table>
        </body>
    );
}
function ReadCourses(props){

    function DropStudent(props){

        let [studentAddress, setStudent] = useState("");

        const handleSubmit = async (event) => {
            event.preventDefault();
            console.log(studentAddress)
            await props.courseContract.dropStudent(props.courseId, studentAddress)
            //TODO handle fail alerts
            alert(`${studentAddress} has been dropped`)
            returnButton()
        }

        return (
            <form onSubmit={handleSubmit}>
                <h1>{props.courseLink}</h1>
                <select type="text" id="select"
                        onChange={(e) => setStudent(e.target.value)}>
                    <option selected hidden>Select a Student</option>
                    {props.students.map(item => {
                        return <option>{item}</option>
                    })}
                </select>
                <input type="submit" id="button" value="Drop"/>
                <button onClick={(e) => returnButton()}>Back</button>
            </form>
        )
    }

    function EditLink(props){

        const [newLink, setLink] = useState("");

        const handleSubmit = async (event) => {
            event.preventDefault();
            await props.courseContract.editCourseLink(props.courseId, newLink)
            //TODO write fail alert messages
            alert(`Course Link Has Been Changed`)
            returnButton()
        }
        return (
            <form onSubmit={handleSubmit}>
                <h1>{props.courseLink}</h1>
                <label>Enter New Link:
                    <input
                        type="text"
                        value={newLink}
                        onChange={(e) => setLink(e.target.value)}
                    />
                </label>
                <input type="submit"/>
                <button onClick={(e) => returnButton()}>Geri</button>
            </form>
        )
    }

    async function freeze(id) {
        let buttonIndex = id.slice(id.lastIndexOf("e")+1)
        let courseID = props.coursesGiven[buttonIndex]
        await props.courseContract.freeze(courseID)
        returnButton()
    }

    async function drop(id, courseLink) {
        let buttonIndex = id.slice(id.lastIndexOf("p")+1)
        let courseID = props.coursesGiven[buttonIndex]
        let students = await props.courseContract.getApprovedStudents(courseID)
        ReactDOM.render(
            <React.StrictMode>
                <DropStudent courseLink={courseLink}
                             courseId={courseID}
                             students={students}
                             courseContract={props.courseContract}
                />
            </React.StrictMode>,
            document.getElementById('root')
        );

    }

    async function edit(id, courseLink) {
        let buttonIndex = id.slice(id.lastIndexOf("t")+1)
        let courseID = props.coursesGiven[buttonIndex]
        ReactDOM.render(
            <React.StrictMode>
                <EditLink courseLink={courseLink}
                             courseId={courseID}
                             courseContract={props.courseContract}
                />
            </React.StrictMode>,
            document.getElementById('root')
        );
    }

    async function createTable() {
        var table = document.getElementById("courseRequestTable");
        table.removeChild(document.getElementById("tableBody"))
        let tbody = document.createElement("tbody")
        tbody.setAttribute("id", "tableBody")
        table.insertBefore(tbody, document.getElementById("buttons"))
        var newRow = tbody.insertRow(0)
        var cell0 = document.createElement("th")
        var cell1 = document.createElement("th")
        var cell2 = document.createElement("th")
        var cell3 = document.createElement("th")
        cell0.innerHTML = "Course Link";
        cell1.innerHTML = "Freeze";
        cell2.innerHTML = "Drop Student";
        cell3.innerHTML = "Edit Link";
        newRow.appendChild(cell0)
        newRow.appendChild(cell1)
        newRow.appendChild(cell2)
        newRow.appendChild(cell3)
        let courseLinks = await props.courseContract.getCourseLinks();
        console.log(courseLinks)
        for (var i = 0; i < props.coursesGiven.length; i++) {
            var newRow = tbody.insertRow(i + 1)
            var cell0 = newRow.insertCell(0);
            var cell1 = newRow.insertCell(1);
            var cell2 = newRow.insertCell(2);
            var cell3 = newRow.insertCell(3);
            cell0.innerHTML = courseLinks[props.coursesGiven[i]-1];

            let isFrozen = await props.courseContract.getFrozen(props.coursesGiven[i])

            var freezeButton = document.createElement("button")
            freezeButton.setAttribute("type", "button")
            if(isFrozen){
                freezeButton.disabled=true;
                freezeButton.innerHTML = "Frozen"
            }else{
                freezeButton.setAttribute("class", "freeze-button")
                freezeButton.setAttribute("id", "freeze" + i)
                freezeButton.onclick = function () {
                    freeze(this.id)
                }
                freezeButton.innerHTML = "Freeze"
            }
            cell1.appendChild(freezeButton)

            var dropButton = document.createElement("button")
            dropButton.setAttribute("type", "button")
            if(isFrozen){
                dropButton.disabled=true;
            }else{
                dropButton.setAttribute("class", "disapprove-button")
                dropButton.setAttribute("id", "drop" + i)
                dropButton.value = cell0.innerHTML
                dropButton.onclick = function () {
                    drop(this.id, this.value)
                }
            }
            dropButton.innerHTML = "Drop"
            cell2.appendChild(dropButton)

            var editButton = document.createElement("button")
            editButton.setAttribute("type", "button")
            if(isFrozen){
                editButton.disabled=true;
            }else{
                editButton.setAttribute("class", "edit-button")
                editButton.setAttribute("id", "edit" + i)
                editButton.value = cell0.innerHTML
                editButton.onclick = function () {
                    edit(this.id, this.value)
                }
            }
            editButton.innerHTML = "Edit"
            cell3.appendChild(editButton)
        }
    }
    return (<body>
        <table id="courseRequestTable">
            <tbody id="tableBody"></tbody>
            <tr id="buttons">
                <button onClick={(e) => returnButton()}>Back</button>
                <button onClick={(e) => createTable()}>Show Requests</button>
            </tr>
        </table>
        </body>);
}

function FreezeCourse(props){
    let courseID;
    async function setCourse(value) {
        for(var i = 0; i<props.unfrozenCourseLinks.length; i++){
            if(props.unfrozenCourseLinks[i] == value){
                courseID=props.unfrozenCourses[i]
                break
            }
        }
        let button = document.getElementById("button")
        button.disabled = false
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        await props.courseContract.freeze(courseID)
        //TODO write fail alert messages
        alert(`Course${courseID} has been frozen`)
        returnButton()
    }
    return (
        <form onSubmit={handleSubmit}>
            <select type="text" id="select"
                    onChange={(e) => setCourse(e.target.value)}>
                <option selected hidden>Select a Course</option>
                {props.unfrozenCourseLinks.map(item => {
                    return <option>{item}</option>
                })}
            </select>
            <input type="submit" id="button" disabled value="Freeze"/>
            <button onClick={(e) => returnButton()}>Back</button>
        </form>
    )
}

function App() {
    function readApplicationsButton() {
        async function readCourseRequestsHandler() {
            const contracts = await getContracts(true, false, false, false, false, true, true);
            let account = contracts[2];
            let isStudent = await contracts[1].hasInstructorRole(account)
            if (!isStudent) {
                alert(`${account} is not a Instructor`)
                return;
            }
            let coursesGiven = await contracts[0].getGivesCourses(account);
            let applications = []
            for(var i = 0; i<coursesGiven.length; i++){
                let temp = await contracts[0].getRequestOfStudents(coursesGiven[i])
                applications.push(temp)
            }
            ReactDOM.render(
                <React.StrictMode>
                    <ReadApplications coursesGiven={coursesGiven}
                                      applications={applications}
                                      courseContract={contracts[0]}
                    />
                </React.StrictMode>,
                document.getElementById('root')
            );
        }

        return (
            <button onClick={readCourseRequestsHandler} className='cta-button read-button'>
                List Student Applications
            </button>
        )
    }
    function readCoursesButton() {

        async function readCoursesHandler() {
            const contracts = await getContracts(true, false, false, false, false, true, true);
            let account = contracts[2];
            let isStudent = await contracts[1].hasInstructorRole(account)
            if (!isStudent) {
                alert(`${account} is not a Instructor`)
                return;
            }
            let coursesGiven = await contracts[0].getGivesCourses(account);
            ReactDOM.render(
                <React.StrictMode>
                    <ReadCourses coursesGiven={coursesGiven}
                                 courseContract={contracts[0]}
                    />
                </React.StrictMode>,
                document.getElementById('root')
            );
        }

        return (
            <button onClick={readCoursesHandler} className='cta-button read-button'>
                List Courses Given
            </button>
        )
    }

    function freezeCourseButton() {
        async function readCourseRequestsHandler() {
            const contracts = await getContracts(true, false, false, false, false, true, true);
            let account = contracts[2];
            let isStudent = await contracts[1].hasInstructorRole(account)
            if (!isStudent) {
                alert(`${account} is not a Instructor`)
                return;
            }
            let coursesGiven = await contracts[0].getGivesCourses(account);
            let unfrozenCourses = []
            let courseLinks = await contracts[0].getCourseLinks()
            let unfrozenCourseLinks = []
            for(var i = 0; i<coursesGiven.length; i++){
                let isFrozen = await contracts[0].getFrozen(coursesGiven[i])
                if(!isFrozen){
                    unfrozenCourses.push(coursesGiven[i])
                    unfrozenCourseLinks.push(courseLinks[coursesGiven[i]-1])
                }
            }

            ReactDOM.render(
                <React.StrictMode>
                    <FreezeCourse unfrozenCourses={unfrozenCourses}
                                  unfrozenCourseLinks={unfrozenCourseLinks}
                                  courseContract={contracts[0]}
                    />
                </React.StrictMode>,
                document.getElementById('root')
            );
        }

        return (
            <button onClick={readCourseRequestsHandler} className='cta-button create-button'>
                Freeze Course
            </button>
        )
    }
    return (
        <div className='main-app'>
            <div className='create-operations'>
                {freezeCourseButton()}
            </div>
            <div className='read-operations'>
                {readApplicationsButton()}
                {readCoursesButton()}
            </div>
            <div className='delete-operations'></div>
        </div>
    )
}
async function getContracts(course = false, department = false, diploma = false, faculty = false, request = false, roles = false, account = false) {
    const {ethereum} = window;
    if (!ethereum) {
        return;
    }
    const accounts = await ethereum.request({method: "eth_requestAccounts"});
    if (accounts.length !== 0) {

        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        let contracts = [];
        if (course) {
            const courseContract = new ethers.Contract(courseAddress, courseAbi, signer);
            contracts.push(courseContract);
        }
        // if (department) {
        //     const departmentContract = new ethers.Contract(departmentAddress, departmentAbi, signer);
        //     contracts.push(departmentContract)
        // }
        // if (diploma) {
        //     const diplomaContract = new ethers.Contract(diplomaAddress, diplomaAbi, signer);
        //     contracts.push(diplomaContract)
        // }
        // if (faculty) {
        //     const facultyContract = new ethers.Contract(facultyAddress, facultyAbi, signer);
        //     contracts.push(facultyContract)
        // }
        // if (request) {
        //     const requestContract = new ethers.Contract(requestAddress, requestAbi, signer);
        //     contracts.push(requestContract)
        // }
        if (roles) {
            const rolesContract = new ethers.Contract(rolesAddress, rolesAbi, signer);
            contracts.push(rolesContract)
        }
        if (account) {
            const account = accounts[0];
            contracts.push(account)
        }
        return contracts
    }
}
export default App;