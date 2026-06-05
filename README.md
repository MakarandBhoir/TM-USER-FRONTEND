# User Management Dashboard

A professional, responsive frontend web application for managing users. Built with vanilla HTML, CSS, and JavaScript (no frameworks).

## Features

- ✨ Modern, clean SaaS-inspired design
- 📱 Fully responsive (desktop, tablet, mobile)
- 🚀 Fast and lightweight (pure vanilla JavaScript)
- 🎯 Two main functionalities:
  - **Get All Users** - Fetch and display users list
  - **Create User** - Add new users via form
  - **Delete User** - Remove users from the list
- 🎨 Beautiful UI with Flexbox/Grid layouts
- ⚡ Real-time form validation
- 🔔 Toast notifications for user feedback
- 📊 User statistics sidebar
- ♿ Semantic HTML structure

## Project Structure

```
user-management-frontend/
├── index.html       # Main HTML structure
├── styles.css       # All styling (Flexbox/Grid, responsive)
├── app.js          # Application logic & DOM manipulation
├── api.js          # REST API communication layer
└── README.md       # This file
```

## File Descriptions

### index.html
- Main HTML structure with semantic markup
- Form for creating new users
- Users list table with loading/error/empty states
- Responsive header and sidebar

### styles.css
- CSS custom properties (variables) for theming
- Flexbox and CSS Grid layouts
- Responsive design with media queries (desktop, tablet, mobile)
- Dark borders and shadows for depth
- Smooth transitions and animations
- SaaS dashboard-inspired design

### api.js
- REST API service layer
- `getAllUsers()` - Fetch all users
- `createUser(userData)` - Create a new user
- Error handling with custom `APIError` class
- Request timeout handling
- Email validation
- Date formatting utilities
- Configurable API base URL

### app.js
- Application initialization and state management
- Event listener attachments
- Form submission handling
- User list rendering
- Loading/error/empty state management
- Toast notification system
- Input validation and XSS prevention

## Setup Instructions

### 1. Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Node.js with npm/yarn (optional, for running a local server)
- REST API backend with Swagger documentation

### 2. Configure API Endpoint

**Update the API base URL in `api.js`:**

```javascript
const API_CONFIG = {
    BASE_URL: 'http://localhost:8080/api', // Change this to your API URL
    TIMEOUT: 10000,
};
```

### 3. Run the Application

#### Option A: Using a Simple HTTP Server (Recommended)

**Using Python 3:**
```bash
python -m http.server 8000
```

**Using Python 2:**
```bash
python -m SimpleHTTPServer 8000
```

**Using Node.js (with http-server):**
```bash
npx http-server
```

Then open `http://localhost:8000` in your browser.

#### Option B: Open Directly in Browser
Simply open `index.html` in your browser. Works with local API calls if CORS is configured.

#### Option C: Using VS Code Live Server
1. Install the "Live Server" extension
2. Right-click on `index.html`
3. Select "Open with Live Server"

## API Integration

### Expected API Endpoints

The application expects the following REST API endpoints:

#### Get All Users
```
GET /api/users
```

**Response:**
```json
[
  {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1-234-567-8900",
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

#### Create User
```
POST /api/users
Content-Type: application/json
```

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "phone": "+1-234-567-8901"
}
```

**Response:**
```json
{
  "id": 2,
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "phone": "+1-234-567-8901",
  "createdAt": "2024-01-15T11:00:00Z"
}
```

## CORS Configuration

If your API and frontend are on different origins, ensure CORS is enabled on your backend:

```javascript
// Example Express.js CORS setup
const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:8000', // Your frontend URL
    credentials: true,
}));
```

## Usage Guide

### Creating a User

1. Fill in the form fields:
   - **First Name** (required)
   - **Last Name** (required)
   - **Email** (required, must be valid)
   - **Phone** (optional)
2. Click "Create User"
3. See success notification and user appears in the list

### Viewing Users

1. Users are automatically loaded on page load
2. Click "Refresh" to reload the list
3. Table displays: ID, First Name, Last Name, Email, Phone, Created Date
4. Total user count shown in sidebar

### Error Handling

- Network errors show clear error messages
- Form validation prevents invalid submissions
- API errors are caught and displayed
- Retry button appears on error state

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Customization

### Change Theme Colors

Edit the CSS variables in `styles.css`:

```css
:root {
    --color-primary: #2563eb;        /* Blue */
    --color-primary-hover: #1d4ed8;
    --color-success: #10b981;        /* Green */
    --color-error: #ef4444;          /* Red */
    --color-warning: #f59e0b;        /* Orange */
    /* ... more variables ... */
}
```

### Add More Fields

1. Add form inputs to `index.html`
2. Update `api.js` validation in `createUser()`
3. Add table columns to `index.html` table header
4. Update `createUserRow()` in `app.js` to display new fields

### Customize Styling

All styling uses CSS variables and can be easily customized:
- Spacing: `--spacing-*` variables
- Colors: `--color-*` variables
- Shadows: `--shadow-*` variables
- Transitions: `--transition-*` variables

## Performance Optimizations

- DOM element caching to minimize queries
- CSS transitions instead of JavaScript animations
- Debounced form submission
- Efficient state management
- Minimal bundle size (vanilla JavaScript)

## Security Features

- XSS prevention via `escapeHtml()` function
- Input validation in form and API
- Email format validation
- Secure error messages (no sensitive data)
- Timeout protection for API requests

## Troubleshooting

### Users not loading?
- Check if API URL is correct in `api.js`
- Verify API is running and accessible
- Check browser console for errors (F12)
- Ensure CORS is enabled if using different origins

### Form submission fails?
- Check email format
- Verify all required fields are filled
- Check API endpoint in `api.js`
- Look at network tab in DevTools for API errors

### Styling looks broken?
- Clear browser cache
- Ensure `styles.css` is in same directory
- Check browser console for CSS errors

### Mobile layout issues?
- Check viewport meta tag in `index.html`
- Test in actual mobile browser or DevTools

## Development Tips

1. Use browser DevTools (F12) to inspect and debug
2. Check Console tab for JavaScript errors
3. Use Network tab to monitor API calls
4. Use Elements tab to inspect HTML/CSS
5. Test on multiple screen sizes with DevTools responsive mode

## Future Enhancements

- Edit user functionality
- User search and filtering
- Pagination for large user lists
- Sort by columns
- Export to CSV
- Dark mode toggle
- User profile details view
- Form auto-save feature
- Offline support with Service Workers

## License

Free to use and modify for your projects.

## Support

For issues or questions:
1. Check the browser console for errors
2. Verify API endpoint configuration
3. Review the code comments in each file
4. Check CORS configuration on your backend

---

**Built with ❤️ using vanilla HTML, CSS, and JavaScript**
