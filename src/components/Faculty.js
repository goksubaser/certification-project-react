import React, {useEffect} from 'react';
import {ethers} from 'ethers';
import ReactDOM from "react-dom";

import './App.css';

import department from '../abis/Department.json';
import faculty from '../abis/Faculty.json';
import request from '../abis/Request.json';
import env from '../env.json';
import {tab} from "@testing-library/user-event/dist/tab";

const departmentAddress = env.departmentAddress
const facultyAddress = env.facultyAddress
const requestAddress = env.requestAddress

const departmentAbi = department.abi;
const facultyAbi = faculty.abi;
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
function ReadDiplomaRequest(props) {
    async function approve(index){
        let buttonIndex = index.slice(index.indexOf("e")+1)
        let request = props.requests[Number(props.indexes[buttonIndex])]
        await props.requestContract.approveDiplomaRequest(request)
        returnButton()
    }
    async function disapprove(index){
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
        table.appendChild(tbody)
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
            var newRow = tbody.insertRow(i+1)
            var cell0 = newRow.insertCell(0);
            var cell1 = newRow.insertCell(1);
            var cell2 = newRow.insertCell(2);
            var cell3 = newRow.insertCell(3);
            var cell4 = newRow.insertCell(4);
            var approveButton = document.createElement("button")
            approveButton.setAttribute("class", "approve-button")
            approveButton.setAttribute("type", "button")
            approveButton.setAttribute("id", "approve"+i)
            approveButton.onclick = function () {approve(this.id)}
            approveButton.innerHTML = "Approve"
            cell3.appendChild(approveButton)
            var disapproveButton = document.createElement("button")
            disapproveButton.setAttribute("class", "disapprove-button")
            disapproveButton.setAttribute("type", "button")
            disapproveButton.setAttribute("id", "disapprove"+i)
            disapproveButton.onclick = function () {disapprove(this.id)}
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
        </table>
        <tr id="buttons">
            <button onClick={(e) => returnButton()}>Back</button>
            <button onClick={(e) => createTable()}>Show Requests</button>
        </tr>
        </body>
    );
}
function ReadCourseRequest(props) {
    async function approve(index){
        let buttonIndex = index.slice(index.indexOf("e")+1)
        let request = props.requests[Number(props.indexes[buttonIndex])]
        await props.requestContract.approveCourseRequest(request)
        returnButton()
    }
    async function disapprove(index){
        let buttonIndex = index.slice(index.indexOf("e")+1)
        let request = props.requests[Number(props.indexes[buttonIndex])]
        await props.requestContract.disapproveCourseRequest(request)
        returnButton()
    }
    function createTable() {
        var table = document.getElementById("courseRequestTable");
        table.removeChild(document.getElementById("tableBody"))
        let tbody = document.createElement("tbody")
        tbody.setAttribute("id", "tableBody")
        table.appendChild(tbody)

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
            var newRow = tbody.insertRow(i+1)
            var cell0 = newRow.insertCell(0);
            var cell1 = newRow.insertCell(1);
            var cell2 = newRow.insertCell(2);
            var cell3 = newRow.insertCell(3);
            var cell4 = newRow.insertCell(4);
            var approveButton = document.createElement("button")
            approveButton.setAttribute("class", "approve-button")
            approveButton.setAttribute("type", "button")
            approveButton.setAttribute("id", "approve"+i)
            approveButton.onclick = function () {approve(this.id)}
            approveButton.innerHTML = "Approve"
            cell3.appendChild(approveButton)
            var disapproveButton = document.createElement("button")
            disapproveButton.setAttribute("class", "disapprove-button")
            disapproveButton.setAttribute("type", "button")
            disapproveButton.setAttribute("id", "disapprove"+i)
            disapproveButton.onclick = function () {disapprove(this.id)}
            disapproveButton.innerHTML = "Disapprove"
            cell4.appendChild(disapproveButton)
            cell0.innerHTML = props.instructorAddresses[i];
            cell1.innerHTML = props.courseLinks[i];
            cell2.innerHTML = props.requestorDepartments[i];
        }
    }

    return (
        <body>
        <table id="courseRequestTable">
            <tbody id="tableBody"></tbody>
        </table>
        <tr id="buttons">
            <button onClick={(e) => returnButton()}>Back</button>
            <button onClick={(e) => createTable()}>Show Requests</button>
        </tr>
        </body>
    );
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function App() {
/////////////////////////////////////// READ FUNCTIONS /////////////////////////////////////////////////////////////////
    function readDiplomaRequestsButton() {
        async function readDiplomaRequestsHandler() {
            const contracts = await getContracts(false, true, false, true, true, false, true);
            let facultyContract = contracts[1];
            let requests = await contracts[2].getDiplomaRequests();
            let account = contracts[3];
            let facultyID = 0;
            let totalSupply = await facultyContract.getTotalSupply()
            for (var i = 1; i <= totalSupply; i++) {
                let owner = await facultyContract.ownerOf(i)
                if (owner.toUpperCase() === account.toUpperCase()) {
                    facultyID = i;
                    break;
                }
            }
            if (facultyID === 0) {
                alert(`${account} is not a Faculty`)
                return;
            }
            let studentAddresses = [];
            let diplomaLinks = [];
            let requestorDepartments = [];
            let indexes = [];
            for (var i = 0; i < requests.length; i++) {
                if (!requests[i].atRector) {
                    let departments = await facultyContract.getDepartments(facultyID)
                    if (departments.indexOf(requests[i].requestorDepartment) > -1) {
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
                    <ReadDiplomaRequest requests={requests}
                                       studentAddresses={studentAddresses}
                                       diplomaLinks={diplomaLinks}
                                       requestorDepartments={requestorDepartments}
                                       indexes={indexes}
                                       requestContract={contracts[2]}
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
    function readCourseRequestsButton() {
        async function readCourseRequestsHandler() {

            const contracts = await getContracts(false, true, false, true, true, false, true);
            let facultyContract = contracts[1];
            let requests = await contracts[2].getCourseRequests();
            let account = contracts[3];
            let facultyID = 0;
            let totalSupply = await facultyContract.getTotalSupply()
            for (var i = 1; i <= totalSupply; i++) {
                let owner = await facultyContract.ownerOf(i)
                if (owner.toUpperCase() === account.toUpperCase()) {
                    facultyID = i;
                    break;
                }
            }
            if (facultyID === 0) {
                alert(`${account} is not a Faculty`)
                return;
            }
            let instructorAddresses = [];
            let courseLinks = [];
            let requestorDepartments = [];
            let indexes = [];
            for (var i = 0; i < requests.length; i++) {
                if (!requests[i].atRector) {
                    let departments = await facultyContract.getDepartments(facultyID)
                    if (departments.indexOf(requests[i].requestorDepartment) > -1) {
                        instructorAddresses.push(requests[i].instructorAddress)
                        courseLinks.push(requests[i].courseLink)
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
                    <ReadCourseRequest requests={requests}
                                       instructorAddresses={instructorAddresses}
                                       courseLinks={courseLinks}
                                       requestorDepartments={requestorDepartments}
                                       indexes={indexes}
                                       requestContract={contracts[2]}
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

    //Geçici fonksiyon test için
    function readDiplomaRequests() {

        async function createDiplomaHandler() {
            const contracts = await getContracts(false, false, false, false, true, false, false);
            let requests = await contracts[0].getDiplomaRequests();
            for (var i = 0; i < requests.length; i++) {
                console.log(requests[i])
            }
        }

        return (
            <button onClick={createDiplomaHandler} className='cta-button read-button'>
                Read Diploma Request
            </button>
        )
    }
    function readCourseRequests() {
        async function createDiplomaHandler() {
            const contracts = await getContracts(false, false, false, false, true, false, false);
            let requests = await contracts[0].getCourseRequests();
            for (var i = 0; i < requests.length; i++) {
                console.log(requests[i])
            }
        }

        return (
            <button onClick={createDiplomaHandler} className='cta-button read-button'>
                Read Course Request
            </button>
        )
    }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    return (
        <div className='main-app'>
            <div className='create-operations'>
                {readDiplomaRequestsButton()}
                {readCourseRequestsButton()}

            </div>
            <div className='read-operations'>
                {readDiplomaRequests()}
                {readCourseRequests()}

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
        if (department) {
            const departmentContract = new ethers.Contract(departmentAddress, departmentAbi, signer);
            contracts.push(departmentContract)
        }
        if (faculty) {
            const facultyContract = new ethers.Contract(facultyAddress, facultyAbi, signer);
            contracts.push(facultyContract)
        }
        if (request) {
            const requestContract = new ethers.Contract(requestAddress, requestAbi, signer);
            contracts.push(requestContract)
        }
        if (account) {
            const account = accounts[0];
            contracts.push(account)
        }
        return contracts
    }
}
export default App;