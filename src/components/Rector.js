import React, {useEffect} from 'react';
import {useState} from 'react';
import {ethers} from 'ethers';
import ReactDOM from "react-dom";

import './App.css';

import course from '../abis/Course.json';
import department from '../abis/Department.json';
import diploma from '../abis/Diploma.json';
import faculty from '../abis/Faculty.json';
import roles from '../abis/Roles.json';
import request from '../abis/Request.json';
import env from '../env.json';

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

function returnButton() {
    ReactDOM.render(
        <React.StrictMode>
            <App/>
        </React.StrictMode>,
        document.getElementById('root')
    );
}

/////////////////////////////////////// READ FUNCTIONS /////////////////////////////////////////////////////////////////
function FacultyList(props) {//TODO Organise table looks
    return (
        <div>
            <tr>
                <th>Faculties</th>
            </tr>
            <td>
                {props.facultyNames.map(item => {
                    return <h5>{item}</h5>;
                })}
            </td>
            <button onClick={(e) => returnButton()}>Geri</button>
        </div>
    );
}

function DepartmentList(props) {
    return (
        <div>
            <tr>
                <th>Departments</th>
            </tr>
            <td>
                {props.departmentNames.map(item => {
                    return <h5>{item}</h5>;
                })}
            </td>
            <button onClick={(e) => returnButton()}>Geri</button>
        </div>
    );
}

function InstructorList(props) {
    return (
        <div>
            <tr>
                <th>Instructors</th>
            </tr>
            <td>
                {props.instructorAddresses.map(item => {
                    return <h5>{item}</h5>;
                })}
            </td>
            <button onClick={(e) => returnButton()}>Geri</button>
        </div>
    );
}

function StudentList(props) {
    return (
        <div>
            <tr>
                <th>Students</th>
            </tr>
            <td>
                {props.studentAddresses.map(item => {
                    return <h5>{item}</h5>;
                })}
            </td>
            <button onClick={(e) => returnButton()}>Geri</button>
        </div>
    );
}

function DiplomaList(props) {//TODO Organise table looks
    return (
        <div>
            <tr>
                <th>Addresses</th>
                <th>Links</th>
            </tr>
            <td>
                {props.addresses.map(item => {
                    return <h5>{item}</h5>;
                })}
            </td>
            <td>
                {props.links.map(item => {
                    return <h5>{item}</h5>;
                })}
            </td>
            <button onClick={(e) => returnButton()}>Geri</button>
        </div>
    );
}

function CourseList(props){//TODO Organise table looks
    return (
        <div>
            <tr>
                <th>Addresses</th>
                <th>Links</th>
            </tr>
            <td>
                {props.addresses.map(item => {
                    return <h5>{item}</h5>;
                })}
            </td>
            <td>
                {props.links.map(item => {
                    return <h5>{item}</h5>;
                })}
            </td>
            <button onClick={(e) => returnButton()}>Geri</button>
        </div>
    );
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////// CREATE FUNCTIONS ///////////////////////////////////////////////////////////////
function AddFaculty(props) {
    const [address, setAddress] = useState("");
    const [facultyName, setFacultyName] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        let allFaculties = await props.rolesContract.getFacultyRoles();
        if (allFaculties.indexOf(address) > -1) {
            alert(`${address} has the Faculty permissions already`)
            return;
        }
        await props.facultyContract.mint(facultyName, address)
        //TODO write fail alert messages
        alert(`${address} has the Faculty permissions Now`)
        returnButton()
    }
    return (
        <form onSubmit={handleSubmit}>
            <label>Enter Faculty Name:
                <input
                    type="text"
                    value={facultyName}
                    onChange={(e) => setFacultyName(e.target.value)}
                />
            </label>
            <label>Enter Faculty Address:
                <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />
            </label>
            <input type="submit"/>
            <button onClick={(e) => returnButton()}>Geri</button>
        </form>
    )
}

function AddDepartment(props) {
    const [departmentAddress, setDepartmentAddress] = useState("");
    const [departmentName, setDepartmentName] = useState("");
    let facultyID;

    async function setFacultyName(value) {
        facultyID = await props.facultyContract.getFacultyID(value)
        let form = document.getElementById("enterName")
        form.hidden = false;
        form = document.getElementById("enterAddress")
        form.hidden = false;
        form = document.getElementById("button")
        form.hidden = false;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        let temp = document.getElementById("select")
        facultyID = await props.facultyContract.getFacultyID(temp.value)
        let allDepartments = await props.rolesContract.getDepartmentRoles();
        if (allDepartments.indexOf(departmentAddress) > -1) {
            alert(`${departmentAddress} has the Department permissions already`)
            return
        }
        const facultyAddress = await props.facultyContract.ownerOf(facultyID)
        await props.departmentContract.mint(departmentName, departmentAddress, facultyAddress)
        //TODO write fail alert messages
        alert(`${departmentAddress} has the Department permissions Now`)
        returnButton()
    }
    return (
        <form onSubmit={handleSubmit}>
            <select type="text" id="select"
                    onChange={(e) => setFacultyName(e.target.value)}>
                <option selected hidden>Select a Faculty</option>
                {props.facultyNames.map(item => {
                    return <option>{item}</option>
                })}
            </select>
            <label id="enterName" hidden>Enter Department Name:
                <input
                    type="text"
                    value={departmentName}
                    onChange={(e) => setDepartmentName(e.target.value)}
                />
            </label>
            <label id="enterAddress" hidden>Enter Department Address:
                <input
                    type="text"
                    value={departmentAddress}
                    onChange={(e) => setDepartmentAddress(e.target.value)}
                />
            </label>
            <input type="submit" id="button" hidden/>
            <button onClick={(e) => returnButton()}>Geri</button>
        </form>
    )
}

function AddInstructor(props) {
    const [address, setAddress] = useState("");
    let facultyID = "";
    let departmentID = "";

    async function setFacultyName(value) {
        facultyID = await props.facultyContract.getFacultyID(value)
        let departmentAddressList = await props.facultyContract.getDepartments(facultyID)
        let departmentListTemp = [];
        for (let i = 0; i < departmentAddressList.length; i++) {
            const totalSupplyDepartment = await props.departmentContract.getTotalSupply();
            for (let j = 1; j <= totalSupplyDepartment; j++) {
                let departmentAddress = await props.departmentContract.ownerOf(j);
                if (departmentAddress == departmentAddressList[i]) {
                    departmentListTemp.push(await props.departmentContract.getDepartmentName(j))
                }
            }
        }
        const departmentSelect = document.getElementById("departmentSelect")
        removeOptions(departmentSelect)
        let newOption = new Option("Select a Department");
        newOption.selected = true;
        newOption.hidden = true;
        departmentSelect.add(newOption, undefined)
        for (let i = 0; i < departmentListTemp.length; i++) {
            let newOption = new Option(departmentListTemp[i]);
            departmentSelect.add(newOption, undefined)
        }
        departmentSelect.hidden = false;
    }

    async function setDepartmentName(value) {
        departmentID = await props.departmentContract.getDepartmentID(value)
        const addressForm = document.getElementById("addressForm")
        addressForm.hidden = false
        const button = document.getElementById("button")
        button.hidden = false
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        let facultySelect = document.getElementById("facultySelect")
        let departmentSelect = document.getElementById("departmentSelect")
        facultyID = await props.facultyContract.getFacultyID(facultySelect.value)
        departmentID = await props.departmentContract.getDepartmentID(departmentSelect.value)
        let allInstructors = await props.rolesContract.getInstructorRoles()
        if (allInstructors.indexOf(address) > -1) {//existance check
            alert(`${address} is already a instructor`)
            return;
        }
        let departmentInstructors = await props.departmentContract.getInstructors(departmentID)
        let temp = departmentInstructors.slice()
        temp.push(address)

        await props.departmentContract.setInstructors(departmentID, temp, "0x0000000000000000000000000000000000000000")

        //TODO write fail alert messages
        alert(`${address} is a Instructor Now`)
        returnButton()
    }

    return (
        <form onSubmit={handleSubmit}>

            <select id="facultySelect"
                    type="text"
                    onChange={(e) => setFacultyName(e.target.value)}>
                <option selected hidden>Select a Faculty</option>
                {props.facultyNames.map(item => {
                    return <option>{item}</option>
                })}
            </select>
            <select id="departmentSelect"
                    hidden
                    type="text"
                    onChange={(e) => setDepartmentName(e.target.value)}>
            </select>
            <label id="addressForm" hidden>Enter Instructor Address:
                <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />
            </label>
            <input type="submit" id="button" hidden/>
            <button onClick={(e) => returnButton()}>Geri</button>
        </form>
    )
}

function AddStudent(props) {
    const [address, setAddress] = useState("");
    let facultyID = "";
    let departmentID = "";

    async function setFacultyName(value) {
        facultyID = await props.facultyContract.getFacultyID(value)
        let departmentAddressList = await props.facultyContract.getDepartments(facultyID)
        let departmentListTemp = [];
        for (let i = 0; i < departmentAddressList.length; i++) {
            const totalSupplyDepartment = await props.departmentContract.getTotalSupply();
            for (let j = 1; j <= totalSupplyDepartment; j++) {
                let departmentAddress = await props.departmentContract.ownerOf(j);
                if (departmentAddress == departmentAddressList[i]) {
                    departmentListTemp.push(await props.departmentContract.getDepartmentName(j))
                }
            }
        }
        const departmentSelect = document.getElementById("departmentSelect")
        removeOptions(departmentSelect)
        let newOption = new Option("Select a Department");
        newOption.selected = true;
        newOption.hidden = true;
        departmentSelect.add(newOption, undefined)
        for (let i = 0; i < departmentListTemp.length; i++) {
            let newOption = new Option(departmentListTemp[i]);
            departmentSelect.add(newOption, undefined)
        }
        departmentSelect.hidden = false;
    }

    async function setDepartmentName(value) {
        departmentID = await props.departmentContract.getDepartmentID(value)
        const addressForm = document.getElementById("addressForm")
        addressForm.hidden = false
        const button = document.getElementById("button")
        button.hidden = false
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        let facultySelect = document.getElementById("facultySelect")
        let departmentSelect = document.getElementById("departmentSelect")
        facultyID = await props.facultyContract.getFacultyID(facultySelect.value)
        departmentID = await props.departmentContract.getDepartmentID(departmentSelect.value)
        let allStudents = await props.rolesContract.getStudentRoles()
        if (allStudents.indexOf(address) > -1) {//existance check
            alert(`${address} is already a student`)
            return;
        }
        let departmentStudents = await props.departmentContract.getStudents(departmentID)
        let temp = departmentStudents.slice()
        temp.push(address)

        await props.departmentContract.setStudents(departmentID, temp, "0x0000000000000000000000000000000000000000")

        //TODO write fail alert messages
        alert(`${address} is a Student Now`)
        returnButton()
    }
    return (
        <form onSubmit={handleSubmit}>

            <select id="facultySelect"
                    type="text"
                    onChange={(e) => setFacultyName(e.target.value)}>
                <option selected hidden>Select a Faculty</option>
                {props.facultyNames.map(item => {
                    return <option>{item}</option>
                })}
            </select>
            <select id="departmentSelect"
                    hidden
                    type="text"
                    onChange={(e) => setDepartmentName(e.target.value)}>
            </select>
            <label id="addressForm" hidden>Enter Student Address:
                <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />
            </label>
            <input type="submit" id="button" hidden/>
            <button onClick={(e) => returnButton()}>Geri</button>
        </form>
    )
}

function MintDiploma(props) {
    async function approve(index) {
        let buttonIndex = index.slice(index.indexOf("e")+1)
        let request = props.requests[Number(props.indexes[buttonIndex])]
        await props.diplomaContract.mint(request.diplomaLink, request.studentAddress)
        //TODO write fail alert messages
        alert(`The Graduate ${request.studentAddress} Has The Diploma ${request.diplomaLink} Now`)
        returnButton()
    }

    async function disapprove(index) {
        let buttonIndex = index.slice(index.indexOf("e")+1)
        let request = props.requests[Number(props.indexes[buttonIndex])]
        await props.requestContract.disapproveDiplomaRequest(request)
        returnButton()
    }

    function createTable() {
        var table = document.getElementById("diplomaRequestTable");
        table.removeChild(document.getElementById("tableBody"))
        let tbody = document.createElement("tbody")
        tbody.setAttribute("id", "tableBody")
        table.insertBefore(tbody, document.getElementById("buttons"))
        var newRow = tbody.insertRow(0)
        var cell0 = document.createElement("th")
        var cell1 = document.createElement("th")
        var cell2 = document.createElement("th")
        var cell3 = document.createElement("th")
        var cell4 = document.createElement("th")
        cell0.innerHTML = "Student Address";
        cell1.innerHTML = "Diploma Link";
        cell2.innerHTML = "Requestor Department";
        cell3.innerHTML = "Approve";
        cell4.innerHTML = "Disapprove";
        newRow.appendChild(cell0)
        newRow.appendChild(cell1)
        newRow.appendChild(cell2)
        newRow.appendChild(cell3)
        newRow.appendChild(cell4)
        for (var i = 0; i < props.requestorDepartments.length; i++) {
            var newRow = tbody.insertRow(i + 1)
            var cell0 = newRow.insertCell(0);
            var cell1 = newRow.insertCell(1);
            var cell2 = newRow.insertCell(2);
            var cell3 = newRow.insertCell(3);
            var cell4 = newRow.insertCell(4);
            var approveButton = document.createElement("button")
            approveButton.setAttribute("class", "approve-button")
            approveButton.setAttribute("type", "button")
            approveButton.setAttribute("id", "approve" + i)
            approveButton.onclick = function () {
                approve(this.id)
            }
            approveButton.innerHTML = "Approve"
            cell3.appendChild(approveButton)
            var disapproveButton = document.createElement("button")
            disapproveButton.setAttribute("class", "disapprove-button")
            disapproveButton.setAttribute("type", "button")
            disapproveButton.setAttribute("id", "disapprove" + i)
            disapproveButton.onclick = function () {
                disapprove(this.id)
            }
            disapproveButton.innerHTML = "Disapprove"
            cell4.appendChild(disapproveButton)
            cell0.innerHTML = props.studentAddresses[i];
            cell1.innerHTML = props.diplomaLinks[i];
            cell2.innerHTML = props.requestorDepartments[i];
        }
    }

    return (
        <body>
        <table id="diplomaRequestTable">
            <tbody id="tableBody"></tbody>
            <tr id="buttons">
                <button onClick={(e) => returnButton()}>Back</button>
                <button onClick={(e) => createTable()}>Show Requests</button>
            </tr>
        </table>
        </body>
    );
}

function MintCourse(props){
    async function approve(index) {
        let buttonIndex = index.slice(index.indexOf("e")+1)
        let request = props.requests[Number(props.indexes[buttonIndex])]
        await props.courseContract.mint(request.courseLink, request.instructorAddress)
        //TODO write fail alert messages
        alert(`The Instructor: ${request.instructorAddress} Has The Course ${request.courseLink} Now`)
        returnButton()
    }

    async function disapprove(index) {
        let buttonIndex = index.slice(index.indexOf("e")+1)
        let request = props.requests[Number(props.indexes[buttonIndex])]
        console.log(buttonIndex)
        await props.requestContract.disapproveCourseRequest(request)
        returnButton()
    }

    function createTable() {
        var table = document.getElementById("diplomaRequestTable");
        table.removeChild(document.getElementById("tableBody"))
        let tbody = document.createElement("tbody")
        tbody.setAttribute("id", "tableBody")
        table.insertBefore(tbody, document.getElementById("buttons"))
        var newRow = tbody.insertRow(0)
        var cell0 = document.createElement("th")
        var cell1 = document.createElement("th")
        var cell2 = document.createElement("th")
        var cell3 = document.createElement("th")
        var cell4 = document.createElement("th")
        cell0.innerHTML = "Instructor Address";
        cell1.innerHTML = "Course Link";
        cell2.innerHTML = "Requestor Department";
        cell3.innerHTML = "Approve";
        cell4.innerHTML = "Disapprove";
        newRow.appendChild(cell0)
        newRow.appendChild(cell1)
        newRow.appendChild(cell2)
        newRow.appendChild(cell3)
        newRow.appendChild(cell4)
        for (var i = 0; i < props.requestorDepartments.length; i++) {
            var newRow = tbody.insertRow(i + 1)
            var cell0 = newRow.insertCell(0);
            var cell1 = newRow.insertCell(1);
            var cell2 = newRow.insertCell(2);
            var cell3 = newRow.insertCell(3);
            var cell4 = newRow.insertCell(4);
            var approveButton = document.createElement("button")
            approveButton.setAttribute("class", "approve-button")
            approveButton.setAttribute("type", "button")
            approveButton.setAttribute("id", "approve" + i)
            approveButton.onclick = function () {
                approve(this.id)
            }
            approveButton.innerHTML = "Approve"
            cell3.appendChild(approveButton)
            var disapproveButton = document.createElement("button")
            disapproveButton.setAttribute("class", "disapprove-button")
            disapproveButton.setAttribute("type", "button")
            disapproveButton.setAttribute("id", "disapprove" + i)
            disapproveButton.onclick = function () {
                disapprove(this.id)
            }
            disapproveButton.innerHTML = "Disapprove"
            cell4.appendChild(disapproveButton)
            cell0.innerHTML = props.instructorAddresses[i];
            cell1.innerHTML = props.courseLinks[i];
            cell2.innerHTML = props.requestorDepartments[i];
        }
    }

    return (
        <body>
        <table id="diplomaRequestTable">
            <tbody id="tableBody"></tbody>
            <tr id="buttons">
                <button onClick={(e) => returnButton()}>Back</button>
                <button onClick={(e) => createTable()}>Show Requests</button>
            </tr>
        </table>
        </body>
    );}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////// DELETE FUNCTIONS ///////////////////////////////////////////////////////////////
function RemoveInstructor(props) {
    const [address, setAddress] = useState("");
    let facultyID = "";
    let departmentID = "";

    async function setFacultyName(value) {
        facultyID = await props.facultyContract.getFacultyID(value)
        let departmentAddressList = await props.facultyContract.getDepartments(facultyID)
        let departmentListTemp = [];
        for (let i = 0; i < departmentAddressList.length; i++) {
            const totalSupplyDepartment = await props.departmentContract.getTotalSupply();
            for (let j = 1; j <= totalSupplyDepartment; j++) {
                let departmentAddress = await props.departmentContract.ownerOf(j);
                if (departmentAddress == departmentAddressList[i]) {
                    departmentListTemp.push(await props.departmentContract.getDepartmentName(j))
                }
            }
        }
        const departmentSelect = document.getElementById("departmentSelect")
        removeOptions(departmentSelect)
        let newOption = new Option("Select a Department");
        newOption.selected = true;
        newOption.hidden = true;
        departmentSelect.add(newOption, undefined)
        for (let i = 0; i < departmentListTemp.length; i++) {
            let newOption = new Option(departmentListTemp[i]);
            departmentSelect.add(newOption, undefined)
        }
        departmentSelect.hidden = false;
    }

    async function setDepartmentName(value) {
        departmentID = await props.departmentContract.getDepartmentID(value)
        const addressForm = document.getElementById("addressForm")
        addressForm.hidden = false
        const button = document.getElementById("button")
        button.hidden = false
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        let facultySelect = document.getElementById("facultySelect")
        let departmentSelect = document.getElementById("departmentSelect")
        facultyID = await props.facultyContract.getFacultyID(facultySelect.value)
        departmentID = await props.departmentContract.getDepartmentID(departmentSelect.value)
        let allInstructors = await props.rolesContract.getInstructorRoles()
        if (allInstructors.indexOf(address) <= -1) {//existance check
            alert(`${address} is not an instructor`)
            return;
        }
        let departmentInstructors = await props.departmentContract.getInstructors(departmentID)
        if (departmentInstructors.indexOf(address) <= -1) {
            alert(`${address} is not an instructor in this department`)
            return;
        }
        let temp = departmentInstructors.slice()
        temp = temp.filter(e => e !== address);

        await props.departmentContract.setInstructors(departmentID, temp, address)

        //TODO write fail alert messages
        alert(`${address} has removed`)
        returnButton()
    }
    return (
        <form onSubmit={handleSubmit}>
            <select id="facultySelect"
                    type="text"
                    onChange={(e) => setFacultyName(e.target.value)}>
                <option selected hidden>Select a Faculty</option>
                {props.facultyNames.map(item => {
                    return <option>{item}</option>
                })}
            </select>
            <select id="departmentSelect"
                    hidden
                    type="text"
                    onChange={(e) => setDepartmentName(e.target.value)}>
            </select>
            <label id="addressForm" hidden>Enter Instructor Address:
                <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />
            </label>
            <input type="submit" id="button" hidden/>
            <button onClick={(e) => returnButton()}>Geri</button>
        </form>
    )
}

function RemoveStudent(props) {
    const [address, setAddress] = useState("");
    let facultyID = "";
    let departmentID = "";

    async function setFacultyName(value) {
        facultyID = await props.facultyContract.getFacultyID(value)
        let departmentAddressList = await props.facultyContract.getDepartments(facultyID)
        let departmentListTemp = [];
        for (let i = 0; i < departmentAddressList.length; i++) {
            const totalSupplyDepartment = await props.departmentContract.getTotalSupply();
            for (let j = 1; j <= totalSupplyDepartment; j++) {
                let departmentAddress = await props.departmentContract.ownerOf(j);
                if (departmentAddress == departmentAddressList[i]) {
                    departmentListTemp.push(await props.departmentContract.getDepartmentName(j))
                }
            }
        }
        const departmentSelect = document.getElementById("departmentSelect")
        removeOptions(departmentSelect)
        let newOption = new Option("Select a Department");
        newOption.selected = true;
        newOption.hidden = true;
        departmentSelect.add(newOption, undefined)
        for (let i = 0; i < departmentListTemp.length; i++) {
            let newOption = new Option(departmentListTemp[i]);
            departmentSelect.add(newOption, undefined)
        }
        departmentSelect.hidden = false;
    }

    async function setDepartmentName(value) {
        departmentID = await props.departmentContract.getDepartmentID(value)
        const addressForm = document.getElementById("addressForm")
        addressForm.hidden = false
        const button = document.getElementById("button")
        button.hidden = false
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        let facultySelect = document.getElementById("facultySelect")
        let departmentSelect = document.getElementById("departmentSelect")
        facultyID = await props.facultyContract.getFacultyID(facultySelect.value)
        departmentID = await props.departmentContract.getDepartmentID(departmentSelect.value)
        let allStudents = await props.rolesContract.getStudentRoles()
        if (allStudents.indexOf(address) <= -1) {//existance check
            alert(`${address} is not an student`)
            return;
        }
        let departmentStudents = await props.departmentContract.getStudents(departmentID)
        if (departmentStudents.indexOf(address) <= -1) {
            alert(`${address} is not an student in this department`)
            return;
        }
        let temp = departmentStudents.slice()
        temp = temp.filter(e => e !== address);

        await props.departmentContract.setStudents(departmentID, temp, address)

        //TODO write fail alert messages
        alert(`${address} has removed`)
        returnButton()
    }
    return (
        <form onSubmit={handleSubmit}>
            <select id="facultySelect"
                    type="text"
                    onChange={(e) => setFacultyName(e.target.value)}>
                <option selected hidden>Select a Faculty</option>
                {props.facultyNames.map(item => {
                    return <option>{item}</option>
                })}
            </select>
            <select id="departmentSelect"
                    hidden
                    type="text"
                    onChange={(e) => setDepartmentName(e.target.value)}>
            </select>
            <label id="addressForm" hidden>Enter Student Address:
                <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />
            </label>
            <input type="submit" id="button" hidden/>
            <button onClick={(e) => returnButton()}>Geri</button>
        </form>
    )
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function App() {
/////////////////////////////////////// READ FUNCTIONS /////////////////////////////////////////////////////////////////
    function checkFacultyButton() {
        async function checkFacultyHandler() {
            const contracts = await getContracts(false, false, false, true);
            const facultyContract = contracts[0]
            const totalSupply = await facultyContract.getTotalSupply();
            let facultyNames = [];
            for (var i = 1; i <= totalSupply; i++) {
                let facultyName = await facultyContract.getFacultyName(i);
                if (facultyName !== "") {
                    facultyNames.push(facultyName);
                }
            }
            ReactDOM.render(
                <React.StrictMode>
                    <FacultyList facultyNames={facultyNames}/>
                </React.StrictMode>,
                document.getElementById('root')
            );
        }

        return (
            <button onClick={checkFacultyHandler} className='cta-button read-button'>
                List Faculties
            </button>
        )
    }

    function checkDepartmentButton() {
        async function checkDepartmentHandler() {
            const contracts = await getContracts(false, true, false, false);
            const departmentContract = contracts[0]
            const totalSupply = await departmentContract.getTotalSupply();
            let departmentNames = [];
            for (var i = 1; i <= totalSupply; i++) {
                let departmentName = await departmentContract.getDepartmentName(i);
                if (departmentName !== "") {
                    departmentNames.push(departmentName);
                }
            }
            ReactDOM.render(
                <React.StrictMode>
                    <DepartmentList departmentNames={departmentNames}/>
                </React.StrictMode>,
                document.getElementById('root')
            );
        }

        return (
            <button onClick={checkDepartmentHandler} className='cta-button read-button'>
                List Departments
            </button>
        )
    }

    function checkInstructorButton() {
        async function checkInstructorHandler() {
            const contracts = await getContracts(false, false, false, false, false, true, false);
            const courseContract = contracts[0]
            const instructorAddresses = await courseContract.getInstructorRoles();
            ReactDOM.render(
                <React.StrictMode>
                    <InstructorList instructorAddresses={instructorAddresses}/>
                </React.StrictMode>,
                document.getElementById('root')
            );
        }

        return (
            <button onClick={checkInstructorHandler} className='cta-button read-button'>
                List Instructors
            </button>
        )
    }

    function checkStudentButton() {
        async function checkStudentHandler() {
            const contracts = await getContracts(false, false, false, false, false, true, false);
            const courseContract = contracts[0]
            const studentAddresses = await courseContract.getStudentRoles();
            ReactDOM.render(
                <React.StrictMode>
                    <StudentList studentAddresses={studentAddresses}/>
                </React.StrictMode>,
                document.getElementById('root')
            );
        }

        return (
            <button onClick={checkStudentHandler} className='cta-button read-button'>
                List Students
            </button>
        )
    }

    function checkDiplomaButton() {
        async function checkDiplomaHandler() {
            const contracts = await getContracts(false, false, true, false);
            const diplomaContract = contracts[0]
            const diplomaLinks = await diplomaContract.getDiplomaLinks();
            var diplomaAddresses = [];
            for (var i = 1; i <= diplomaLinks.length; i++) {
                diplomaAddresses.push(await diplomaContract.ownerOf(i));
            }
            ReactDOM.render(
                <React.StrictMode>
                    <DiplomaList links={diplomaLinks} addresses={diplomaAddresses}/>
                </React.StrictMode>,
                document.getElementById('root')
            );
        }

        return (
            <button onClick={checkDiplomaHandler} className='cta-button read-button'>
                List Diplomas
            </button>
        )
    }

    function checkCourseButton() {
        async function checkCourseHandler() {
            const contracts = await getContracts(true, false, false, false);
            const courseContract = contracts[0]
            const courseLinks = await courseContract.getCourseLinks();
            var courseAddresses = [];
            for (var i = 1; i <= courseLinks.length; i++) {
                courseAddresses.push(await courseContract.ownerOf(i));
            }
            ReactDOM.render(
                <React.StrictMode>
                    <CourseList links={courseLinks} addresses={courseAddresses}/>
                </React.StrictMode>,
                document.getElementById('root')
            );
        }

        return (
            <button onClick={checkCourseHandler} className='cta-button read-button'>
                List Courses
            </button>
        )
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////// CREATE FUNCTIONS ///////////////////////////////////////////////////////////////
    function addFacultyButton() {
        async function addFacultyHandler() {
            const contracts = await getContracts(false, false, false, true, false, true, false);
            ReactDOM.render(
                <React.StrictMode>
                    <AddFaculty facultyContract={contracts[0]} rolesContract={contracts[1]}/>
                </React.StrictMode>,
                document.getElementById('root')
            );
        }

        return (
            <button onClick={addFacultyHandler} className='cta-button create-button'>
                Add New Faculty
            </button>
        )
    }

    function addDepartmentButton() {
        async function addDepartmentHandler() {
            const contracts = await getContracts(false, true, false, true, false, true, false);
            const facultyAmount = await contracts[1].getTotalSupply();
            let facultyNames = [];
            let facultyIDs = [];
            for (let i = 1; i <= Number(facultyAmount); i++) {
                let facultyName = await contracts[1].getFacultyName(i);
                if (facultyName !== "") {
                    facultyNames.push(facultyName);
                    facultyIDs.push(i);
                }
            }
            ReactDOM.render(
                <React.StrictMode>
                    <AddDepartment departmentContract={contracts[0]} facultyContract={contracts[1]}
                                   rolesContract={contracts[2]} facultyNames={facultyNames}/>
                </React.StrictMode>,
                document.getElementById('root')
            );
        }

        return (
            <button onClick={addDepartmentHandler} className='cta-button create-button'>
                Add New Department
            </button>
        )
    }

    function addInstructorButton() {
        async function addInstructorHandler() {
            const contracts = await getContracts(false, true, false, true, false, true, false);
            const facultyAmount = await contracts[1].getTotalSupply();
            let facultyNames = [];
            let facultyIDs = [];
            for (let i = 1; i <= Number(facultyAmount); i++) {
                let facultyName = await contracts[1].getFacultyName(i);
                if (facultyName !== "") {
                    facultyNames.push(facultyName);
                    facultyIDs.push(i);
                }
            }
            ReactDOM.render(
                <React.StrictMode>
                    <AddInstructor departmentContract={contracts[0]} facultyContract={contracts[1]}
                                   rolesContract={contracts[2]} facultyNames={facultyNames}/>
                </React.StrictMode>,
                document.getElementById('root')
            );
        }

        return (
            <button onClick={addInstructorHandler} className='cta-button create-button'>
                Add New Instructor
            </button>
        )
    }

    function addStudentButton() {
        async function addStudentHandler() {
            const contracts = await getContracts(false, true, false, true, false, true, false);
            const facultyAmount = await contracts[1].getTotalSupply();
            let facultyNames = [];
            let facultyIDs = [];
            for (let i = 1; i <= Number(facultyAmount); i++) {
                let facultyName = await contracts[1].getFacultyName(i);
                if (facultyName !== "") {
                    facultyNames.push(facultyName);
                    facultyIDs.push(i);
                }
            }
            ReactDOM.render(
                <React.StrictMode>
                    <AddStudent departmentContract={contracts[0]} facultyContract={contracts[1]}
                                rolesContract={contracts[2]} facultyNames={facultyNames}/>
                </React.StrictMode>,
                document.getElementById('root')
            );
        }

        return (
            <button onClick={addStudentHandler} className='cta-button create-button'>
                Add New Student
            </button>
        )
    }

    function mintDiplomaButton() {
        async function readDiplomaRequestsHandler() {
            const contracts = await getContracts(false, true, true, false, true, true, true);
            let requests = await contracts[2].getDiplomaRequests();
            let rolesContract = contracts[3];
            let account = contracts[4];
            let isRector = await rolesContract.hasRectorRole(account)
            if (!isRector) {
                alert(`This Account: ${account} does not have Rector Permisions`)
                return;
            }
            let studentAddresses = [];
            let diplomaLinks = [];
            let requestorDepartments = [];
            let indexes = [];
            for (var i = 0; i < requests.length; i++) {
                if (requests[i].atRector) {
                    if (!requests[i].minted) {
                        studentAddresses.push(requests[i].studentAddress)
                        diplomaLinks.push(requests[i].diplomaLink)
                        let totalSupply = await contracts[0].getTotalSupply()
                        for (var j = 1; j <= totalSupply; j++) {
                            let owner = await contracts[0].ownerOf(j)
                            if (requests[i].requestorDepartment == owner) {
                                let name = await contracts[0].getDepartmentName(j)
                                requestorDepartments.push(name)
                            }
                        }
                        indexes.push(i)
                    }
                }
            }
            ReactDOM.render(
                <React.StrictMode>
                    <MintDiploma requests={requests}
                                 studentAddresses={studentAddresses}
                                 diplomaLinks={diplomaLinks}
                                 requestorDepartments={requestorDepartments}
                                 indexes={indexes}
                                 requestContract={contracts[2]}//To make minted=true
                                 diplomaContract={contracts[1]}//To mint
                    />
                </React.StrictMode>,
                document.getElementById('root')
            );
        }

        return (
            <button onClick={readDiplomaRequestsHandler} className='cta-button create-button'>
                Approve Diploma
            </button>
        )
    }

    function mintCourseButton() {
        async function readCourseRequestsHandler() {
            const contracts = await getContracts(true, true, false, false, true, true, true);
            let requests = await contracts[2].getCourseRequests();
            let rolesContract = contracts[3];
            let account = contracts[4];
            let isRector = await rolesContract.hasRectorRole(account)
            if (!isRector) {
                alert(`This Account: ${account} does not have Rector Permisions`)
                return;
            }
            let instructorAddresses = [];
            let courseLinks = [];
            let requestorDepartments = [];
            let indexes = [];
            for (var i = 0; i < requests.length; i++) {
                if (requests[i].atRector) {
                    if (!requests[i].minted) {
                        instructorAddresses.push(requests[i].instructorAddress)
                        courseLinks.push(requests[i].courseLink)
                        let totalSupply = await contracts[1].getTotalSupply()
                        for (var j = 1; j <= totalSupply; j++) {
                            let owner = await contracts[1].ownerOf(j)
                            if (requests[i].requestorDepartment == owner) {
                                let name = await contracts[1].getDepartmentName(j)
                                requestorDepartments.push(name)
                            }
                        }
                        indexes.push(i)
                    }
                }
            }
            ReactDOM.render(
                <React.StrictMode>
                    <MintCourse  requests={requests}
                                 instructorAddresses={instructorAddresses}
                                 courseLinks={courseLinks}
                                 requestorDepartments={requestorDepartments}
                                 indexes={indexes}
                                 requestContract={contracts[2]}//To make minted=true
                                 courseContract={contracts[0]}//To mint
                    />
                </React.StrictMode>,
                document.getElementById('root')
            );
        }

        return (
            <button onClick={readCourseRequestsHandler} className='cta-button create-button'>
                Approve Course
            </button>
        )
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////// DELETE FUNCTIONS ///////////////////////////////////////////////////////////////
    function removeInstructorButton() {
        async function removeInstructorHandler() {
            const contracts = await getContracts(false, true, false, true, false, true, false);
            const facultyAmount = await contracts[1].getTotalSupply();
            let facultyNames = [];
            let facultyIDs = [];
            for (let i = 1; i <= Number(facultyAmount); i++) {
                let facultyName = await contracts[1].getFacultyName(i);
                if (facultyName !== "") {
                    facultyNames.push(facultyName);
                    facultyIDs.push(i);
                }
            }
            ReactDOM.render(
                <React.StrictMode>
                    <RemoveInstructor departmentContract={contracts[0]} facultyContract={contracts[1]}
                                      rolesContract={contracts[2]} facultyNames={facultyNames}/>
                </React.StrictMode>,
                document.getElementById('root')
            );
        }

        return (
            <button onClick={removeInstructorHandler} className='cta-button delete-button'>
                Remove Instructor
            </button>
        )
    }

    function removeStudentButton() {
        async function removeStudentHandler() {
            const contracts = await getContracts(false, true, false, true, false, true, false);
            const facultyAmount = await contracts[1].getTotalSupply();
            let facultyNames = [];
            let facultyIDs = [];
            for (let i = 1; i <= Number(facultyAmount); i++) {
                let facultyName = await contracts[1].getFacultyName(i);
                if (facultyName !== "") {
                    facultyNames.push(facultyName);
                    facultyIDs.push(i);
                }
            }
            ReactDOM.render(
                <React.StrictMode>
                    <RemoveStudent departmentContract={contracts[0]} facultyContract={contracts[1]}
                                   rolesContract={contracts[2]} facultyNames={facultyNames}/>
                </React.StrictMode>,
                document.getElementById('root')
            );
        }

        return (
            <button onClick={removeStudentHandler} className='cta-button delete-button'>
                Remove Student
            </button>
        )
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    return (
        <div className='main-app'>
            <div className='create-operations'>
                {addFacultyButton()}
                {addDepartmentButton()}
                {addInstructorButton()}
                {addStudentButton()}
                {mintDiplomaButton()}
                {mintCourseButton()}
            </div>
            <div className='read-operations'>
                {checkDiplomaButton()}
                {checkCourseButton()}
                {checkFacultyButton()}
                {checkDepartmentButton()}
                {checkInstructorButton()}
                {checkStudentButton()}
            </div>
            <div className='delete-operations'>
                {removeInstructorButton()}
                {removeStudentButton()}
            </div>
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
        if (department) {
            const departmentContract = new ethers.Contract(departmentAddress, departmentAbi, signer);
            contracts.push(departmentContract)
        }
        if (diploma) {
            const diplomaContract = new ethers.Contract(diplomaAddress, diplomaAbi, signer);
            contracts.push(diplomaContract)
        }
        if (faculty) {
            const facultyContract = new ethers.Contract(facultyAddress, facultyAbi, signer);
            contracts.push(facultyContract)
        }
        if (request) {
            const requestContract = new ethers.Contract(requestAddress, requestAbi, signer);
            contracts.push(requestContract)
        }
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

function removeOptions(selectElement) {
    var i, L = selectElement.options.length - 1;
    for (i = L; i >= 0; i--) {
        selectElement.remove(i);
    }
}

export default App;