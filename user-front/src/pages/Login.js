import React, {useState} from 'react'
import api from "../api/axiosInstance"

const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleSumit = async(e) => {
        e.preventDefault();
        try{
            const response = await api.post("/users/login", {username, password})
            console.log(response)
        } catch(err) {
            alert(err)
        }
    }

    return (
        <div>
            <h2>로그인</h2>
            <form onSubmit={handleSumit}>
                <label htmlFor="email">이메일</label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <label htmlFor="password">비밀번호</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">로그인</button>
            </form>
        </div>
    );
};

export default Login;