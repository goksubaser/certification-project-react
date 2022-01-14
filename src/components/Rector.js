import React, {useEffect} from 'react';
import {useState} from 'react';
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

const courseAddress = "0x0E9Cd1EeF74E763EeC64bE76A3562e97CE2A3086";
const departmentAddress = "0xdAD604258d086151e2cf4180223FE08D9467Dfe9";
const diplomaAddress = "0xF3907182b9497286DD0b36F7c6f4bf7b4Ed3250d";
const facultyAddress = "0x9DfF37cBCc9F436bA61caf58ca52b38bc2Ea9e87";

const courseAbi = course.abi;
const departmentAbi = department.abi;
const diplomaAbi = diploma.abi;
const facultyAbi = faculty.abi;

function DiplomaList(props) {
    console.log(props.links)
    console.log(props.addresses)

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
        // <div>
        //     {props.addresses.map(item => {
        //         return <li>{item}</li>;
        //     })}
        // </div>
    );
}

function App() {

    const [currentAccount, setCurrentAccount] = useState(null);
    const [currentAccountType, setAccountType] = useState(null);

    const checkWalletIsConnected = async () => {
        const {ethereum} = window;

        if (!ethereum) {
            console.log("Make Sure you have Metamask installed!");
            return;
        } else {
            console.log("You have the wallet. You're ready to go!")
        }
        const accounts = await ethereum.request({method: "eth_requestAccounts"});

        if (accounts.length !== 0) {
            const account = accounts[0];
            console.log("Found a connected account: ", accounts[0]);
            setCurrentAccount(account);

            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const diplomaContract = new ethers.Contract(diplomaAddress, diplomaAbi, signer);
            if (await diplomaContract.hasRole(ethers.utils.solidityKeccak256(["string"], ["RECTOR_ROLE"]), account)) {
                setAccountType("Rector")
            } else if (await diplomaContract.hasRole(ethers.utils.solidityKeccak256(["string"], ["FACULTY_ROLE"]), account)) {
                setAccountType("Faculty")
            } else if (await diplomaContract.hasRole(ethers.utils.solidityKeccak256(["string"], ["DEPARTMENT_ROLE"]), account)) {
                setAccountType("Department")
            } else if (await diplomaContract.hasRole(ethers.utils.solidityKeccak256(["string"], ["INSTRUCTOR_ROLE"]), account)) {
                setAccountType("Instructor")
            } else if (await diplomaContract.hasRole(ethers.utils.solidityKeccak256(["string"], ["STUDENT_ROLE"]), account)) {
                setAccountType("Student")
            } else if (await diplomaContract.hasRole(ethers.utils.solidityKeccak256(["string"], ["GRADUATED_ROLE"]), account)) {
                setAccountType("Graduated")
            } else {
                setAccountType("Not Registered")
            }

        } else {
            console.log("No connected account found");
        }

    }
    useEffect(() => {
        checkWalletIsConnected();
    }, [])

    async function checkDiplomaHandler() {
        const {ethereum} = window;

        if (!ethereum) {
            return;
        }
        const accounts = await ethereum.request({method: "eth_requestAccounts"});
        if (accounts.length !== 0) {

            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const diplomaContract = new ethers.Contract(diplomaAddress, diplomaAbi, signer);
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
    }

    function checkDiplomaButton() {
        return (
            <button onClick={checkDiplomaHandler} className='cta-button mint-nft-button'>
                List of Graduates and Diplomas
            </button>
        )
    }

    function mintDiplomaHandler() {
    }

    function mintDiploma() {
        return (
            <button onClick={mintDiplomaHandler} className='cta-button mint-diploma-button'>
                Mint New Diploma
            </button>
        )
    }

    return (
        <div className='main-app'>
            <div>
                {checkDiplomaButton()}
            </div>
            {/*<div>*/}
            {/*    {mintDiploma()}*/}
            {/*</div>*/}
        </div>
    )
}

export default App;