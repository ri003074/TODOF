import React, { useState, useEffect } from 'react'
import axios from 'axios'

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
        <div>
            {
                tasks.map((task, index) =>
                    <div key={task.id}>{task.title}</div>
                )
            }
        </div>
    );
}

export default App;
