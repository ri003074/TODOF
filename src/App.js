import React, { useState, useEffect } from 'react'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import Header from './components/Header'

const App = () => {
    const [url] = useState("http://localhost:8000")
    // const [url] = useState("https://enigmatic-stream-15237.herokuapp.com")

    const [editTask, setEditTask] = useState('')
    const [tasks, setTasks] = useState([])
    const [token, setToken] = useState([])
    const [userInfo, setUserInfo] = useState({ username: '', email: '', password1: '', password2: '' })
    const [userId, setUserId] = useState('')

    useEffect(() => {

        setToken(localStorage.getItem('token'))
        axios.get(`${url}/api/tasks/`,
            {
                headers: {
                    Authorization: localStorage.getItem('token'),
                }
            })
            .then(res => {
                console.log(res.data)
                setTasks(res.data);
            })
            .catch((error) => {
                localStorage.clear()
            })

        axios.get(`${url}/dj-rest-auth/user/`,
            {
                headers: {
                    Authorization: localStorage.getItem('token'),
                }
            })
            .then(res => {
                console.log(res.data)
                setUserId(res.data.pk)
            })
            .catch((error) => {
                console.log(error)
            })
    }, [url])

    const handleUserInfoChange = () => evt => {
        const value = evt.target.value
        const name = evt.target.name;
        setUserInfo({ ...userInfo, [name]: value })
    }

    const handleInputChange = () => evt => {
        setEditTask(evt.target.value)
    }

    const handleCheckboxChange = (task, index) => {
        const tasks_copy = tasks.slice()
        tasks_copy[index].is_done = !tasks_copy[index].is_done
        setTasks(tasks_copy)
        tasks_copy[index]["user_uid"] = task.user.id

        axios.put(`${url}/api/tasks/${task.id}/`, tasks_copy[index],
            {
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': localStorage.getItem('token'),
                }
            })
            .then(res => {
                console.log(res.data)
            })
            .catch((error) => {
                console.log(error)
                // localStorage.clear()
            })

    }

    const SignUp = () => {
        axios.post(`${url}/dj-rest-auth/registration/`, userInfo, {
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

        axios.post(`${url}/dj-rest-auth/login/`, logInInfo, {
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

    const newTask = (task) => {
        // console.log("new task")
        // console.log(userId)
        const data = {
            title: task,
            user_uid: userId
        }
        axios.post(`${url}/api/tasks/`, data, {
            headers: {
                'Content-type': 'application/json',
                'Authorization': localStorage.getItem('token')
            }
        }).then(res => { setTasks([...tasks, res.data]); setEditTask('') })
    }

    const deleteTask = (id) => {
        axios.delete(`${url}/api/tasks/${id}/`, {
            headers: {
                'Content-type': 'application/json',
                'Authorization': localStorage.getItem('token')
            }
        }).then(res => setTasks(tasks.filter(task => task.id !== id)))
    }

    const remaining = tasks.filter(task => {
        return !task.is_done;
    })

    return (
        <div className="container">
            <Header token={token} remaining={remaining} tasks={tasks} url={url} />
            {
                token ? (
                    <ul>
                        {
                            tasks.map((task, index) =>

                                <li key={task.id}>
                                    <label>
                                        <input type="checkbox" checked={task.is_done} onChange={() => handleCheckboxChange(task, index)} />
                                        <span className={task.is_done ? 'done' : ''}>
                                            {task.title}
                                        </span>
                                    </label>
                                    <span className="cmd" onClick={() => deleteTask(task.id)}>[x]</span>
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
