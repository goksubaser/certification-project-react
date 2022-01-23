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
import env from '../env.json';
import roles from '../abis/Roles.json';
import {ethers} from 'ethers';
import ReactDOM from "react-dom";

const rolesAddress = env.rolesAddress

const rolesAbi = roles.abi;

function App() {

    const [currentAccount, setCurrentAccount] = useState(null);
    const [currentAccountType, setAccountType] = useState(null);
//TODO if the address is not connected it returns the last opened connected address as the default address
    const checkWalletIsConnected = async () => {
        const {ethereum} = window;
        console.log(ethereum)
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
            const rolesContract = new ethers.Contract(rolesAddress, rolesAbi, signer);
            if (await rolesContract.hasRectorRole(account)) {
                setAccountType("Rector")
            } else if (await rolesContract.hasFacultyRole(account)) {
                setAccountType("Faculty")
            } else if (await rolesContract.hasDepartmentRole(account)) {
                setAccountType("Department")
            } else if (await rolesContract.hasInstructorRole(account)) {
                setAccountType("Instructor")
            } else if (await rolesContract.hasStudentRole(account)) {
                setAccountType("Student")
            } else if (await rolesContract.hasGraduatedRole(account)) {
                setAccountType("Graduated")
            } else {
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
            const rolesContract = new ethers.Contract(rolesAddress, rolesAbi, signer);
            if (await rolesContract.hasRectorRole(account)) {
                setAccountType("Rector")
            } else if (await rolesContract.hasFacultyRole(account)) {
                setAccountType("Faculty")
            } else if (await rolesContract.hasDepartmentRole(account)) {
                setAccountType("Department")
            } else if (await rolesContract.hasInstructorRole(account)) {
                setAccountType("Instructor")
            } else if (await rolesContract.hasStudentRole(account)) {
                setAccountType("Student")
            } else if (await rolesContract.hasGraduatedRole(account)) {
                setAccountType("Graduated")
            } else {
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
                const rolesContract = new ethers.Contract(rolesAddress, rolesAbi, signer);
                if (await rolesContract.hasRectorRole(currentAccount)) {
                    ReactDOM.render(
                        <React.StrictMode>
                            <Rector/>
                        </React.StrictMode>,
                        document.getElementById('root')
                    );
                } else if (await rolesContract.hasFacultyRole(currentAccount)) {
                    ReactDOM.render(
                        <React.StrictMode>
                            <Faculty/>
                        </React.StrictMode>,
                        document.getElementById('root')
                    );
                } else if (await rolesContract.hasDepartmentRole(currentAccount)) {
                    ReactDOM.render(
                        <React.StrictMode>
                            <Department/>
                        </React.StrictMode>,
                        document.getElementById('root')
                    );
                } else if (await rolesContract.hasInstructorRole(currentAccount)) {
                    ReactDOM.render(
                        <React.StrictMode>
                            <Instructor/>
                        </React.StrictMode>,
                        document.getElementById('root')
                    );
                } else if (await rolesContract.hasStudentRole(currentAccount)) {
                    ReactDOM.render(
                        <React.StrictMode>
                            <Student/>
                        </React.StrictMode>,
                        document.getElementById('root')
                    );
                } else if (await rolesContract.hasGraduatedRole(currentAccount)) {
                    ReactDOM.render(
                        <React.StrictMode>
                            <Graduated/>
                        </React.StrictMode>,
                        document.getElementById('root')
                    );
                } else {
                    ReactDOM.render(
                        <React.StrictMode>
                            <NotRegistered/>
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
            <button onClick={checkRoleHandler} className='cta-button login-button'>
                {currentAccountType}
            </button>
        )
    }

    useEffect(() => {
        checkWalletIsConnected();
    }, [])

    return (<div className='main-app'>
            <h1>{currentAccount ? "Continue As" : "Your Wallet Is Not Connected"}</h1>
            <div>
                {currentAccount ? checkRoleButton() : connectWalletButton()}
            </div>
        </div>)
}

export default App;