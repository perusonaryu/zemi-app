const addTaskForm = document.querySelector('.add-task-form');
const addTask = document.querySelector('.add');
const addTaskColor = document.querySelector('.picker');
const list    = document.querySelector('.todos');
const search  = document.querySelector('.search input');


(function(){
    //初期化処理
    //ローカルストレージに格納されている値を取得し、リストを生成する
    for(var key in localStorage){
        var taskData = JSON.parse(localStorage.getItem(key));
        let taskCheckbox = '';
        
                
        if(taskData){
            if(taskData.taskCheck == 0){

                taskCheckbox = `<input type="checkbox" name="checkbox" class="checkbtn" >`;
            }else if(taskData.taskCheck == 1){
                taskCheckbox = `<input type="checkbox" name="checkbox" class="checkbtn"  checked >`;

            }

            list.innerHTML += `
                <li class="list-group-item d-flex justify-content-between align-items-center mb-4" style="background-color:${taskData.color};">
                    <div>
                        <p class="text-center title">${taskData.task}</p>
                        <p class="fon-s">${taskData.dateTime}</p>
                    </div>

                    <div data-title='${taskData.task}' class="d-flex align-items-center">

                        <i class="far fa-2x fa-trash-alt delete mr-3"></i>
                        ${taskCheckbox}
                    </div>
                </li>
            `;
        }
    }

})();

//日付時間取得
const getDateTime = () => {
    const youbi = ["日","月","火","水","木","金","土"];

    const date = new Date();

    const dateTime = 
        (date.getMonth() + 1) + "月" + 
        date.getDate() + "日" + 
        date.getHours() + "時" + 
        date.getMinutes() + "分" + 
        youbi[date.getDay()] + "曜日";
    
    return dateTime;
                     
} 

//localStorageにtaskを保存
const saveTaskToLocalStorage = (task, dataList) => {
    //nullは,localStorageに保存しない
    if(task){
        //localStorageは、0から始まる
        localStorage.setItem(task,JSON.stringify(dataList));
        return;
    }
    return;
}

//localStorageからタスクを削除
const deleteTaskFromLocalStorage = task => {
    localStorage.removeItem(task);
    return;
}

//taskをHTML
const createTodoList = (task,color) => {
    // console.log(getDateTime());
    const dateTime = getDateTime();

    const dataList = {
        task: task,
        dateTime: dateTime,
        color:color,
        taskCheck:0,
    }
    //HTML テンプレートを作成
    const html = `
        <li class="list-group-item d-flex justify-content-between align-items-center mb-4" style="background-color:${color};">
            <div>
                <p class="text-center title">${task}</p>
                <p class="fon-s">${dateTime}</p>
            </div>
            <div data-title='${task}'>

                <i class="far fa-2x fa-trash-alt delete"></i>
                <input type="checkbox" name="checkbox" class="check checkbtn">

            </div>
        </li>
    `;

    list.innerHTML += html;
    saveTaskToLocalStorage(task,dataList);
}

const filterTasks = (term) =>  {
    Array.from(list.children)
        //フィルタ条件
        .filter((todo) => !todo.textContent.toLowerCase().includes(term))
        .forEach((todo) => todo.classList.add('filtered'));

    Array.from(list.children)
        .filter((todo) => todo.textContent.toLowerCase().includes(term))
        .forEach((todo) => todo.classList.remove('filtered'));
};

search.addEventListener('keyup', e => {
    e.preventDefault();
    //空白削除かつ、小文字に変換(大文字・小文字の区別をなくす)
    const term = search.value.trim().toLowerCase();
    // console.log(list.children[0].textContent.toLowerCase().includes(term));

    filterTasks(term);
})

addTask.addEventListener('click', e => {
    //デフォルトのイベントを無効
    e.preventDefault();
    //タスクに入力した値を空白を除外して格納
    const task = addTaskForm.add.value.trim();
    const color = addTaskForm.color.value.trim();
    if(task.length){
        //Todo List のHTML作成
        createTodoList(task,color);
        //タスクに入力した文字をクリア
        addTaskForm.reset();

        
    }
})


list.addEventListener('click',e => {
    //削除機能
    if(e.target.classList.contains('delete')){
        e.target.parentElement.parentElement.remove();
        const task = e.target.parentElement.getAttribute('data-title').trim();
        deleteTaskFromLocalStorage(task);
    }


    //taskチェック機能

    if(e.target.classList.contains('checkbtn')){

        const checkBox = e.target;
        const key = e.target.parentElement.getAttribute('data-title').trim();
        const taskData = JSON.parse(localStorage.getItem(key));
        console.log(e.target.checked);
        if(checkBox.checked){
            taskData.taskCheck = 1;
            localStorage.setItem(key,JSON.stringify(taskData));
        }else{
            taskData.taskCheck = 0;
            localStorage.setItem(key,JSON.stringify(taskData));
        }
    }
});






jQuery(function($){
    $("#picker").spectrum({
        color: "#cccccc", // 初期値
        showPaletteOnly: true, // 外観をパレットのみにする
        palette: [ // パレットで使う色を指定
            ["#cccccc","#f44336", "#ff9800", "#ffeb3b", ], 
            [ "#4caf50", "#03a9f4", "#2196f3","#8bc34a"]
        ]
    });
});

