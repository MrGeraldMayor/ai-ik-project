// script.js

document.addEventListener('DOMContentLoaded', () => {
  const taskForm = document.getElementById('task-form');
  const taskTitleInput = document.getElementById('task-title');
  const taskTypeError = document.getElementById('task-title-error');
  const taskTypeSelect = document.getElementById('task-type');
  const taskDueInput = document.getElementById('task-due');
  const taskBody = document.getElementById('task-body');
  const taskCount = document.getElementById('task-count');

  // Load tasks from localStorage or initialize empty array
  let tasks = JSON.parse(localStorage.getItem('gerad_tasks')) || [];

  // Initial render
  renderTasks();

  // Handle form submission
  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = taskTitleInput.value.trim();
    const type = taskTypeSelect.value;
    const due = taskDueInput.value;

    // Simple validation
    if (!title) {
      taskTypeError.textContent = 'Please enter a task title.';
      taskTitleInput.focus();
      return;
    } else {
      taskTypeError.textContent = '';
    }

    const newTask = {
      id: Date.now().toString(),
      title,
      type,
      due: due || 'No due date',
      completed: false
    };

    tasks.push(newTask);
    saveAndRender();

    // Reset form
    taskForm.reset();
    taskTitleInput.focus();
  });

  // Save to localStorage and re-render
  function saveAndRender() {
    localStorage.setItem('gerad_tasks', JSON.stringify(tasks));
    renderTasks();
  }

  // Render tasks to the table body
  function renderTasks() {
    taskBody.innerHTML = '';

    if (tasks.length === 0) {
      const emptyRow = document.createElement('tr');
      emptyRow.innerHTML = `<td colspan="5" style="text-align: center; color: var(--muted, #666);">No tasks added yet.</td>`;
      taskBody.appendChild(emptyRow);
      updateCount();
      return;
    }

    tasks.forEach((task) => {
      const tr = document.createElement('tr');
      if (task.completed) {
        tr.classList.add('is-completed');
      }

      // Format type nicely for display
      let typeDisplay = task.type;
      if (task.type === 'assignment') typeDisplay = 'Assignment';
      if (task.type === 'studio') typeDisplay = 'Studio session';
      if (task.type === 'release') typeDisplay = 'Release deadline';

      tr.innerHTML = `
        <td>
          <input type="checkbox" aria-label="Mark task as done" ${task.completed ? 'checked' : ''} data-id="${task.id}" class="toggle-task">
        </td>
        <td class="${task.completed ? 'completed-text' : ''}">${escapeHTML(task.title)}</td>
        <td><span class="badge badge-${task.type}">${typeDisplay}</span></td>
        <td>${escapeHTML(task.due)}</td>
        <td>
          <button type="button" class="btn-delete" data-id="${task.id}" aria-label="Delete task">Delete</button>
        </td>
      `;

      taskBody.appendChild(tr);
    });

    updateCount();
    attachEventListeners();
  }

  // Attach event listeners to dynamic elements (checkboxes and delete buttons)
  function attachEventListeners() {
    // Toggle completion
    document.querySelectorAll('.toggle-task').forEach((checkbox) => {
      checkbox.addEventListener('change', (e) => {
        const id = e.target.getAttribute('data-id');
        const task = tasks.find((t) => t.id === id);
        if (task) {
          task.completed = e.target.checked;
          saveAndRender();
        }
      });
    });

    // Delete task
    document.querySelectorAll('.btn-delete').forEach((button) => {
      button.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        tasks = tasks.filter((t) => t.id !== id);
        saveAndRender();
      });
    });
  }

  // Update task counter status
  function updateCount() {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    taskCount.textContent = `${completed} of ${total} done`;
  }

  // Basic HTML escape helper to prevent injection
  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }
});