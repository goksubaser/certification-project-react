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

const courseAddress = "0xCAD61585cCBA628B0840163F2C8639536Bc22Fc6";
const departmentAddress = "0xd090F4D8499E4F97a4393C96D1ab779D8e67c7CE";
const diplomaAddress = "0xda2324CD8fD8E01FF681cDED86bA3D5f049ab84a";
const facultyAddress = "0xA1C88e2F259fcF5F94F922738C1FEce5EFE8d31A";

const courseAbi = course.abi;
const departmentAbi = department.abi;
const diplomaAbi = diploma.abi;
const facultyAbi = faculty.abi;

function App() {

    const [currentAccount, setCurrentAccount] = useState(null);
    const [currentAccountType, setAccountType] = useState(null);
//TODO if the address is not connected it returns the last opened connected address as the default address
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
            }else{
                setAccountType("Not Registered")
            }

        } else {
            console.log("No connected account found");
        }

    }

    const connectWalletHandler = async () => {
        const {ethereum} = window;
        if (!ethereum) {
            alert("Please install Metamask!");
        }
        try {
            const accounts = await ethereum.request({method: "eth_requestAccounts"});
            console.log("Found an account! Address: ", accounts[0]);
            const account = accounts[0]
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
            }else{
                setAccountType("Not Registered")
            }

        } catch (err) {
            console.log(err)
        }
    }

    const checkRoleHandler = async () => {
        try {
            const {ethereum} = window;
            if (ethereum) {

                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const diplomaContract = new ethers.Contract(diplomaAddress, diplomaAbi, signer);
                if (await diplomaContract.hasRole(ethers.utils.solidityKeccak256(["string"], ["RECTOR_ROLE"]), currentAccount)) {
                    ReactDOM.render(
                        <React.StrictMode>
                            <Rector />
                        </React.StrictMode>,
                        document.getElementById('root')
                    );
                } else if (await diplomaContract.hasRole(ethers.utils.solidityKeccak256(["string"], ["FACULTY_ROLE"]), currentAccount)) {
                    ReactDOM.render(
                        <React.StrictMode>
                            <Faculty />
                        </React.StrictMode>,
                        document.getElementById('root')
                    );
                } else if (await diplomaContract.hasRole(ethers.utils.solidityKeccak256(["string"], ["DEPARTMENT_ROLE"]), currentAccount)) {
                    ReactDOM.render(
                        <React.StrictMode>
                            <Department />
                        </React.StrictMode>,
                        document.getElementById('root')
                    );
                } else if (await diplomaContract.hasRole(ethers.utils.solidityKeccak256(["string"], ["INSTRUCTOR_ROLE"]), currentAccount)) {
                    ReactDOM.render(
                        <React.StrictMode>
                            <Instructor />
                        </React.StrictMode>,
                        document.getElementById('root')
                    );
                } else if (await diplomaContract.hasRole(ethers.utils.solidityKeccak256(["string"], ["STUDENT_ROLE"]), currentAccount)) {
                    ReactDOM.render(
                        <React.StrictMode>
                            <Student />
                        </React.StrictMode>,
                        document.getElementById('root')
                    );
                } else if (await diplomaContract.hasRole(ethers.utils.solidityKeccak256(["string"], ["GRADUATED_ROLE"]), currentAccount)) {
                    ReactDOM.render(
                        <React.StrictMode>
                            <Graduated />
                        </React.StrictMode>,
                        document.getElementById('root')
                    );
                }else{
                    ReactDOM.render(
                        <React.StrictMode>
                            <NotRegistered />
                        </React.StrictMode>,
                        document.getElementById('root')
                    );
                }

            } else {
                console.log("Ethereum object does not exist")
            }

        } catch
            (err) {
            console.log(err);
        }
    }

    const connectWalletButton = () => {
        return (
            <button onClick={connectWalletHandler} className='cta-button connect-wallet-button'>
                Connect Wallet
            </button>
        )
    }

    const checkRoleButton = () => {
        return (
            <button onClick={checkRoleHandler} className='cta-button mint-nft-button'>
                {currentAccountType}
            </button>
        )
    }

    useEffect(() => {
        checkWalletIsConnected();
    }, [])

    return (
        <div className='main-app'>
            <h1>{currentAccount ? "Continue As" : "Your Wallet Is Not Connected"}</h1>
            <div>
                {currentAccount ? checkRoleButton() : connectWalletButton()}
            </div>
        </div>
    )
}

export default App;