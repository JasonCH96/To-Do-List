document.addEventListener('DOMContentLoaded', function() {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const noteToggle = document.getElementById('note-toggle');
    const noteInput = document.getElementById('note-input');
    const taskList = document.getElementById('task-list');
    const markAllButton = document.getElementById('mark-all');
    const deleteCompletedButton = document.getElementById('delete-completed');
    const toggleThemeButton = document.getElementById('toggle-theme');
    const searchInput = document.getElementById('search-input');

    loadTasks();

    taskForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const taskText = taskInput.value.trim();
        const taskNote = noteInput.value.trim();
        if (taskText !== '') {
            addTask(taskText, taskNote);
            taskInput.value = '';
            noteInput.value = '';
            noteInput.style.display = 'none';
            saveTasks();
        }
    });

    noteToggle.addEventListener('change', function() {
        if (noteToggle.checked) {
            noteInput.style.display = 'block';
        } else {
            noteInput.style.display = 'none';
        }
    });

    function addTask(taskText, taskNote, completed = false) {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        const taskTextSpan = document.createElement('span');
        taskTextSpan.textContent = taskText;
        taskTextSpan.addEventListener('dblclick', function() {
            taskTextSpan.contentEditable = true;
            taskTextSpan.focus();
        });
        taskTextSpan.addEventListener('blur', function() {
            taskTextSpan.contentEditable = false;
            saveTasks();
        });
        const taskNoteSpan = document.createElement('span');
        taskNoteSpan.textContent = taskNote;
        taskNoteSpan.className = 'small text-muted ml-3';
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.className = 'btn btn-danger btn-sm ml-2';
        deleteButton.addEventListener('click', function() {
            li.remove();
            saveTasks();
        });
        li.appendChild(taskTextSpan);
        if (taskNote !== '') {
            li.appendChild(taskNoteSpan);
        }
        li.appendChild(deleteButton);
        if (completed) {
            li.classList.add('completed');
        }
        taskList.appendChild(li);
    }

    markAllButton.addEventListener('click', function() {
        const visibleTasks = taskList.querySelectorAll('li:not([style*="display: none"])');
        const allCompleted = visibleTasks.length === taskList.querySelectorAll('li.completed').length;
    
        visibleTasks.forEach(function(task) {
            if (allCompleted) {
                task.classList.remove('completed');
            } else {
                task.classList.add('completed');
            }
        });
    
        markAllButton.textContent = allCompleted ? 'Marcar todas como completadas' : 'Desmarcar todas las tareas';
        saveTasks();
    });
    

    deleteCompletedButton.addEventListener('click', function() {
        const completedTasks = taskList.querySelectorAll('li.completed');
        completedTasks.forEach(function(task) {
            if (task.style.display !== 'none') {
                task.remove();
            }
        });
        saveTasks();
    });

    toggleThemeButton.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
    });

    searchInput.addEventListener('input', function() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        const tasks = taskList.querySelectorAll('li');
        tasks.forEach(function(task) {
            const taskText = task.querySelector('span').textContent.toLowerCase();
            if (taskText.includes(searchTerm)) {
                task.style.display = 'block';
            } else {
                task.style.display = 'none';
            }
        });
    
        if (searchTerm === '') {
            const visibleTasks = taskList.querySelectorAll('li:not([style*="display: none"])');
            const allCompleted = visibleTasks.length === taskList.querySelectorAll('li.completed').length;
            markAllButton.textContent = allCompleted ? 'Desmarcar todas las tareas' : 'Marcar todas como completadas';
        }
    });
    
    

    function saveTasks() {
        const tasks = [];
        const taskElements = taskList.querySelectorAll('li');
        taskElements.forEach(function(taskElement) {
            const taskText = taskElement.querySelector('span').textContent;
            const taskNote = taskElement.querySelector('.small');
            const completed = taskElement.classList.contains('completed');
            tasks.push({ text: taskText, note: taskNote ? taskNote.textContent : '', completed: completed });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        if (tasks) {
            tasks.forEach(function(task) {
                addTask(task.text, task.note, task.completed);
            });
        }
    }
});

