import React, {useEffect} from 'react';
import {useState} from 'react';
import './App.css';
import course from '../abis/Course.json';
import department from '../abis/Department.json';
import diploma from '../abis/Diploma.json';
import faculty from '../abis/Faculty.json';
import {ethers} from 'ethers';
import ReactDOM from "react-dom";
import {render} from "@testing-library/react";

const courseAddress = "0x4aBe37dE0CEd9304b2Db82e11991668f88F005B4";
const departmentAddress = "0x752E3382cAccbbEF54d162e559B00b2dB6246945";
const diplomaAddress = "0x2a5E4BF1aF54ac1E1b51a685d5dfBda71E6345Fc";
const facultyAddress = "0x45D11B7A1ac6b37203E7ef69286309c75214D5Cf";
const requestAddress = "0xEBD720B5a6fad8c79036a2Eaad159B482D04ff8F";


const courseAbi = course.abi;
const departmentAbi = department.abi;
const diplomaAbi = diploma.abi;
const facultyAbi = faculty.abi;

function returnButton(){
    ReactDOM.render(
        <React.StrictMode>
            <App/>
        </React.StrictMode>,
        document.getElementById('root')
    );
}
/////////////////////////////////////// READ FUNCTIONS /////////////////////////////////////////////////////////////////
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
            <button onClick={(e)=> returnButton()}>Geri</button>
        </div>
    );
}
function FacultyList(props){//TODO Organise table looks
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
            <button onClick={(e)=> returnButton()}>Geri</button>
        </div>
    );
}
function DepartmentList(props){
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
            <button onClick={(e)=> returnButton()}>Geri</button>
        </div>
    );
}
function InstructorList(props){
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
            <button onClick={(e)=> returnButton()}>Geri</button>
        </div>
    );
}
function StudentList(props){
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
            <button onClick={(e)=> returnButton()}>Geri</button>
        </div>
    );
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////// CREATE FUNCTIONS ///////////////////////////////////////////////////////////////
function MintDiploma(props) {
    const [address, setAddress] = useState("");
    const [link, setLink] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        await props.diplomaContract.mint(link, address)
        await props.courseContract.grantGraduatedRole(address)
        await props.departmentContract.grantGraduatedRole(address)
        await props.facultyContract.grantGraduatedRole(address)
        //TODO write fail alert messages
        alert(`The Graduate ${address} Has The Diploma ${link} Now`)
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>Enter Diploma Link:
                <input
                    type="text"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                />
            </label>
            <label>Enter Student Address:
                <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />
            </label>
            <input type="submit"/>
            <button onClick={(e)=> returnButton()}>Geri</button>
        </form>
    )
}
function AddStudent(props){
    const [address, setAddress] = useState("");
    let facultyID = "";
    let departmentID = "";
    async function setFacultyName(value){
        facultyID = await props.facultyContract.getFacultyID(value)
        let departmentAddressList = await props.facultyContract.getDepartments(facultyID)
        let departmentListTemp = [];
        for(let i = 0; i<departmentAddressList.length; i++){
            const totalSupplyDepartment = await props.departmentContract.getTotalSupply();
            for(let j = 1; j<=totalSupplyDepartment; j++){
                let departmentAddress = await props.departmentContract.ownerOf(j);
                if(departmentAddress == departmentAddressList[i]){
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
        for(let i = 0; i<departmentListTemp.length; i++){
            let newOption = new Option(departmentListTemp[i]);
            departmentSelect.add(newOption, undefined)
        }
        departmentSelect.hidden=false;
    }
    async function setDepartmentName(value) {
        departmentID = await props.departmentContract.getDepartmentID(value)
        const addressForm = document.getElementById("addressForm")
        addressForm.hidden=false
        const button = document.getElementById("button")
        button.hidden=false
    }
    const handleSubmit = async (event) => {
        //TODO select'ten sonra başka yerlere tıklayınca değeri kaybediyor çünkü onChange
        event.preventDefault();
        let allStudents = await props.departmentContract.getStudentRoles()
        if(allStudents.indexOf(address)>-1){//existance check
            alert(`${address} is already a student`)
            return;
        }
        let departmentStudents = await props.departmentContract.getStudents(departmentID)
        let temp = departmentStudents.slice()
        temp.push(address)
        //TODO tek transaction'a toplanabilir
        await props.departmentContract.setStudents(departmentID,temp)
        await props.courseContract.grantStudentRole(address)
        await props.departmentContract.grantStudentRole(address)
        await props.diplomaContract.grantStudentRole(address)
        await props.facultyContract.grantStudentRole(address)
        //TODO write fail alert messages
        alert(`${address} is a Student Now`)
        returnButton()
    }
    return (
        <form onSubmit={handleSubmit} >

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
            <button onClick={(e)=> returnButton()}>Geri</button>
        </form>
    )
}
function AddFaculty(props){
    const [address, setAddress] = useState("");
    const [facultyName, setFacultyName] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        let allFaculties = await props.facultyContract.getFacultyRoles();
        if(allFaculties.indexOf(address)>-1){
            alert(`${address} has the Faculty permissions already`)
            return;
        }
        //TODO tek transaction'a toplanabilir
        await props.facultyContract.mint(facultyName, address)
        await props.courseContract.grantFacultyRole(address)
        await props.departmentContract.grantFacultyRole(address)
        await props.diplomaContract.grantFacultyRole(address)
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
            <button onClick={(e)=> returnButton()}>Geri</button>
        </form>
    )
}
function AddDepartment(props){
    const [departmentAddress, setDepartmentAddress] = useState("");
    const [departmentName, setDepartmentName] = useState("");
    // const [facultyName, setFacultyName] = useState("");
    let facultyID;
    async function setFacultyName(value){
        facultyID = await props.facultyContract.getFacultyID(value)
        let form = document.getElementById("enterName")
        form.hidden = false;
        form = document.getElementById("enterAddress")
        form.hidden = false;
        form = document.getElementById("button")
        form.hidden = false;
    }
    const handleSubmit = async (event) => {
        //TODO select'ten sonra başka yerlere tıklayınca değeri kaybediyor çünkü onChange
        event.preventDefault();
        let allDepartments = await props.departmentContract.getDepartmentRoles();
        if(allDepartments.indexOf(departmentAddress)>-1){
            alert(`${departmentAddress} has the Department permissions already`)
            return
        }
        const facultyAddress = await props.facultyContract.ownerOf(facultyID)
        const departments = await props.facultyContract.getDepartments(facultyID);
        var departmentsTemp = departments.slice();
        departmentsTemp.push(departmentAddress)
        //TODO tek transaction'a toplanabilir
        await props.departmentContract.mint(departmentName,departmentAddress,facultyAddress)
        await props.facultyContract.setDepartments(facultyID, departmentsTemp)
        await props.courseContract.grantDepartmentRole(departmentAddress)
        await props.diplomaContract.grantDepartmentRole(departmentAddress)
        await props.facultyContract.grantDepartmentRole(departmentAddress)
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
            <button onClick={(e)=> returnButton()}>Geri</button>
        </form>
    )
}
function AddInstructor(props){
    const [address, setAddress] = useState("");
    let facultyID = "";
    let departmentID = "";
    async function setFacultyName(value){
        facultyID = await props.facultyContract.getFacultyID(value)
        let departmentAddressList = await props.facultyContract.getDepartments(facultyID)
        let departmentListTemp = [];
        for(let i = 0; i<departmentAddressList.length; i++){
            const totalSupplyDepartment = await props.departmentContract.getTotalSupply();
            for(let j = 1; j<=totalSupplyDepartment; j++){
                let departmentAddress = await props.departmentContract.ownerOf(j);
                if(departmentAddress == departmentAddressList[i]){
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
        for(let i = 0; i<departmentListTemp.length; i++){
            let newOption = new Option(departmentListTemp[i]);
            departmentSelect.add(newOption, undefined)
        }
        departmentSelect.hidden=false;
    }
    async function setDepartmentName(value) {
        departmentID = await props.departmentContract.getDepartmentID(value)
        const addressForm = document.getElementById("addressForm")
        addressForm.hidden=false
        const button = document.getElementById("button")
        button.hidden=false
    }
    const handleSubmit = async (event) => {
        //TODO select'ten sonra başka yerlere tıklayınca değeri kaybediyor çünkü onChange
        event.preventDefault();

        let allInstructors = await props.departmentContract.getInstructorRoles()
        if(allInstructors.indexOf(address)>-1){//existance check
            alert(`${address} is already a instructor`)
            return;
        }
        let departmentInstructors = await props.departmentContract.getInstructors(departmentID)
        let temp = departmentInstructors.slice()
        temp.push(address)
        //TODO tek transaction'a toplanabilir
        await props.departmentContract.setInstructors(departmentID,temp)
        await props.courseContract.grantInstructorRole(address)
        await props.departmentContract.grantInstructorRole(address)
        await props.diplomaContract.grantInstructorRole(address)
        await props.facultyContract.grantInstructorRole(address)
        //TODO write fail alert messages
        alert(`${address} is a Instructor Now`)
        returnButton()
    }

    return (
        <form onSubmit={handleSubmit} >

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
            <button onClick={(e)=> returnButton()}>Geri</button>
        </form>
    )
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////// DELETE FUNCTIONS ///////////////////////////////////////////////////////////////
function RemoveFaculty(props){
    const [facultyName, setFacultyName] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        let id = await props.facultyContract.getFacultyID(facultyName);
        let address = await props.facultyContract.ownerOf(id);

        //TODO tek transaction'a toplanabilir
        await props.facultyContract.burn(facultyName)
        await props.courseContract.revokeFacultyRole(address)
        await props.departmentContract.revokeFacultyRole(address)
        await props.diplomaContract.revokeFacultyRole(address)
        //TODO write fail alert messages
        alert(`${facultyName} has removed`)
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
            <input type="submit"/>
            <button onClick={(e)=> returnButton()}>Geri</button>
        </form>
    )
}
function RemoveDepartment(props){
    const [departmentName, setDepartmentName] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        let id = await props.departmentContract.getDepartmentID(departmentName);
        let address = await props.departmentContract.ownerOf(id);

        //TODO tek transaction'a toplanabilir
        await props.departmentContract.burn(departmentName)
        await props.courseContract.revokeDepartmentRole(address)
        await props.diplomaContract.revokeDepartmentRole(address)
        await props.facultyContract.revokeDepartmentRole(address)
        //TODO write fail alert messages
        alert(`${departmentName} has removed`)
    }
    return (
        <form onSubmit={handleSubmit}>
            <label>Enter Department Name:
                <input
                    type="text"
                    value={departmentName}
                    onChange={(e) => setDepartmentName(e.target.value)}
                />
            </label>
            <input type="submit"/>
            <button onClick={(e)=> returnButton()}>Geri</button>
        </form>
    )
}
function RemoveInstructor(props){
    const [address, setAddress] = useState("");
    let facultyID = "";
    let departmentID = "";
    async function setFacultyName(value){
        facultyID = await props.facultyContract.getFacultyID(value)
        let departmentAddressList = await props.facultyContract.getDepartments(facultyID)
        let departmentListTemp = [];
        for(let i = 0; i<departmentAddressList.length; i++){
            const totalSupplyDepartment = await props.departmentContract.getTotalSupply();
            for(let j = 1; j<=totalSupplyDepartment; j++){
                let departmentAddress = await props.departmentContract.ownerOf(j);
                if(departmentAddress == departmentAddressList[i]){
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
        for(let i = 0; i<departmentListTemp.length; i++){
            let newOption = new Option(departmentListTemp[i]);
            departmentSelect.add(newOption, undefined)
        }
        departmentSelect.hidden=false;
    }
    async function setDepartmentName(value) {
        departmentID = await props.departmentContract.getDepartmentID(value)
        const addressForm = document.getElementById("addressForm")
        addressForm.hidden=false
        const button = document.getElementById("button")
        button.hidden=false
    }
    const handleSubmit = async (event) => {
        //TODO select'ten sonra başka yerlere tıklayınca değeri kaybediyor çünkü onChange
        event.preventDefault();
        let allInstructors = await props.departmentContract.getInstructorRoles()
        if(allInstructors.indexOf(address)<=-1){//existance check
            alert(`${address} is not an instructor`)
            return;
        }
        let departmentInstructors = await props.departmentContract.getInstructors(departmentID)
        if(departmentInstructors.indexOf(address)<=-1){
            alert(`${address} is not an instructor in this department`)
            return;
        }
        let temp = departmentInstructors.slice()
        temp = temp.filter(e => e !== address);
        //TODO tek transaction'a toplanabilir
        await props.departmentContract.setInstructors(departmentID,temp)
        await props.courseContract.revokeInstructorRole(address)
        await props.departmentContract.revokeInstructorRole(address)
        await props.diplomaContract.revokeInstructorRole(address)
        await props.facultyContract.revokeInstructorRole(address)
        //TODO write fail alert messages
        alert(`${address} has removed`)
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
            <button onClick={(e)=> returnButton()}>Geri</button>
        </form>
    )
}
function RemoveStudent(props){
    const [address, setAddress] = useState("");
    let facultyID = "";
    let departmentID = "";
    async function setFacultyName(value){
        facultyID = await props.facultyContract.getFacultyID(value)
        let departmentAddressList = await props.facultyContract.getDepartments(facultyID)
        let departmentListTemp = [];
        for(let i = 0; i<departmentAddressList.length; i++){
            const totalSupplyDepartment = await props.departmentContract.getTotalSupply();
            for(let j = 1; j<=totalSupplyDepartment; j++){
                let departmentAddress = await props.departmentContract.ownerOf(j);
                if(departmentAddress == departmentAddressList[i]){
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
        for(let i = 0; i<departmentListTemp.length; i++){
            let newOption = new Option(departmentListTemp[i]);
            departmentSelect.add(newOption, undefined)
        }
        departmentSelect.hidden=false;
    }
    async function setDepartmentName(value) {
        departmentID = await props.departmentContract.getDepartmentID(value)
        const addressForm = document.getElementById("addressForm")
        addressForm.hidden=false
        const button = document.getElementById("button")
        button.hidden=false
    }
    const handleSubmit = async (event) => {
        //TODO select'ten sonra başka yerlere tıklayınca değeri kaybediyor çünkü onChange
        event.preventDefault();
        let allStudents = await props.departmentContract.getStudentRoles()
        if(allStudents.indexOf(address)<=-1){//existance check
            alert(`${address} is not an student`)
            return;
        }
        let departmentStudents = await props.departmentContract.getStudents(departmentID)
        if(departmentStudents.indexOf(address)<=-1){
            alert(`${address} is not an student in this department`)
            return;
        }
        let temp = departmentStudents.slice()
        temp = temp.filter(e => e !== address);
        console.log(allStudents)
        console.log(departmentStudents)
        //TODO tek transaction'a toplanabilir
        await props.departmentContract.setStudents(departmentID,temp)
        await props.courseContract.revokeStudentRole(address)
        await props.departmentContract.revokeStudentRole(address)
        await props.diplomaContract.revokeStudentRole(address)
        await props.facultyContract.revokeStudentRole(address)
        //TODO write fail alert messages
        alert(`${address} has removed`)
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
            <button onClick={(e)=> returnButton()}>Geri</button>
        </form>
    )
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function App() {

/////////////////////////////////////// READ FUNCTIONS /////////////////////////////////////////////////////////////////
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
    function checkFacultyButton(){
        async function checkFacultyHandler() {
            const contracts = await getContracts(false, false, false, true);
            const facultyContract = contracts[0]
            const totalSupply = await facultyContract.getTotalSupply();
            let facultyNames = [];
            for(var i = 1; i<=totalSupply; i++){
                let facultyName = await facultyContract.getFacultyName(i);
                if(facultyName !== ""){
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
            for(var i = 1; i<=totalSupply; i++){
                let departmentName = await departmentContract.getDepartmentName(i);
                if(departmentName !== ""){
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
            const contracts = await getContracts(true, false, false, false);
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
            const contracts = await getContracts(true, false, false, false);
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////// CREATE FUNCTIONS ///////////////////////////////////////////////////////////////
    function mintDiplomaButton() {

        async function mintDiplomaHandler() {
            const contracts = await getContracts(true, true, true, true);
            ReactDOM.render(
                <React.StrictMode>
                    <MintDiploma courseContract={contracts[0]} departmentContract={contracts[1]} diplomaContract={contracts[2]} facultyContract={contracts[3]}/>
                </React.StrictMode>,
                document.getElementById('root')
            );
        }
        return (
            <button onClick={mintDiplomaHandler} className='cta-button create-button'>
                Mint New Diploma
            </button>
        )
    }
    function addStudentButton() {
        async function addStudentHandler() {
            const contracts = await getContracts(true, true, true, true);
            const facultyAmount = await contracts[3].getTotalSupply();
            let facultyNames = [];
            let facultyIDs = [];
            for(let i = 1; i<=Number(facultyAmount); i++){
                let facultyName = await contracts[3].getFacultyName(i);
                if(facultyName !== ""){
                    facultyNames.push(facultyName);
                    facultyIDs.push(i);
                }
            }
            ReactDOM.render(
                <React.StrictMode>
                    <AddStudent courseContract={contracts[0]} departmentContract={contracts[1]} diplomaContract={contracts[2]} facultyContract={contracts[3]} facultyNames={facultyNames}/>
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
    function addFacultyButton() {
        async function addFacultyHandler() {
            const contracts = await getContracts(true, true, true, true);
            ReactDOM.render(
                <React.StrictMode>
                    <AddFaculty courseContract={contracts[0]} departmentContract={contracts[1]} diplomaContract={contracts[2]} facultyContract={contracts[3]}/>
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
            const contracts = await getContracts(true, true, true, true);
            const facultyAmount = await contracts[3].getTotalSupply();
            let facultyNames = [];
            let facultyIDs = [];
            for(let i = 1; i<=Number(facultyAmount); i++){
                let facultyName = await contracts[3].getFacultyName(i);
                if(facultyName !== ""){
                    facultyNames.push(facultyName);
                    facultyIDs.push(i);
                }
            }
            ReactDOM.render(
                <React.StrictMode>
                    <AddDepartment courseContract={contracts[0]} departmentContract={contracts[1]} diplomaContract={contracts[2]} facultyContract={contracts[3]} facultyNames={facultyNames}/>
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
            const contracts = await getContracts(true, true, true, true);
            const facultyAmount = await contracts[3].getTotalSupply();
            let facultyNames = [];
            let facultyIDs = [];
            for(let i = 1; i<=Number(facultyAmount); i++){
                let facultyName = await contracts[3].getFacultyName(i);
                if(facultyName !== ""){
                    facultyNames.push(facultyName);
                    facultyIDs.push(i);
                }
            }
            ReactDOM.render(
                <React.StrictMode>
                    <AddInstructor courseContract={contracts[0]} departmentContract={contracts[1]} diplomaContract={contracts[2]} facultyContract={contracts[3]} facultyNames={facultyNames}/>
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////// DELETE FUNCTIONS ///////////////////////////////////////////////////////////////
    function removeFacultyButton() {
        async function removeFacultyHandler() {
            const contracts = await getContracts(true, true, true, true);
            ReactDOM.render(
                <React.StrictMode>
                    <RemoveFaculty courseContract={contracts[0]} departmentContract={contracts[1]} diplomaContract={contracts[2]} facultyContract={contracts[3]}/>
                </React.StrictMode>,
                document.getElementById('root')
            );
        }
        return (
            <button onClick={removeFacultyHandler} className='cta-button delete-button'>
                Remove Faculty
            </button>
        )
    }
    function removeDepartmentButton() {
        async function removeDepartmentHandler() {
            const contracts = await getContracts(true, true, true, true);
            ReactDOM.render(
                <React.StrictMode>
                    <RemoveDepartment courseContract={contracts[0]} departmentContract={contracts[1]} diplomaContract={contracts[2]} facultyContract={contracts[3]}/>
                </React.StrictMode>,
                document.getElementById('root')
            );
        }
        return (
            <button onClick={removeDepartmentHandler} className='cta-button delete-button'>
                Remove Department
            </button>
        )
    }
    function removeInstructorButton() {
        async function removeInstructorHandler() {
            const contracts = await getContracts(true, true, true, true);
            const facultyAmount = await contracts[3].getTotalSupply();
            let facultyNames = [];
            let facultyIDs = [];
            for(let i = 1; i<=Number(facultyAmount); i++){
                let facultyName = await contracts[3].getFacultyName(i);
                if(facultyName !== ""){
                    facultyNames.push(facultyName);
                    facultyIDs.push(i);
                }
            }
            ReactDOM.render(
                <React.StrictMode>
                    <RemoveInstructor courseContract={contracts[0]} departmentContract={contracts[1]} diplomaContract={contracts[2]} facultyContract={contracts[3]} facultyNames={facultyNames}/>
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
            const contracts = await getContracts(true, true, true, true);
            const facultyAmount = await contracts[3].getTotalSupply();
            let facultyNames = [];
            let facultyIDs = [];
            for(let i = 1; i<=Number(facultyAmount); i++){
                let facultyName = await contracts[3].getFacultyName(i);
                if(facultyName !== ""){
                    facultyNames.push(facultyName);
                    facultyIDs.push(i);
                }
            }
            ReactDOM.render(
                <React.StrictMode>
                    <RemoveStudent courseContract={contracts[0]} departmentContract={contracts[1]} diplomaContract={contracts[2]} facultyContract={contracts[3]} facultyNames={facultyNames}/>
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
            </div>
            <div className='read-operations'>
                {checkDiplomaButton()}
                {checkFacultyButton()}
                {checkDepartmentButton()}
                {checkInstructorButton()}
                {checkStudentButton()}
            </div>
            <div className='delete-operations'>
                {/*{removeFacultyButton()}*/}
                {/*{removeDepartmentButton()}*/}
                {removeInstructorButton()}
                {removeStudentButton()}
            </div>
        </div>
    )
}
async function getContracts(course = false, department = false, diploma = false, faculty = false) {
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
        return contracts
    }
}
function removeOptions(selectElement) {
    var i, L = selectElement.options.length - 1;
    for(i = L; i >= 0; i--) {
        selectElement.remove(i);
    }
}
export default App;