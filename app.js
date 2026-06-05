/**
 * User Management Application
 * Main application logic and DOM manipulation
 */

// Application State
const appState = {
    users: [],
    isLoading: false,
    isSubmitting: false,
};

// DOM Elements Cache
const domElements = {
    form: null,
    submitBtn: null,
    refreshBtn: null,
    retryBtn: null,
    loadingState: null,
    errorState: null,
    emptyState: null,
    tableContainer: null,
    usersTableBody: null,
    notification: null,
    totalUsersElement: null,
    errorMessage: null,
    btnText: null,
    btnLoader: null,
};

/**
 * Initialize the application
 */
function initApp() {
    console.log('Initializing User Management Application...');

    // Cache DOM elements
    cacheElements();

    // Attach event listeners
    attachEventListeners();

    // Load initial data
    loadUsers();
}

/**
 * Cache frequently accessed DOM elements
 */
function cacheElements() {
    domElements.form = document.getElementById('createUserForm');
    domElements.submitBtn = document.getElementById('submitBtn');
    domElements.refreshBtn = document.getElementById('refreshBtn');
    domElements.retryBtn = document.getElementById('retryBtn');
    domElements.loadingState = document.getElementById('loadingState');
    domElements.errorState = document.getElementById('errorState');
    domElements.emptyState = document.getElementById('emptyState');
    domElements.tableContainer = document.getElementById('tableContainer');
    domElements.usersTableBody = document.getElementById('usersTableBody');
    domElements.notification = document.getElementById('notification');
    domElements.totalUsersElement = document.getElementById('totalUsers');
    domElements.errorMessage = document.getElementById('errorMessage');
    domElements.btnText = domElements.submitBtn.querySelector('.btn-text');
    domElements.btnLoader = domElements.submitBtn.querySelector('.btn-loader');
}

/**
 * Attach event listeners to DOM elements
 */
function attachEventListeners() {
    // Form submission
    if (domElements.form) {
        domElements.form.addEventListener('submit', handleFormSubmit);
    }

    // Refresh button
    if (domElements.refreshBtn) {
        domElements.refreshBtn.addEventListener('click', loadUsers);
    }

    // Retry button
    if (domElements.retryBtn) {
        domElements.retryBtn.addEventListener('click', loadUsers);
    }
}

/**
 * Handle form submission for creating a new user
 * @param {Event} event - Form submission event
 */
async function handleFormSubmit(event) {
    event.preventDefault();

    // Get form data
    const formData = new FormData(domElements.form);
    const userData = Object.fromEntries(formData);

    // Validate form
    if (!validateFormData(userData)) {
        return;
    }

    await createNewUser(userData);
}

/**
 * Validate form data
 * @param {object} userData - User data from form
 * @returns {boolean} - True if valid, false otherwise
 */
function validateFormData(userData) {
    if (!userData.firstName || !userData.firstName.trim()) {
        showNotification('First name is required', 'error');
        return false;
    }

    if (!userData.lastName || !userData.lastName.trim()) {
        showNotification('Last name is required', 'error');
        return false;
    }

    if (!userData.email || !userData.email.trim()) {
        showNotification('Email is required', 'error');
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
        showNotification('Please enter a valid email address', 'error');
        return false;
    }

    return true;
}

/**
 * Create a new user
 * @param {object} userData - User data
 */
async function createNewUser(userData) {
    try {
        setSubmitButtonLoading(true);

        const newUser = await API.createUser(userData);

        // Reset form
        domElements.form.reset();

        // Show success notification
        showNotification(`User "${userData.firstName} ${userData.lastName}" created successfully!`, 'success');

        // Reload users list
        await loadUsers();

    } catch (error) {
        console.error('Error creating user:', error);

        if (error instanceof API.APIError) {
            const message = error.data?.message || error.message || 'Failed to create user';
            showNotification(message, 'error');
        } else {
            showNotification('An unexpected error occurred. Please try again.', 'error');
        }
    } finally {
        setSubmitButtonLoading(false);
    }
}

/**
 * Load all users from the API
 */
async function loadUsers() {
    try {
        appState.isLoading = true;
        showLoadingState();

        const users = await API.getAllUsers();
        appState.users = users;

        // Update UI
        updateTotalUsersCount();
        renderUsersList();

    } catch (error) {
        console.error('Error loading users:', error);

        if (error instanceof API.APIError) {
            const message = error.data?.message || error.message || 'Failed to load users';
            domElements.errorMessage.textContent = message;
        } else {
            domElements.errorMessage.textContent = 'Failed to load users. Please check your connection and try again.';
        }

        showErrorState();
    } finally {
        appState.isLoading = false;
    }
}

/**
 * Render the users list in the table
 */
function renderUsersList() {
    if (appState.users.length === 0) {
        showEmptyState();
        return;
    }

    // Clear the table body
    domElements.usersTableBody.innerHTML = '';

    // Render each user
    appState.users.forEach(user => {
        const row = createUserRow(user);
        domElements.usersTableBody.appendChild(row);
    });

    showTableState();
}

/**
 * Create a table row for a user
 * @param {object} user - User object
 * @returns {HTMLElement} - Table row element
 */
function createUserRow(user) {
    const row = document.createElement('tr');

    // Format the date if it exists
    const createdAt = user.createdAt ? API.formatDate(user.createdAt) : 'N/A';

    row.innerHTML = `
        <td>${escapeHtml(user.id || 'N/A')}</td>
        <td>${escapeHtml(user.firstName || 'N/A')}</td>
        <td>${escapeHtml(user.lastName || 'N/A')}</td>
        <td>${escapeHtml(user.email || 'N/A')}</td>
        <td>${escapeHtml(user.phone || 'N/A')}</td>
        <td>${createdAt}</td>
    `;

    return row;
}

/**
 * Escape HTML special characters to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Update the total users count in the sidebar
 */
function updateTotalUsersCount() {
    if (domElements.totalUsersElement) {
        domElements.totalUsersElement.textContent = appState.users.length;
    }
}

/**
 * Set the submit button loading state
 * @param {boolean} isLoading - Whether the button is loading
 */
function setSubmitButtonLoading(isLoading) {
    appState.isSubmitting = isLoading;

    if (isLoading) {
        domElements.submitBtn.disabled = true;
        domElements.btnText.classList.add('hidden');
        domElements.btnLoader.classList.remove('hidden');
    } else {
        domElements.submitBtn.disabled = false;
        domElements.btnText.classList.remove('hidden');
        domElements.btnLoader.classList.add('hidden');
    }
}

/**
 * Show notification toast
 * @param {string} message - Notification message
 * @param {string} type - Notification type ('success', 'error', 'info')
 * @param {number} duration - How long to show the notification (ms)
 */
function showNotification(message, type = 'info', duration = 4000) {
    domElements.notification.textContent = message;
    domElements.notification.className = `notification ${type}`;

    // Auto-hide after duration
    setTimeout(() => {
        domElements.notification.classList.add('hidden');
    }, duration);
}

/**
 * Show loading state
 */
function showLoadingState() {
    domElements.loadingState.classList.remove('hidden');
    domElements.errorState.classList.add('hidden');
    domElements.emptyState.classList.add('hidden');
    domElements.tableContainer.classList.add('hidden');
}

/**
 * Show error state
 */
function showErrorState() {
    domElements.loadingState.classList.add('hidden');
    domElements.errorState.classList.remove('hidden');
    domElements.emptyState.classList.add('hidden');
    domElements.tableContainer.classList.add('hidden');
}

/**
 * Show empty state
 */
function showEmptyState() {
    domElements.loadingState.classList.add('hidden');
    domElements.errorState.classList.add('hidden');
    domElements.emptyState.classList.remove('hidden');
    domElements.tableContainer.classList.add('hidden');
}

/**
 * Show table state
 */
function showTableState() {
    domElements.loadingState.classList.add('hidden');
    domElements.errorState.classList.add('hidden');
    domElements.emptyState.classList.add('hidden');
    domElements.tableContainer.classList.remove('hidden');
}

/**
 * Start the application when DOM is ready
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
