interface Todo {
    id: number;
    title: string;
    completed: boolean;
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('todo-form') as HTMLFormElement;
    const input = document.getElementById('todo-input') as HTMLInputElement;
    const list = document.getElementById('todo-list') as HTMLUListElement;

    const fetchTodos = async () => {
        const response = await fetch('/api/todos');
        const todos: Todo[] = await response.json();
        renderTodos(todos);
    };

    const renderTodos = (todos: Todo[]) => {
        list.innerHTML = '';
        todos.forEach(todo => {
            const li = document.createElement('li');
            li.textContent = todo.title;
            li.dataset.id = todo.id.toString();
            if (todo.completed) {
                li.classList.add('completed');
            }
            list.appendChild(li);
        });
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = input.value;
        const response = await fetch('/api/todos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title }),
        });
        const todo: Todo = await response.json();
        const currentTodos = [...document.querySelectorAll('li')].map(li => ({
            id: Number(li.dataset.id),
            title: li.textContent!,
            completed: li.classList.contains('completed'),
        })) as Todo[];
        renderTodos([...currentTodos, todo]);
        input.value = '';
    });

    fetchTodos();
});
