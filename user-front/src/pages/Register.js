import React, {useState} from 'react'
import api from "../api/axiosInstance"

const Resgister = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSumit = async(e) => {
        e.preventDefault();
        try {
            const response = await api.post("/users/register", {username, password});
            console.log(response.data.message)
        } catch (err) {
            alert(err)
        }
    };

    return (
        <div>
            <h2>회원가입</h2>
            <form onSubmit={handleSumit}>
                <label htmlFor="username">유저네임</label>
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
                <button type="submit">회원가입</button>
            </form>
        </div>
    );
};
    
export default Resgister;