import './App.css';
import React from "react";
import {ethers} from "ethers";

import course from '../abis/Course.json';
import roles from '../abis/Roles.json';
import env from '../env.json';

import ReactDOM from "react-dom";

const courseAddress = env.courseAddress
const rolesAddress = env.rolesAddress

const courseAbi = course.abi;
const rolesAbi = roles.abi;

function returnButton() {
    ReactDOM.render(
        <React.StrictMode>
            <App/>
        </React.StrictMode>,
        document.getElementById('root')
    );
}

function ApplyCourse(props) {
    async function apply(index) {
        let buttonIndex = index.slice(index.indexOf("y")+1)
        let courseID = Number(props.openCourseIDs[buttonIndex])
        await props.courseContract.applyCourse(courseID)
        returnButton()
    }

    function createTable() {
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
        var cell4 = document.createElement("th")
        cell0.innerHTML = "Instructor Address";
        cell1.innerHTML = "Course Link";
        cell3.innerHTML = "Apply";
        newRow.appendChild(cell0)
        newRow.appendChild(cell1)
        newRow.appendChild(cell2)
        newRow.appendChild(cell3)
        for (var i = 0; i < props.openCourseIDs.length; i++) {
            var newRow = tbody.insertRow(i + 1)
            var cell0 = newRow.insertCell(0);
            var cell1 = newRow.insertCell(1);
            var cell2 = newRow.insertCell(2);
            var cell3 = newRow.insertCell(3);
            var applyButton = document.createElement("button")
            applyButton.setAttribute("class", "apply-button")
            applyButton.setAttribute("type", "button")
            applyButton.setAttribute("id", "apply" + i)
            applyButton.onclick = function () {
                apply(this.id)
            }
            applyButton.innerHTML = "Apply"
            cell3.appendChild(applyButton)
            cell0.innerHTML = props.instructorAddresses[i];
            cell1.innerHTML = props.openCourseLinks[i];
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

function ListCourse(props){

    function createTable() {
        var table = document.getElementById("courseRequestTable");
        table.removeChild(document.getElementById("tableBody"))

        let tbody = document.createElement("tbody")
        tbody.setAttribute("id", "tableBody")
        table.insertBefore(tbody, document.getElementById("buttons"))

        var newRow = tbody.insertRow(0)
        var cell0 = document.createElement("th")
        var cell1 = document.createElement("th")
        cell0.innerHTML = "Instructor Address";
        cell1.innerHTML = "Course Link";
        newRow.appendChild(cell0)
        newRow.appendChild(cell1)
        for (var i = 0; i < props.takenCourseLinks.length; i++) {
            var newRow = tbody.insertRow(i + 1)
            var cell0 = newRow.insertCell(0);
            var cell1 = newRow.insertCell(1);
            cell0.innerHTML = props.instructorAddresses[i];
            cell1.innerHTML = props.takenCourseLinks[i];
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

function App() {

    function applyCourseButton() {
        async function applyCourseHandler() {

            const contracts = await getContracts(true, false, false, false, false, true, true);
            let account = contracts[2];
            let isStudent = await contracts[1].hasStudentRole(account)
            if (!isStudent) {
                alert(`${account} is not a Student`)
                return;
            }
            let openCourseIDs = []; //only unfrozen courses
            let instructorAddresses = []; //only unfrozen courses
            let courseLinks = await contracts[0].getCourseLinks();//all courses
            let openCourseLinks = [];
            for (var i = 1; i <= courseLinks.length; i++) {
                let isFrozen = await contracts[0].getFrozen(i);
                if (!isFrozen) {//Course is frozen by instructor
                    let approvedStudents = await contracts[0].getApprovedStudents(i);
                    approvedStudents = approvedStudents.map(approvedStudent => approvedStudent.toLowerCase())
                    if(approvedStudents.indexOf(account)<=-1){//This account is already approved for the course
                        let appliedStudents = await contracts[0].getRequestOfStudents(i)
                        appliedStudents = appliedStudents.map(appliedStudent => appliedStudent.toLowerCase())
                        if(appliedStudents.indexOf(account)<=-1){//This account is already applied for the course
                            openCourseIDs.push(i)
                            instructorAddresses.push(await contracts[0].ownerOf(i))
                            openCourseLinks.push(courseLinks[i-1])
                        }
                    }
                }
            }
            ReactDOM.render(
                <React.StrictMode>
                    <ApplyCourse openCourseIDs={openCourseIDs}
                                 instructorAddresses={instructorAddresses}
                                 openCourseLinks={openCourseLinks}
                                 courseContract={contracts[0]}
                    />
                </React.StrictMode>,
                document.getElementById('root')
            );
        }

        return (
            <button onClick={applyCourseHandler} className='cta-button create-button'>
                Apply Courses
            </button>
        )
    }

    function listCourseButton() {

        async function listCourseHandler() {
            const contracts = await getContracts(true, false, false, false, false, true, true);
            let account = contracts[2];
            let isStudent = await contracts[1].hasStudentRole(account)
            if (!isStudent) {
                alert(`${account} is not a Student`)
                return;
            }
            let takenCourseIDs = await contracts[0].getTakesCourses(account)
            let instructorAddresses = [];
            let courseLinks = await contracts[0].getCourseLinks();
            let takenCourseLinks = []
            for(var i = 0; i<takenCourseIDs.length; i++){
                instructorAddresses.push(await contracts[0].ownerOf(takenCourseIDs[i]))
                takenCourseLinks.push(courseLinks[takenCourseIDs[i]-1])
            }
            ReactDOM.render(
                <React.StrictMode>
                    <ListCourse instructorAddresses={instructorAddresses}
                                 takenCourseLinks={takenCourseLinks}
                    />
                </React.StrictMode>,
                document.getElementById('root')
            );
        }

        return (
            <button onClick={listCourseHandler} className='cta-button read-button'>
                Courses Taken
            </button>
        )
    }

    return (
        <div className='main-app'>
            <div className='create-operations'>
                {applyCourseButton()}

            </div>
            <div className='read-operations'>
                {listCourseButton()}

            </div>
            <div className='delete-operations'></div>
        </div>
    );
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