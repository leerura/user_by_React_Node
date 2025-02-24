require('dotenv').config();
const redis = require('redis');

const redisClient = redis.createClient({
    host: process.env.REDIS_HOST || 'localhost', // localhost로 연결
    port: process.env.REDIS_PORT || 6379, // 기본 포트는 6379
});

redisClient.on('error', (err) => {
    console.error('안되노:', err);
})

redisClient.on('connect', () => {
    console.log('✅ Redis 연결 성공');
});

async function testRedis() {
    try {
        // 비동기 연결 시도
        await redisClient.connect();

        // Redis에 데이터 설정
        await redisClient.set('key', 'value');
        // 데이터 가져오기
        const value = await redisClient.get('key');
        console.log('저장된 값:', value); // value 출력

    } catch (err) {
        console.error('Redis 작업 실패:', err);
    }
}

// Redis 연결 및 작업 실행
testRedis();

module.exports = redisClient