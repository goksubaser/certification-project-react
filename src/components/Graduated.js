import './App.css';
import React from "react";
import ReactDOM from "react-dom";
import {ethers} from "ethers";

import diploma from '../abis/Diploma.json';
import roles from '../abis/Roles.json';
import env from '../env.json';

const diplomaAddress = env.diplomaAddress
const rolesAddress = env.rolesAddress

const diplomaAbi = diploma.abi;
const rolesAbi = roles.abi;

function returnButton() {
    ReactDOM.render(
        <React.StrictMode>
            <App/>
        </React.StrictMode>,
        document.getElementById('root')
    );
}

function Diploma(props) {
    return (
        <body>
        <tr>
            <h1>{props.diplomaLink}</h1>
        </tr>
        <button onClick={(e) => returnButton()}>Back</button>
        </body>
    );
}

function App() {

    function listDiplomaButton() {
        async function listDiplomaHandler() {
            const contracts = await getContracts(false, false, true, false, false, true, true);
            let account = contracts[2];
            let isGraduate = await contracts[1].hasGraduatedRole(account)
            if (!isGraduate) {
                alert(`${account} is not a Graduate`)
                return;
            }
            let diplomaID = await contracts[0].getDiplomaID(account);
            let diplomaLinks = await contracts[0].getDiplomaLinks();
            ReactDOM.render(
                <React.StrictMode>
                    <Diploma diplomaLink={diplomaLinks[diplomaID - 1]}
                    />
                </React.StrictMode>,
                document.getElementById('root')
            );
        }

        return (
            <button onClick={listDiplomaHandler} className='cta-button read-button'>
                Diploma
            </button>
        )
    }

    return (
        <div className='main-app'>
            <div className='create-operations'>
                {listDiplomaButton()}
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