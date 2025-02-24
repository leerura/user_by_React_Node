const db = require('../models/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const redisClient = require('../redis.js')

require('dotenv').config();

const registerUser = (req,res) => {
    const {username, password} = req.body;

    bcrypt.hash(password, 10 ,(err, hashedPassword) => {
        if (err) {
            return res.status(500).json({error: '해싱실패'});
        }

        const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
        db.query(sql,[username, hashedPassword], (err, result) => {
            if (err) {
                return res.status(500).json({error : '회원가입 실패'});
            }
            res.status(201).json({message: '회원가입 성공'})
        });
    });
};

const loginUser = async (req, res) => {
    const {username, password} = req.body;

    const sql = 'SELECT * FROM users WHERE username = ?';
    db.query(sql, [username], async (err, result) => {
        if(err){
            console.error(err);
            return res.status(500),json({message:'서버 오류'});
        }

        if (result.length === 0) {
            return res.status(401).json({message:'존재하지 않는 유저'})

        }//result === []

        const user = result[0]
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            console.log('비밀번호 틀림')
            return res.status(401).json({message:'비밀번호 틀림'})
        }

        const accessToken = jwt.sign(
            {id: user.id, username: user.username}, //토큰에 담을 정보
            process.env.JWT_SECRET,
            { expiresIn: '5s'}
        )

        const refreshToken = jwt.sign(
            {id: user.id, username: user.username},
            process.env.JWT_SECRET,
            { expiresIn: '7d'}
        )

        await redisClient.setEx(`refreshToken:${user.id}`, 60*60*24*7, refreshToken) //유효기간 넣어서 설정
        
        res.cookie('accessToken', accessToken, {
            httpOnly:true,
            secure:true,
            sameSite: 'None'
        })
        
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        });
        res.json({message: '로그인 성공'});
    });
};

const authenticateToken = (req, res) => {
    console.log("안뇽")
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json({message:"토큰없음"});

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err && err.message === "jwt expired") {
            const refreshToken = req.cookies.refreshToken;
            jwt.verify(refreshToken, process.env.JWT_SECRET, (err, user) => {
                if (err) {
                    return res.status(403).json({message:err})
                }
                const accessToken = jwt.sign(
                    {id : user.id, username : user.username},
                    process.env.JWT_SECRET,
                    { expiresIn: '10m'}

                )

                res.cookie('accessToken', accessToken, {
                    httpOnly : true,
                    secure : true,
                    sameSite : "None"
                })

                return res.status(200).json({message: '유효한 리프레시 토큰 따라서 액세스 토큰 재발급', user})
            }
            )  
            return ;
        } 
        return res.status(200).json({message: '유효한 토큰', user})     
    })
}

module.exports = { registerUser, loginUser, authenticateToken };