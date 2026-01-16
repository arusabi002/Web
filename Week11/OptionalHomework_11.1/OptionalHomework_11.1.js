const todoList = document.getElementById('todo-list');

function renderTodos(todos) {
    todoList.innerHTML = ''; // Очищаем список перед рендером
    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.textContent = todo;
        li.innerHTML += `<button onclick="deleteTodo(${index})">Удалить</button>`;
        todoList.appendChild(li);
    });
}

const todos = JSON.parse(localStorage.getItem('todos')) || [];
renderTodos(todos);

const addTodoBtn = document.getElementById('add-todo-btn');
const todoInput = document.getElementById('todo-input');

addTodoBtn.addEventListener('click', function () {
    const newTodo = todoInput.value.trim();
    if (newTodo) {
        todos.push(newTodo);
        renderTodos(todos);
        todoInput.value = '';
        saveTodos();
    }
});

function deleteTodo(index) {
    todos.splice(index, 1);
    renderTodos(todos);
    saveTodos();
}

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

