const express = require('express');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config;
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { authenticateToken } = require('./middlewares/authMiddleware')
const {getUsers} = require('./controllers/userController')

const app = express();
const port = 8000;

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use(cookieParser());

app.use(express.json()); //req를 json화 해줌
app.use('/api/users', userRoutes)
app.use(authenticateToken)
app.get('/api/users/info', getUsers)



app.listen(port, () => {
    console.log(`서버 ${port}`)
}); //리슨은 서버 실행