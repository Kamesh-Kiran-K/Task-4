class Task {
    constructor(id, description, completed) {
        this.id = id;
        this.description = description; 
        this.completed = completed;
    }
}

let tasks = [];
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

function addTask(description) {
    const id = tasks.length + 1;
    const newTask = new Task(id, description, false);
    tasks.push(newTask);
    renderTasks();
    saveTasks();
}

function renderTasks() {
    taskList.innerHTML = '';
    const filteredTasks = filterTasks();
    filteredTasks.forEach(task => {
        const taskCard = document.createElement('div');
        taskCard.classList.add('task-card');

        const taskDescription = document.createElement('span');
        taskDescription.textContent = task.description; 
        taskCard.appendChild(taskDescription);

        const checkbox = document.createElement('input');
        checkbox.style.float = 'right';
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => toggleTaskCompletion(task.id));
        taskCard.appendChild(checkbox);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.style.float = 'right';
        deleteButton.addEventListener('click', () => deleteTask(task.id));
        taskCard.appendChild(deleteButton);

        if (task.completed) {
            taskCard.classList.add('completed');
        }

        taskList.appendChild(taskCard);
    });
}

function filterTasks() {
    const filterValue = filterSelect.value;
    if (filterValue === 'completed') {
        return tasks.filter(task => task.completed);
    } else if (filterValue === 'uncompleted') {
        return tasks.filter(task => !task.completed);
    } else {
        return tasks; 
    }
}

function toggleTaskCompletion(taskId) {
    const task = tasks.find(task => task.id === taskId);
    if (task) {
        task.completed = !task.completed;
        renderTasks();
        saveTasks();
    } else {
        console.error("Task not found");
    }
}

function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    renderTasks();
    saveTasks();
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

let fetchedFromUrl = false; 

function fetchTodos() {
    if (!fetchedFromUrl) { 
        fetch('https://dummyjson.com/todos')
            .then(response => response.json())
            .then(data => {
                console.log('Fetched data:', data);
                if (data && Array.isArray(data.todos)) {
                    tasks = data.todos.map((task, index) => new Task(index, task.todo, task.completed));
                    saveTasks();
                    renderTasks();
                    fetchedFromUrl = true; 
                    console.error('Invalid data format:', data);
                }
            })
            .catch(error => console.error('Error fetching todos:', error));
    } else { 
        loadTasks();
    }
}



function loadTasks() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks).map(task => new Task(task.id, task.description, task.completed));
        renderTasks();
        console.log(tasks);
    }
}

addTaskBtn.addEventListener('click', () => {
    const description = taskInput.value.trim();
    if (description !== '') {
        addTask(description);
        taskInput.value = '';
    }
    window.addEventListener('load', loadTasks);
});

filterBtn.addEventListener('click', () => {
    fetchTodos();
});

