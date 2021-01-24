import React, { useState, useEffect } from 'react'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

const App = () => {
    const [editTask, setEditTask] = useState('')
    const [tasks, setTasks] = useState([])
    const [token, setToken] = useState([])
    const [userInfo, setUserInfo] = useState({ username: '', email: '', password1: '', password2: '' })
    const [userId, setUserId] = useState('')

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

        axios.get('https://enigmatic-stream-15237.herokuapp.com/dj-rest-auth/user/',
            // axios.get(`http://localhost:8000/dj-rest-auth/user/`,
            {
                headers: {
                    Authorization: localStorage.getItem('token'),
                }
            })
            .then(res => {
                setUserId(res.data.pk)
            })
            .catch((error) => {
                console.log(error)
            })
    }, [])

    const handleUserInfoChange = () => evt => {
        const value = evt.target.value
        const name = evt.target.name;
        setUserInfo({ ...userInfo, [name]: value })
    }

    const handleInputChange = () => evt => {
        setEditTask(evt.target.value)
    }

    const SignUp = () => {
        axios.post(`https://enigmatic-stream-15237.herokuapp.com/dj-rest-auth/registration/`, userInfo, {
            // axios.post(`http://localhost:8000/dj-rest-auth/registration/`, userInfo, {
        })
            .then(res => {
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
        const logInInfo = {
            username: userInfo.username,
            email: userInfo.email,
            password: userInfo.password1,
        }
        axios.post(`https://enigmatic-stream-15237.herokuapp.com/dj-rest-auth/login/`, logInInfo, {
            // axios.post(`http://localhost:8000/dj-rest-auth/login/`, logInInfo, {
        })
            .then(res => {
                setToken("Token " + res.data.key);
                localStorage.clear();
                localStorage.setItem('token', "Token " + res.data.key);
                window.location.reload()
            })
            .catch((error) => {
                localStorage.clear()
            })
    }

    const logOut = () => {
        axios.post(`https://enigmatic-stream-15237.herokuapp.com/dj-rest-auth/logout/`, {
        }).then(res => {
            localStorage.setItem("token", "");
            window.location.reload()
        })

    }

    const newTask = (task) => {
        const data = {
            title: task,
            user_id: userId
        }
        axios.post(`https://enigmatic-stream-15237.herokuapp.com/api/tasks/`, data, {
            // axios.post(`http://localhost:8000/api/tasks/`, data, {
            headers: {
                'Content-type': 'application/json',
                'Authorization': localStorage.getItem('token')
            }
        }).then(res => setTasks([...tasks, res.data]))
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
                        <input type="text" className="form-control form-control-sm mb-2 p-1 col-12" name="title" placeholder="New Task" value={editTask} onChange={handleInputChange()} />
                        <button className="btn btn-outline-dark col-12" onClick={() => newTask(editTask)}>Add</button>
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
