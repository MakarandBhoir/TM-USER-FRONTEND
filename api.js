/**
 * API Service Module
 * Handles all REST API communication with the backend
 * 
 * UPDATE THE API_BASE_URL to match your Swagger API endpoint
 */

const API_CONFIG = {
    // Update this URL to match your backend API
    BASE_URL: 'http://localhost:8080/api',
    TIMEOUT: 10000, // 10 seconds
};

/**
 * Fetch wrapper with timeout and error handling
 * @param {string} url - The API endpoint URL
 * @param {object} options - Fetch options
 * @returns {Promise<object>} - The response data
 */
async function fetchWithTimeout(url, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new APIError(
                errorData.message || `HTTP Error: ${response.status}`,
                response.status,
                errorData
            );
        }

        if (response.status === 204) {
            return null;
        }

        const contentType = response.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
            return null;
        }

        const responseText = await response.text();
        return responseText ? JSON.parse(responseText) : null;
    } catch (error) {
        if (error instanceof APIError) {
            throw error;
        }
        if (error.name === 'AbortError') {
            throw new APIError('Request timeout', 'TIMEOUT');
        }
        throw new APIError(error.message || 'Network error', 'NETWORK_ERROR');
    } finally {
        clearTimeout(timeoutId);
    }
}

/**
 * Custom API Error class
 */
class APIError extends Error {
    constructor(message, statusCode = null, data = null) {
        super(message);
        this.name = 'APIError';
        this.statusCode = statusCode;
        this.data = data;
    }
}

/**
 * Get all users
 * @returns {Promise<Array>} - Array of user objects
 * @throws {APIError} - If the request fails
 */
async function getAllUsers() {
    try {
        const data = await fetchWithTimeout(`${API_CONFIG.BASE_URL}/users`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });

        // Ensure the response is an array
        return Array.isArray(data) ? data : data.data || [];
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
}

/**
 * Create a new user
 * @param {object} userData - User data object
 * @param {string} userData.firstName - User's first name
 * @param {string} userData.lastName - User's last name
 * @param {string} userData.email - User's email address
 * @param {string} [userData.phone] - User's phone number (optional)
 * @returns {Promise<object>} - The created user object
 * @throws {APIError} - If the request fails
 */
async function createUser(userData) {
    try {
        // Validate required fields
        if (!userData.firstName || !userData.lastName || !userData.email) {
            throw new APIError('firstName, lastName, and email are required fields', 'VALIDATION_ERROR');
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userData.email)) {
            throw new APIError('Invalid email format', 'VALIDATION_ERROR');
        }

        const response = await fetchWithTimeout(`${API_CONFIG.BASE_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                firstName: userData.firstName.trim(),
                lastName: userData.lastName.trim(),
                email: userData.email.trim(),
                phone: userData.phone ? userData.phone.trim() : null,
            }),
        });

        return response;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}

/**
 * Delete a user by ID
 * @param {string|number} userId - User ID
 * @returns {Promise<void>}
 * @throws {APIError} - If the request fails
 */
async function deleteUser(userId) {
    if (userId === null || userId === undefined || userId === '') {
        throw new APIError('User ID is required', 'VALIDATION_ERROR');
    }

    try {
        await fetchWithTimeout(`${API_CONFIG.BASE_URL}/users/${encodeURIComponent(userId)}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
}

/**
 * Format a date string to a readable format
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date
 */
function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch {
        return dateString || 'N/A';
    }
}

/**
 * Export API functions and utilities
 */
const API = {
    getAllUsers,
    createUser,
    deleteUser,
    formatDate,
    APIError,
    config: API_CONFIG,
};
