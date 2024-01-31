const express = require('express');
const path = require('path');                   //html로 응답하기 위해서 추가

const morgan = require('morgan');               //
const cookieParser = require('cookie-parser');  //
const session = require('express-session');     //
const dotenv = require('dotenv');               //

dotenv.config();                                //
const indexRouter = require('./routes');        // 6.3 Router 객체로 라우팅 분리 (/routes/index.js)
const userRouter = require('./routes/user');    // 6.3 Router 객체로 라우팅 분리 (/routes/user.js)

const app = express();
app.set('port', process.env.PORT||3000);        //포트 설정 3000번

app.use(morgan('dev'));
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
    name: 'session-cookie',
}));

const multer = require('multer');               //6.2.7 multer추가
const fs = require('fs');                       //6.2.7 multer에 사용할 파일시스템 추가

try{                                            //6.2.7 uploads 폴더 연결
    fs.readdirSync('uploads');
} catch(error) {
    console.error('uploads 폴더가 없어 생성합니다.');
    fs.mkdirSync('uploads');
}
const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, 'uploads/');
        },
        filename(req, file, done) {
            const ext = path.extname(file.originalname);
            done(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    limits: {fielSize: 5 * 1024 * 1024},
});

app.get('/upload', (req, res)=>{
    res.sendFile(path.join(__dirname, 
        'multipart.html'));
});

app.post('/upload', upload.fields(
    [{name: 'image1'}, {name: 'image2'}]),
    (req, res) =>{
      console.log(req.files, req.body);
       res.end('ok');
    },
);

app.use((req, res, next)=>{                     //6.2 미들웨어 부분 추가
    console.log('모든 요청에 다 실행됩니다.');
    next();
});

app.get('/', (req, res, next)=>{                //6.2 미들웨어 next추가
    console.log('GET/ 요청에서만 싱핼됩니다.');   //6.2 미들웨어 부분 추가
    next();
    //res.send('Hello, Express');
    //6.1 send -> sendFile로 변경해 html파일로 응답.
    //res.sendFile(path.join(__dirname, '/index.html')); 
}, (req, res)=>{
    throw new Error('에러는 에러 처리 미들웨어로 갑니다.');
});

app.use((err, req, res, next)=>{                //6.2 미들웨어 부분 추가(에러처리)
    console.error(err);
    res.status(500).send(err.message);
});

app.listen(app.get('port'), ()=>{
    console.log(app.get('port'), '번 포트에서 대기중');
});