import './App.css';
import React from "react";
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
        await props.courseContract.approveApplication(courseID,studentAddress)
        returnButton()

    }
    async function disapprove(index){
        let i = Number(index.slice(index.indexOf("i")+1, index.indexOf("j")))
        let j = Number(index.slice(index.indexOf("j")+1))
        let courseID = props.coursesGiven[i]
        let studentAddress = props.applications[i][j]
        console.log(courseID)
        console.log(studentAddress)
        // returnButton()
    }
    async function createTable() {
        console.log(props.applications)
        // let applicationAmount = props.applications.reduce((count, row) => count + row.length, 0)
        console.log(props.coursesGiven)
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
            <button onClick={readCourseRequestsHandler} className='cta-button create-button'>
                List Applications
            </button>
        )
    }

    return (
        <div className='main-app'>
            <div className='create-operations'>
                {readApplicationsButton()}
            </div>
            <div className='read-operations'>
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