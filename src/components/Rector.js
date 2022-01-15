import React, {useEffect} from 'react';
import {useState} from 'react';
import {useNavigate} from "react-router-dom";

import './App.css';
import Rector from './Rector.js';
import Faculty from './Faculty.js';
import Department from './Department.js';
import Instructor from './Instructor.js';
import Student from './Student.js';
import Graduated from './Graduated.js';
import NotRegistered from './NotRegistered.js';
import course from '../abis/Course.json';
import department from '../abis/Department.json';
import diploma from '../abis/Diploma.json';
import faculty from '../abis/Faculty.json';
import {ethers} from 'ethers';
import ReactDOM from "react-dom";
import {render} from "@testing-library/react";

const courseAddress = "0x06EAA29BFDd6612d3EE217c9f09Ef9Db07473d3E";
const departmentAddress = "0x4C09209e8A7CC3796b580d6D58f45B3Bf43814F3";
const diplomaAddress = "0xf953fac23fA73194bCd63fa3E0AaADfba09669FA";
const facultyAddress = "0x2e0759A51B6b63dde197D93cC1549af8626b6Cc0";
const courseAbi = course.abi;
const departmentAbi = department.abi;
const diplomaAbi = diploma.abi;
const facultyAbi = faculty.abi;

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
        </form>
    )
}
function AddStudent(props){
    const [address, setAddress] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        //TODO tek transaction'a toplanabilir
        await props.courseContract.grantStudentRole(address)
        await props.departmentContract.grantStudentRole(address)
        await props.diplomaContract.grantStudentRole(address)
        await props.facultyContract.grantStudentRole(address)
        //TODO write fail alert messages
        alert(`${address} is a Student Now`)
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>Enter Student Address:
                <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />
            </label>
            <input type="submit"/>
        </form>
    )
}
function AddFaculty(props){
    const [address, setAddress] = useState("");
    const [facultyName, setFacultyName] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        //TODO tek transaction'a toplanabilir
        await props.facultyContract.mint(facultyName, address)
        await props.courseContract.grantFacultyRole(address)
        await props.departmentContract.grantFacultyRole(address)
        await props.diplomaContract.grantFacultyRole(address)
        //TODO write fail alert messages
        alert(`${address} has the Faculty permissions Now`)
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
        </form>
    )
}
function AddDepartment(props){
    const [address, setAddress] = useState("");
    const [departmentName, setDepartmentName] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        //TODO tek transaction'a toplanabilir
        await props.departmentContract.mint(departmentName,address)
        await props.courseContract.grantDepartmentRole(address)
        await props.diplomaContract.grantDepartmentRole(address)
        await props.facultyContract.grantDepartmentRole(address)
        //TODO write fail alert messages
        alert(`${address} has the Department permissions Now`)
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
            <label>Enter Department Address:
                <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />
            </label>
            <input type="submit"/>
        </form>
    )
}
function AddInstructor(props){
    const [address, setAddress] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        //TODO tek transaction'a toplanabilir
        await props.courseContract.grantInstructorRole(address)
        await props.departmentContract.grantInstructorRole(address)
        await props.diplomaContract.grantInstructorRole(address)
        await props.facultyContract.grantInstructorRole(address)
        //TODO write fail alert messages
        alert(`${address} is a Instructor Now`)
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>Enter Instructor Address:
                <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />
            </label>
            <input type="submit"/>
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
        </form>
    )
}
function RemoveInstructor(props){
    const [instructorAddress, setInstructorAddress] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        //TODO tek transaction'a toplanabilir
        await props.courseContract.revokeInstructorRole(instructorAddress)
        await props.departmentContract.revokeInstructorRole(instructorAddress)
        await props.diplomaContract.revokeInstructorRole(instructorAddress)
        await props.facultyContract.revokeInstructorRole(instructorAddress)
        //TODO write fail alert messages
        alert(`${instructorAddress} has removed`)
    }
    return (
        <form onSubmit={handleSubmit}>
            <label>Enter Instructor Address:
                <input
                    type="text"
                    value={instructorAddress}
                    onChange={(e) => setInstructorAddress(e.target.value)}
                />
            </label>
            <input type="submit"/>
        </form>
    )
}
function RemoveStudent(props){
    const [studentAddress, setStudentAddress] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        //TODO tek transaction'a toplanabilir
        await props.courseContract.revokeStudentRole(studentAddress)
        await props.departmentContract.revokeStudentRole(studentAddress)
        await props.diplomaContract.revokeStudentRole(studentAddress)
        await props.facultyContract.revokeStudentRole(studentAddress)
        //TODO write fail alert messages
        alert(`${studentAddress} has removed`)
    }
    return (
        <form onSubmit={handleSubmit}>
            <label>Enter Student Address:
                <input
                    type="text"
                    value={studentAddress}
                    onChange={(e) => setStudentAddress(e.target.value)}
                />
            </label>
            <input type="submit"/>
        </form>
    )
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function App() {

    // const [currentAccount, setCurrentAccount] = useState(null);
    // const [currentAccountType, setAccountType] = useState(null);
    //
    // const checkWalletIsConnected = async () => {
    //     const {ethereum} = window;
    //
    //     if (!ethereum) {
    //         console.log("Make Sure you have Metamask installed!");
    //         return;
    //     } else {
    //         console.log("You have the wallet. You're ready to go!")
    //     }
    //     const accounts = await ethereum.request({method: "eth_requestAccounts"});
    //
    //     if (accounts.length !== 0) {
    //         const account = accounts[0];
    //         console.log("Found a connected account: ", accounts[0]);
    //         setCurrentAccount(account);
    //
    //         const provider = new ethers.providers.Web3Provider(ethereum);
    //         const signer = provider.getSigner();
    //         const diplomaContract = new ethers.Contract(diplomaAddress, diplomaAbi, signer);
    //         if (await diplomaContract.hasRole(ethers.utils.solidityKeccak256(["string"], ["RECTOR_ROLE"]), account)) {
    //             setAccountType("Rector")
    //         } else if (await diplomaContract.hasRole(ethers.utils.solidityKeccak256(["string"], ["FACULTY_ROLE"]), account)) {
    //             setAccountType("Faculty")
    //         } else if (await diplomaContract.hasRole(ethers.utils.solidityKeccak256(["string"], ["DEPARTMENT_ROLE"]), account)) {
    //             setAccountType("Department")
    //         } else if (await diplomaContract.hasRole(ethers.utils.solidityKeccak256(["string"], ["INSTRUCTOR_ROLE"]), account)) {
    //             setAccountType("Instructor")
    //         } else if (await diplomaContract.hasRole(ethers.utils.solidityKeccak256(["string"], ["STUDENT_ROLE"]), account)) {
    //             setAccountType("Student")
    //         } else if (await diplomaContract.hasRole(ethers.utils.solidityKeccak256(["string"], ["GRADUATED_ROLE"]), account)) {
    //             setAccountType("Graduated")
    //         } else {
    //             setAccountType("Not Registered")
    //         }
    //
    //     } else {
    //         console.log("No connected account found");
    //     }
    //
    // }
    // useEffect(() => {
    //     checkWalletIsConnected();
    // }, [])
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
            const instructorAddresses = await courseContract.getInstructors();
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
            const studentAddresses = await courseContract.getStudents();
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
            ReactDOM.render(
                <React.StrictMode>
                    <AddStudent courseContract={contracts[0]} departmentContract={contracts[1]} diplomaContract={contracts[2]} facultyContract={contracts[3]}/>
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
            ReactDOM.render(
                <React.StrictMode>
                    <AddDepartment courseContract={contracts[0]} departmentContract={contracts[1]} diplomaContract={contracts[2]} facultyContract={contracts[3]}/>
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
            ReactDOM.render(
                <React.StrictMode>
                    <AddInstructor courseContract={contracts[0]} departmentContract={contracts[1]} diplomaContract={contracts[2]} facultyContract={contracts[3]}/>
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
            ReactDOM.render(
                <React.StrictMode>
                    <RemoveInstructor courseContract={contracts[0]} departmentContract={contracts[1]} diplomaContract={contracts[2]} facultyContract={contracts[3]}/>
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
            ReactDOM.render(
                <React.StrictMode>
                    <RemoveStudent courseContract={contracts[0]} departmentContract={contracts[1]} diplomaContract={contracts[2]} facultyContract={contracts[3]}/>
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
                {mintDiplomaButton()}
                {addStudentButton()}
            </div>
            <div className='read-operations'>
                {checkDiplomaButton()}
                {checkFacultyButton()}
                {checkDepartmentButton()}
                {checkInstructorButton()}
                {checkStudentButton()}
            </div>
            <div className='delete-operations'>
                {removeFacultyButton()}
                {removeDepartmentButton()}
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
export default App;