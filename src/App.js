import React, { useState, useEffect } from 'react'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

const App = () => {
    const [tasks, setTasks] = useState([])
    const [token, setToken] = useState([])
    const [userInfo, setUserInfo] = useState({ username: '', email: '', password1: '', password2: '' })

    useEffect(() => {
        setToken(localStorage.getItem('token'))
        axios.get('https://enigmatic-stream-15237.herokuapp.com/api/tasks/',
            // axios.get(`http://localhost:8000/api/tasks/`,
            {
                headers: {
                    Authorization: localStorage.getItem('token'),
                }
            })
            .then(res => {
                setTasks(res.data);
            })
            .catch((error) => {
                localStorage.clear()
            })


    }, [])

    const handleUserInfoChange = () => evt => {
        const value = evt.target.value
        const name = evt.target.name;
        setUserInfo({ ...userInfo, [name]: value })
    }
    const SignUp = () => {
        console.log("sign up!")
        console.log(userInfo)
        axios.post(`https://enigmatic-stream-15237.herokuapp.com/dj-rest-auth/registration/`, userInfo, {
        })
            .then(res => {
                console.log(res)
                setToken("Token " + res.data.key);
                localStorage.clear();
                localStorage.setItem('token', "Token " + res.data.key);
                window.location.reload()
            })
            .catch((error) => {
                localStorage.clear()
                console.log(error)
            })
    }
    const logIn = () => {
        console.log("login!")
        console.log(userInfo)
        const logInInfo = {
            username: userInfo.username,
            email: userInfo.email,
            password: userInfo.password1,
        }
        axios.post(`https://enigmatic-stream-15237.herokuapp.com/dj-rest-auth/login/`, logInInfo, {
        })
            .then(res => {
                console.log(res)
                setToken("Token " + res.data.key);
                localStorage.clear();
                localStorage.setItem('token', "Token " + res.data.key);
                window.location.reload()
            })
            .catch((error) => {
                localStorage.clear()
                console.log(error)
            })
    }
    const logOut = () => {
        axios.post(`https://enigmatic-stream-15237.herokuapp.com/dj-rest-auth/logout/`, {
        }).then(res => {
            localStorage.setItem("token", "");
            window.location.reload()
        })

    }

    return (
        <div className="container">
            {
                token ? (
                    <h1>
                        <div className="dropdown">
                            <button className="dropbtn">Menu</button>
                            <div className="dropdown-content">
                                <div className="dropdown-content-item" onClick={() => logOut()}>logOut</div>
                            </div>
                        </div>
                            My Todos
                        <span>(1/2)</span>
                    </h1>
                ) : (
                        <>
                            <h1 className="text-center">My Todos</h1>
                        </>
                    )
            }
            {
                token ? (
                    <ul>
                        {
                            tasks.map((task, index) =>

                                <li key={task.id}>
                                    <label>
                                        <input type="checkbox" />
                                        {task.title}
                                    </label>
                                    <span className="cmd">[x]</span>
                                </li>
                            )
                        }
                    </ul>
                ) : (
                        <>
                            <input type="text" className="form-control form-control-sm mb-2 p-1" name="username" placeholder="username" value={userInfo.username} onChange={handleUserInfoChange()} />
                            <input type="text" className="form-control form-control-sm mb-2 p-1" name="email" placeholder="email" value={userInfo.email} onChange={handleUserInfoChange()} />
                            <input type="password" className="form-control form-control-sm mb-2 p-1" name="password1" placeholder="password1" value={userInfo.password1} onChange={handleUserInfoChange()} />
                            <input type="password" className="form-control form-control-sm mb-2 p-1" name="password2" placeholder="password2 for SiguUp" value={userInfo.password2} onChange={handleUserInfoChange()} />
                            <div className="text-right">
                                <button className="btn btn-outline-dark col-12 mb-2" onClick={() => logIn()}>logIn</button>
                                <button className="btn btn-outline-dark col-12" onClick={() => SignUp()}>SignUp</button>
                            </div>
                        </>
                    )
            }
        </div >
    );
}

export default App;
