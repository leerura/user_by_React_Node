import { useEffect, useState } from "react"
import {useNavigate} from "react-router-dom"
import api from "../api/axiosInstance"


const Home = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [users, setUsers] = useState([])
    const navigate = useNavigate();

    
    useEffect(() => {
        api.get("/users/auth").then(response => {
            if (response.status === 200){
                setIsAuthenticated(true)
                api.get("/users/info").then(res => {
                    setUsers(res.data.users)
                })
                .catch(err => console.log(err))
            }
        })
        .catch(err => {
            navigate("/login")
            console.log(err)
        })
    }, [navigate]);

    if (!isAuthenticated) return <h1>Redirecting...</h1>;

    return (
        <div>
            <h1>Home!!</h1>
            <ul>
                {users.map((user, index) => (
                    <li key={user}>{user}</li>
                ))}
            </ul>
        </div>
    )
};

export default Home;