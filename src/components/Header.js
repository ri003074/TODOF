import React from 'react'
import axios from 'axios'

const Header = (values) => {
    const logOut = () => {
        axios.post(`${values.url}/dj-rest-auth/logout/`, {
        }).then(res => {
            localStorage.setItem("token", "");
            window.location.reload()
        })
    }
    return (
        <div>
            {
                values.token ? (
                    <h1>
                        <div className="dropdown">
                            <button className="dropbtn">Menu</button>
                            <div className="dropdown-content">
                                <div className="dropdown-content-item" onClick={() => logOut()}>logOut</div>
                            </div>
                        </div>
                            My Todos
                        <span>({values.remaining.length}/{values.tasks.length})</span>
                    </h1>
                ) : (
                        <>
                            <h1 className="text-center">My Todos</h1>
                        </>
                    )
            }
        </div>
    )
}

export default Header
