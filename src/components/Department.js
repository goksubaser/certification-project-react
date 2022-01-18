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
function CreateCourseRequest(props) {
    const [address, setAddress] = useState("");
    const [link, setLink] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        await props.requestContract.createCourseRequest(link, address)
        //TODO write fail alert messages
        alert(`Course Request For ${address} Has Created `)
        returnButton();
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>Enter Course Link:
                <input
                    type="text"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                />
            </label>
            <label>Enter Instructor Address:
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function App() {
/////////////////////////////////////// CREATE FUNCTIONS ///////////////////////////////////////////////////////////////
    function createDiplomaRequestButton() {
        async function createDiplomaHandler() {
            const contracts = await getContracts(false,false,false,false,true);
            ReactDOM.render(
                <React.StrictMode>
                    <CreateDiplomaRequest requestContract={contracts[0]}/>
                </React.StrictMode>,
                document.getElementById('root')
            );
        }
        return (
            <button onClick={createDiplomaHandler} className='cta-button create-button'>
                Create Diploma Request
            </button>
        )
    }
    function createCourseRequestButton() {
        async function createDiplomaHandler() {
            const contracts = await getContracts(false,false,false,false,true);
            ReactDOM.render(
                <React.StrictMode>
                    <CreateCourseRequest requestContract={contracts[0]}/>
                </React.StrictMode>,
                document.getElementById('root')
            );
        }
        return (
            <button onClick={createDiplomaHandler} className='cta-button create-button'>
                Create Course Request
            </button>
        )
    }


    //Geçici fonksiyon test için
    function readDiplomaRequests() {

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


    function readCourseRequests() {
        async function createDiplomaHandler() {
            const contracts = await getContracts(false, false, false, false,true);
            let requests = await contracts[0].getCourseRequests();
            for(var i = 0; i<requests.length; i++){
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
                {createDiplomaRequestButton()}
                {createCourseRequestButton()}
            </div>
            <div className='read-operations'>
                {readDiplomaRequests()}
                {readCourseRequests()}
            </div>
            <div className='delete-operations'></div>
        </div>
    )
}
async function getContracts(course = false, department = false, diploma = false, faculty = false, request=false)  {
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
        return contracts
    }
}
export default App;