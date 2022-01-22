import './App.css';
import {ethers} from "ethers";
import React, {useState} from 'react';

import diploma from '../abis/Diploma.json';
import env from "../env.json";
import ReactDOM from "react-dom";
const diplomaAddress = env.diplomaAddress
const diplomaAbi = diploma.abi;

function returnButton() {
    ReactDOM.render(
        <React.StrictMode>
            <App/>
        </React.StrictMode>,
        document.getElementById('root')
    );
}

function VerifyDiploma(props) {
    const [address, setAddress] = useState("");
    const [diplomaLink, setDiplomaLink] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        let diplomaID = 0;
        let diplomaLinks = await props.diplomaContract.getDiplomaLinks();
        console.log(diplomaLinks)
        for(var i = 0; i<diplomaLinks.length; i++){
            if(diplomaLinks[i] === diplomaLink){
                diplomaID = i+1;
            }
        }
        if(diplomaID===0){
            alert(`${diplomaLink} has not found`)
            return;
        }
        let owner = await props.diplomaContract.ownerOf(diplomaID)
        if(owner.toUpperCase() === address.toUpperCase()){
            alert(`Address: ${address} | Link: ${diplomaLink} | VERFIED`)
        }else{
            alert(`Address: ${address} | Link: ${diplomaLink} | UNVERIFIED`)
        }
    }
    return (
        <form onSubmit={handleSubmit}>
            <label>Enter Diploma Link:
                <input
                    type="text"
                    value={diplomaLink}
                    onChange={(e) => setDiplomaLink(e.target.value)}
                />
            </label>
            <label>Enter Graduate Address:
                <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />
            </label>
            <input type="submit"/>
            <button onClick={(e) => returnButton()}>Back</button>
        </form>
    )
}

function App() {
    function verifyDiplomaButton() {
        async function verifyDiplomaHandler() {
            const contracts = await getContracts(false, false, true, false, false, false, false);
            ReactDOM.render(
                <React.StrictMode>
                    <VerifyDiploma diplomaContract={contracts[0]}/>
                </React.StrictMode>,
                document.getElementById('root')
            );
        }

        return (
            <button onClick={verifyDiplomaHandler} className='cta-button read-button'>
                Verify Diploma
            </button>
        )
    }

    return (
        <div className='main-app'>
            <div className='read-operations'>
                {verifyDiplomaButton()}
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
        // if (course) {
        //     const courseContract = new ethers.Contract(courseAddress, courseAbi, signer);
        //     contracts.push(courseContract);
        // }
        // if (department) {
        //     const departmentContract = new ethers.Contract(departmentAddress, departmentAbi, signer);
        //     contracts.push(departmentContract)
        // }
        if (diploma) {
            const diplomaContract = new ethers.Contract(diplomaAddress, diplomaAbi, signer);
            contracts.push(diplomaContract)
        }
        // if (faculty) {
        //     const facultyContract = new ethers.Contract(facultyAddress, facultyAbi, signer);
        //     contracts.push(facultyContract)
        // }
        // if (request) {
        //     const requestContract = new ethers.Contract(requestAddress, requestAbi, signer);
        //     contracts.push(requestContract)
        // }
        // if (roles) {
        //     const rolesContract = new ethers.Contract(rolesAddress, rolesAbi, signer);
        //     contracts.push(rolesContract)
        // }
        // if (account) {
        //     const account = accounts[0];
        //     contracts.push(account)
        // }
        return contracts
    }
}

export default App;