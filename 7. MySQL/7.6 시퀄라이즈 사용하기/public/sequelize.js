//사용자 이름을 눌렀을 때 댓글 로딩
document.querySelectorAll('#user-list tr').forEach((el) =>{
    el.addEventListener('click', function () {
        const id = el.querySelector('td').textContent;
        getComment(id);
    });
});
//사용자 로딩
async function getUser() {
    try{
        const res = await axios.get('/users');
        const users = res.data;
        console.log(users);
        const tbody = document.querySelector('#user-list tbody');
        tbody.innerHTML = '';

        users.map(function (user){
            const row = document.createElement('tr');
            row.addEventListener('click', ()=>{
                getComment(user.id);
            });

            let td = document.createElement('td');
            td.textContent = user.id;
            row.appendChild(td);

            td = document.createElement('td');
            td.textContent = user.name;
            row.appendChild(td);

            td = document.createElement('td');
            td.textContent = user.age;
            row.appendChild(td);

            td = document.createElement('td');
            td.textContent = user.married ? '기혼' : '미혼';
            row.appendChild(td);
        });
    } catch(err) {
        console.error(err);
    }
}
//댓글 로딩
async function getComment(id) {
    try{
        const res = await axios.get(`/users/${id}/comments`);
        const commets = res.data;
        const tbody = document.querySelector('#comment-list tbody');
        tbody.innerHTML = '';

        commets.map(function (comment) {
            const row = document.createElement('tr');

            let td = document.createElement('td');
            text.textContent = comment.id;
            row.appendChild(td);

            td = document.createElement('td');
            text.textContent = comment.User.name;
            row.appendChild(td);

            td = document.createElement('td');
            text.textContent = comment.comment;
            row.appendChild(td);

            const edit = document.createElement('button');
            edit.textContent = '수정';
            edit.addEventListener('click', async ()=>{ // 수정 클릭 시 이벤트 생성
                const newComment = prompt('바꿀 내용을 입력하세요');
                if(!newComment){
                    return alert('내용을 입력해야합니다.');
                }
                try {
                    await axios.patch(`comments/${comment.id}`, {comment: newComment});
                    getComment(id);
                } catch(err) {
                    console.error(err);
                }
            });

            const remove = document.createElement('button');
            remove.textContent = '삭제';
            remove.addEventListener('click', async ()=>{ // 삭제 클릭 시 이벤트 생성
                try {
                    await axios.delete(`comments/${comment.id}`);
                    getComment(id);
                } catch(err) {
                    console.error(err);
                }
            });

            td = document.createElement('td');
            td.appendChild(edit);
            row.appendChild(td);

            td = document.createElement('td');
            td.appendChild(remove);
            row.appendChild(td);

            tbody.appendChild(row);
        });
    } catch(err) {
        console.error(err);
    }
}
//사용자 등록
document.getElementById('user-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = e.target.username.value;
    const age = e.target.age.value;
    const married = e.target.married.checked;

    if(!name || !age) {
        return alert('필수 입력 항목을 입력하지 않았습니다.');
    }

    try {
        await axios.post('/users', {name, age, married});
        getUser();
    } catch (err) {
        console.error(err);
    }

    e.target.username.value = '';
    e.target.age.value = '';
    e.target.married.checked = false;
});
//댓글 등록
document.getElementById('comment-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = e.target.userid.value;
    const comment = e.target.comment.value;

    if(!id || !comment){
        return alert('필수 입력 항목을 입력하지 않았습니다.');
    }

    try {
        await axios.post('/comments', {id, comment});
        getComment(id);
    } catch (err) {
        console.error(err);
    }

    e.target.userid.value = '';
    e.target.comment.value = '';
});