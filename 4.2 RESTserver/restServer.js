const http = require('http');
const fs = require('fs').promises;
// user 데이터 저장
const users = {};                                                       

http.createServer(async (req, res)=>{
    try{
        console.log(req.method, req.url);

        if(req.method === 'GET') {                                      // GET method 처리
            if(req.url === '/'){                                        // 라우팅 분리 (localhost:8082/) 
                const data = await fs.readFile('./restFront.html');     // restFront.html 파일 읽기 -> data
                res.writeHead(200,
                    {'Content-Type': 'text/html; charset=utf-8'});      // 
                return res.end(data);                                   // http 응답 (data)
            } else if(req.url === '/about'){                            // 라우팅 분리 (localhost:8082/about)
                const data = await fs.readFile('./about.html');         // about.html 파일 읽기 -> data
                res.writeHead(200,
                    {'Content-Type': 'text/html; charset=utf-8'});
                return res.end(data);                                   // http 응답 (data)
            } else if(req.url === '/users'){                            // 라우팅 분리 (localhost:8082/users)
                res.writeHead(200,
                    {'Content-Type': 'text/plain; charset=utf-8'});     
                return res.end(JSON.stringify(users));                  //users object를 JSON으로 변환 후 응답
            }
            try {
                const data = await fs.readFile(`.${req.url}`);
                return res.end(data);
            } catch(err){

            }
        } else if(req.method === 'POST') {                              // POST method 처리
            if(req.url === '/user'){                                    // 라우팅 분리
                let body = '';
                req.on('data', (data) =>{                               // 본문의 body를 stream형식으로 받음
                    body += data;
                });                                                     // 요청의 body를 다 받은 후 실행됨
                return req.on('end', ()=>{                              // 
                    console.log('POST 본문 (body):', body);
                    const { name } = JSON.parse(body);                  // body object의 name 데이터 저장 -> name
                    const id = Date.now();                              // id를 현재 시간으로 저장
                    users[id] = name;                                   // {id: name} 형태로 데이터 저장 -> users
                    console.log(id, users);
                    res.writeHead(201);
                    res.end('등록 성공');
                });
            }
        } else if(req.method === 'PUT') {
            if(req.url.startsWith('/user/')) {
                const key = req.url.split('/')[2];
                let body = '';
                req.on('data', (data) => {
                    body += data;
                });
                return req.on('end', () => {
                    console.log('PUT 본문(body);', body);
                    users[key] = JSON.parse(body).name;
                    return res.end(JSON.stringify(users));
                });
            }
        } else if(req.method === 'DELETE') {
            if(req.url.startsWith('/user/')){
                const key = req.url.split('/')[2];
                delete users[key];
                return res.end(JSON.stringify(users));
            }
        }
        res.writeHead(404);
        return res.end('NOT FOUND');
    } catch(err) {
        console.error(err);
        res.writeHead(500, )
    }
}).listen(8082, ()=>{
    console.log('8082번 포트에서 서버 대기중');
});