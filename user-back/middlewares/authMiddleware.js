const jwt = require('jsonwebtoken')
const redisClient = require('../redis')
require('dotenv').config();

const authenticateToken = (req, res, next) => {
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

                req.user = user
                console.log("나 미들웨어 리프레시 토큰 유효")
                next()
            }
            )  
            return ;
        } 
        req.user = user   
        console.log("나 미들웨어 액세스 토큰 유효")
        next();
    })
}

module.exports = {authenticateToken};