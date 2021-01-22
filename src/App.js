import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

const App = () => {
    const [tasks, setTasks] = useState([])

    useEffect(() => {
        axios.get('https://enigmatic-stream-15237.herokuapp.com/api/tasks/')
            .then(res => {
                setTasks(res.data);
                console.log(res.data)
            })
    }, [])

    return (
        <div className="container">
            <h1>
                <button>Purge</button>
            My Todos
            <span>(1/2)</span>
            </h1>
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
        </div >
    );
}

export default App;
