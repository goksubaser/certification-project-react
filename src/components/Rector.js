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

const courseAddress = "0x62cc27a17B9150a887850F44050FC11094f62cd9";
const departmentAddress = "0x6383dE255588ca45367fF7abCc89840087085235";
const diplomaAddress = "0x233F273a48B35fA0c06DeEC6dE505dD50fc74294";
const facultyAddress = "0xF92BDba7E2dF3ac24097c81E522a56A3dAE64be4";

const courseAbi = course.abi;
const departmentAbi = department.abi;
const diplomaAbi = diploma.abi;
const facultyAbi = faculty.abi;

//TODO test contract call sender's are correct?
function DiplomaList(props) {
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
            <button onClick={checkDiplomaHandler} className='cta-button mint-nft-button'>
                List of Graduates and Diplomas
            </button>
        )
    }

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
            <button onClick={mintDiplomaHandler} className='cta-button mint-nft-button'>
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
            <button onClick={addStudentHandler} className='cta-button mint-nft-button'>
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
            <button onClick={addFacultyHandler} className='cta-button mint-nft-button'>
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
            <button onClick={addDepartmentHandler} className='cta-button mint-nft-button'>
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
            <button onClick={addInstructorHandler} className='cta-button mint-nft-button'>
                Add New Instructor
            </button>
        )
    }

    return (
        <div className='main-app'>
            <div>
                {checkDiplomaButton()}
            </div>
            <div>
                {mintDiplomaButton()}
            </div>
            <div>
                {addStudentButton()}
            </div>
            <div>
                {addFacultyButton()}
            </div>
            <div>
                {addDepartmentButton()}
            </div>
            <div>
                {addInstructorButton()}
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