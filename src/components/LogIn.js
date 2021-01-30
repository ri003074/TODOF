import React from 'react'
import { useState } from 'react'
import axios from 'axios'


const LogIn = (values) => {
    const [userInfo, setUserInfo] = useState({ username: '', email: '', password1: '', password2: '' })

    const handleUserInfoChange = () => evt => {
        const value = evt.target.value
        const name = evt.target.name;
        setUserInfo({ ...userInfo, [name]: value })
    }

    const SignUp = () => {
        axios.post(`${values.url}/dj-rest-auth/registration/`, userInfo, {
        })
            .then(res => {
                localStorage.clear();
                localStorage.setItem('token', "Token " + res.data.key);
                window.location.reload()
            })
            .catch((error) => {
                localStorage.clear()
                console.log(error)
            })
    }

    const SignUpWithTasks = () => {
        if (userInfo.password1 === userInfo.password2) {
            const userInfo_tmp = {
                username: userInfo.username,
                email: userInfo.email,
                password: userInfo.password1,
            }
            axios.post(`${values.url}/api/users/`, userInfo_tmp, {
            })
                .then(res => {
                    logIn()
                })
                .catch((error) => {
                    localStorage.clear()
                    console.log(error)
                })
        }
    }

    const logIn = () => {
        const logInInfo = {
            username: userInfo.username,
            email: userInfo.email,
            password: userInfo.password1,
        }

        axios.post(`${values.url}/dj-rest-auth/login/`, logInInfo, {
        })
            .then(res => {
                localStorage.clear();
                localStorage.setItem('token', "Token " + res.data.key);
                window.location.reload()
            })
            .catch((error) => {
                localStorage.clear()
            })
    }

    return (
        <>
            <input type="text" className="form-control form-control-sm mb-2 p-1" name="username" placeholder="username" value={userInfo.username} onChange={handleUserInfoChange()} />
            <input type="text" className="form-control form-control-sm mb-2 p-1" name="email" placeholder="email" value={userInfo.email} onChange={handleUserInfoChange()} />
            <input type="password" className="form-control form-control-sm mb-2 p-1" name="password1" placeholder="password1" value={userInfo.password1} onChange={handleUserInfoChange()} />
            <input type="password" className="form-control form-control-sm mb-2 p-1" name="password2" placeholder="password2 for SiguUp" value={userInfo.password2} onChange={handleUserInfoChange()} />
            <div className="text-right">
                <button className="btn btn-outline-dark col-12 mb-2" onClick={() => logIn()}>logIn</button>
                <button className="btn btn-outline-dark col-12 mb-2" onClick={() => SignUp()}>SignUp</button>
                <button className="btn btn-outline-dark col-12" onClick={() => SignUpWithTasks()}>SignUp With Tasks</button>
            </div>
        </>
    );
}

export default LogIn;