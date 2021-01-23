import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

const App = () => {
    const [tasks, setTasks] = useState([])
    const [token, setToken] = useState([])
    const [userInfo, setUserInfo] = useState({ username: 'kenta', email: 'kenta@gmail.com', password: 'kawamoto' })

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
                console.log(res.data)
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
    const logIn = () => {
        console.log("login!")
        console.log(userInfo)
        axios.post(`https://enigmatic-stream-15237.herokuapp.com/dj-rest-auth/login/`, userInfo, {
        })
            .then(res => {
                setToken("Token " + res.data.key);
                localStorage.clear();
                localStorage.setItem('token', "Token " + res.data.key);
                window.location.reload()
            })
    }
    const logOut = () => {
        axios.post(`https://enigmatic-stream-15237.herokuapp.com/dj-rest-auth/logout/`, {
        }).then(res => {
            console.log(res)
            localStorage.setItem("token", "");
            window.location.reload()
        })

    }

    console.log("token", token)

    return (
        <div className="container">
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
                            <input type="text" placeholder="email" value={userInfo.email} onChange={handleUserInfoChange()} />
                            <input type="text" placeholder="password" value={userInfo.password} onChange={handleUserInfoChange()} />
                            <button onClick={() => logIn()}>logIn</button>
                        </>
                    )
            }
        </div >
    );
}

export default App;
