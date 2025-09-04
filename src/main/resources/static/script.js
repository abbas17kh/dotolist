class TodoApp {
    constructor() {
        this.baseURL = '/api/todos';
        this.currentFilter = 'all';
        this.editingTodoId = null;

        this.initializeElements();
        this.attachEventListeners();
        this.loadTodos();
    }

    initializeElements() {
        this.todoForm = document.getElementById('todo-form');
        this.todoTitle = document.getElementById('todo-title');
        this.todoDescription = document.getElementById('todo-description');
        this.searchInput = document.getElementById('search-input');
        this.searchBtn = document.getElementById('search-btn');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.todoList = document.getElementById('todo-list');
        this.loading = document.getElementById('loading');
        this.totalCount = document.getElementById('total-count');
        this.pendingCount = document.getElementById('pending-count');
        this.completedCount = document.getElementById('completed-count');

        this.editModal = document.getElementById('edit-modal');
        this.editForm = document.getElementById('edit-form');
        this.editTitle = document.getElementById('edit-title');
        this.editDescription = document.getElementById('edit-description');
        this.closeModal = document.getElementById('close-modal');
        this.cancelEdit = document.getElementById('cancel-edit');
    }

    attachEventListeners() {
        this.todoForm.addEventListener('submit', (e) => this.handleAddTodo(e));
        this.searchBtn.addEventListener('click', () => this.handleSearch());
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSearch();
        });

        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilter(e));
        });

        this.closeModal.addEventListener('click', () => this.closeEditModal());
        this.cancelEdit.addEventListener('click', () => this.closeEditModal());
        this.editForm.addEventListener('submit', (e) => this.handleEditTodo(e));

        this.editModal.addEventListener('click', (e) => {
            if (e.target === this.editModal) {
                this.closeEditModal();
            }
        });
    }

    showLoading() {
        this.loading.classList.add('show');
    }

    hideLoading() {
        this.loading.classList.remove('show');
    }

    async loadTodos() {
        try {
            this.showLoading();
            let url = this.baseURL;

            switch(this.currentFilter) {
                case 'completed':
                    url += '/completed';
                    break;
                case 'pending':
                    url += '/pending';
                    break;
                default:
                    break;
            }

            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to load todos');

            const todos = await response.json();
            this.renderTodos(todos);
            this.updateStats();
        } catch (error) {
            this.showError('Failed to load todos: ' + error.message);
        } finally {
            this.hideLoading();
        }
    }

    async updateStats() {
        try {
            const [allTodos, completedTodos, pendingTodos] = await Promise.all([
                fetch(this.baseURL).then(r => r.json()),
                fetch(this.baseURL + '/completed').then(r => r.json()),
                fetch(this.baseURL + '/pending').then(r => r.json())
            ]);

            this.totalCount.textContent = allTodos.length;
            this.completedCount.textContent = completedTodos.length;
            this.pendingCount.textContent = pendingTodos.length;
        } catch (error) {
            console.error('Failed to update stats:', error);
        }
    }

    renderTodos(todos) {
        if (todos.length === 0) {
            this.todoList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-clipboard-list"></i>
                    <h3>No todos found</h3>
                    <p>Add a new todo to get started!</p>
                </div>
            `;
            return;
        }

        this.todoList.innerHTML = todos.map(todo => `
            <div class="todo-item ${todo.completed ? 'completed' : ''}">
                <input type="checkbox" class="todo-checkbox" 
                       ${todo.completed ? 'checked' : ''} 
                       onchange="todoApp.toggleTodo(${todo.id})">
                <div class="todo-content">
                    <div class="todo-title">${this.escapeHtml(todo.title)}</div>
                    ${todo.description ? `<div class="todo-description">${this.escapeHtml(todo.description)}</div>` : ''}
                    <div class="todo-meta">
                        Created: ${this.formatDate(todo.createdAt)}
                        ${todo.updatedAt !== todo.createdAt ? ` • Updated: ${this.formatDate(todo.updatedAt)}` : ''}
                    </div>
                </div>
                <div class="todo-actions">
                    <button class="action-btn edit-btn" onclick="todoApp.openEditModal(${todo.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" onclick="todoApp.deleteTodo(${todo.id})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    async handleAddTodo(e) {
        e.preventDefault();

        const title = this.todoTitle.value.trim();
        const description = this.todoDescription.value.trim();

        if (!title) return;

        try {
            const response = await fetch(this.baseURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, description }),
            });

            if (!response.ok) throw new Error('Failed to create todo');

            this.todoForm.reset();
            this.loadTodos();
            this.showSuccess('Todo added successfully!');
        } catch (error) {
            this.showError('Failed to add todo: ' + error.message);
        }
    }

    async toggleTodo(id) {
        try {
            const response = await fetch(`${this.baseURL}/${id}/toggle`, {
                method: 'PATCH',
            });

            if (!response.ok) throw new Error('Failed to toggle todo');

            this.loadTodos();
        } catch (error) {
            this.showError('Failed to toggle todo: ' + error.message);
        }
    }

    async openEditModal(id) {
        try {
            const response = await fetch(`${this.baseURL}/${id}`);
            if (!response.ok) throw new Error('Failed to load todo');

            const todo = await response.json();
            this.editingTodoId = id;
            this.editTitle.value = todo.title;
            this.editDescription.value = todo.description || '';
            this.editModal.classList.add('show');
        } catch (error) {
            this.showError('Failed to load todo for editing: ' + error.message);
        }
    }

    closeEditModal() {
        this.editModal.classList.remove('show');
        this.editingTodoId = null;
        this.editForm.reset();
    }

    async handleEditTodo(e) {
        e.preventDefault();

        if (!this.editingTodoId) return;

        const title = this.editTitle.value.trim();
        const description = this.editDescription.value.trim();

        if (!title) return;

        try {
            const response = await fetch(`${this.baseURL}/${this.editingTodoId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, description }),
            });

            if (!response.ok) throw new Error('Failed to update todo');

            this.closeEditModal();
            this.loadTodos();
            this.showSuccess('Todo updated successfully!');
        } catch (error) {
            this.showError('Failed to update todo: ' + error.message);
        }
    }

    async deleteTodo(id) {
        if (!confirm('Are you sure you want to delete this todo?')) return;

        try {
            const response = await fetch(`${this.baseURL}/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete todo');

            this.loadTodos();
            this.showSuccess('Todo deleted successfully!');
        } catch (error) {
            this.showError('Failed to delete todo: ' + error.message);
        }
    }

    async handleSearch() {
        const keyword = this.searchInput.value.trim();

        if (!keyword) {
            this.loadTodos();
            return;
        }

        try {
            this.showLoading();
            const response = await fetch(`${this.baseURL}/search?keyword=${encodeURIComponent(keyword)}`);
            if (!response.ok) throw new Error('Failed to search todos');

            const todos = await response.json();
            this.renderTodos(todos);
        } catch (error) {
            this.showError('Failed to search todos: ' + error.message);
        } finally {
            this.hideLoading();
        }
    }

    handleFilter(e) {
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');

        this.currentFilter = e.target.dataset.filter;
        this.searchInput.value = '';
        this.loadTodos();
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 2rem',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '500',
            zIndex: '9999',
            backgroundColor: type === 'success' ? '#28a745' : '#dc3545',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.todoApp = new TodoApp();
});