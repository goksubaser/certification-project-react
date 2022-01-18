import React, {useEffect} from 'react';
import {useState} from 'react';
import './App.css';
import course from '../abis/Course.json';
import department from '../abis/Department.json';
import diploma from '../abis/Diploma.json';
import faculty from '../abis/Faculty.json';
import request from '../abis/Request.json';
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
const requestAbi = request.abi;

function returnButton(){
    ReactDOM.render(
        <React.StrictMode>
            <App/>
        </React.StrictMode>,
        document.getElementById('root')
    );
}
/////////////////////////////////////// CREATE FUNCTIONS ///////////////////////////////////////////////////////////////
function CreateDiplomaRequest(props) {
    const [address, setAddress] = useState("");
    const [link, setLink] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        await props.requestContract.createDiplomaRequest(link, address)
        //TODO write fail alert messages
        alert(`Diploma Request For ${address} Has Created `)
        returnButton();
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
function ReadDiplomaRequest(props){
    return (

        <div>
            <tr>
                <th>Student Addresses</th>
                <th>Diploma Links</th>
                <th>Requestor Departments Addresses</th>
            </tr>
            <td>
                {props.studentAddresses.map(item => {
                    return <h5>{item}</h5>;
                })}
            </td>
            <td>
                {props.diplomaLinks.map(item => {
                    return <h5>{item}</h5>;
                })}
            </td>
            <td>
                {props.requestorDepartments.map(item => {
                    return <h5>{item}</h5>;
                })}
            </td>
            <button onClick={(e)=> returnButton()}>Geri</button>
        </div>
    );
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function App() {
/////////////////////////////////////// CREATE FUNCTIONS ///////////////////////////////////////////////////////////////
    function readDiplomaRequestsButton() {
        async function readDiplomaRequestsHandler() {
            const contracts = await getContracts(false,false,false,true,true, true);
            let facultyContract = contracts[0];
            let requests = await contracts[1].getDiplomaRequests();
            let account = contracts[2];
            let facultyID = 0;
            let totalSupply = await facultyContract.getTotalSupply()
            for(var i = 1; i<=totalSupply; i++){
                let owner = await facultyContract.ownerOf(i)
                if(owner.toUpperCase() === account.toUpperCase()){
                    facultyID=i;
                    break;
                }
            }
            if(facultyID === 0){
                alert(`${account} is not a Faculty`)
                return;
            }
            let studentAddresses = [];
            let diplomaLinks = [];
            let requestorDepartments = [];
            let indexes = [];
            for(var i = 0; i<requests.length; i++){
                if(!requests[i].atRector){
                    let departments = await facultyContract.getDepartments(facultyID)
                    if(departments.indexOf(requests[i].requestorDepartment)>-1){
                        studentAddresses.push(requests[i].studentAddress)
                        diplomaLinks.push(requests[i].diplomaLink)
                        requestorDepartments.push(requests[i].requestorDepartment)
                        indexes.push(i)
                    }
                }
            }
            console.log(studentAddresses)
            console.log(diplomaLinks)
            console.log(requestorDepartments)
            console.log(indexes)
            ReactDOM.render(
                <React.StrictMode>
                    <ReadDiplomaRequest requests={requests} studentAddresses={studentAddresses} diplomaLinks={diplomaLinks} requestorDepartments={requestorDepartments} indexes={indexes}/>
                </React.StrictMode>,
                document.getElementById('root')
            );
        }

        return (
            <button onClick={readDiplomaRequestsHandler} className='cta-button create-button'>
                List Diploma Requests
            </button>
        )
    }

    //Geçici fonksiyon test için
    function readRequests() {

        async function createDiplomaHandler() {
            const contracts = await getContracts(false, false, false, false,true);
            let requests = await contracts[0].getDiplomaRequests();
            for(var i = 0; i<requests.length; i++){
                console.log(requests[i])
            }
        }

        return (
            <button onClick={createDiplomaHandler} className='cta-button read-button'>
                Read Diploma Request
            </button>
        )
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    return (
        <div className='main-app'>
            <div className='create-operations'>
                {readDiplomaRequestsButton()}
            </div>
            <div className='read-operations'>
                {readRequests()}
            </div>
            <div className='delete-operations'></div>
        </div>
    )
}
async function getContracts(course = false, department = false, diploma = false, faculty = false, request=false, account = false)  {

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
        if(request){
            const requestContract = new ethers.Contract(requestAddress, requestAbi, signer);
            contracts.push(requestContract)
        }
        if(account){
            const account = accounts[0];
            contracts.push(account)
        }
        return (contracts);
    }
}
export default App;