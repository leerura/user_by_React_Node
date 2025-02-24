import { useEffect, useState } from "react"
import {useNavigate} from "react-router-dom"
import api from "../api/axiosInstance"


const Home = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const navigate = useNavigate();
    
    useEffect(() => {
        api.get("/users/auth").then(response => {
            if (response.status === 200){
                setIsAuthenticated(true)
            }
        })
        .catch(err => {
            navigate("/login")
            console.log(err)
        })
    });

    if (!isAuthenticated) return <h1>Redirecting...</h1>;

    return (
        <div>
            <h1>Home!!</h1>
        </div>
    )
};

export default Home;