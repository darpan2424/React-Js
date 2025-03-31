# Project Management and Estimation System

A modern web application for managing projects and creating detailed cost estimations. Built with React, Redux Toolkit, and Material-UI.

## Features

- **Authentication System**
  - User registration and login
  - Password recovery
  - Protected routes
  - JWT token-based authentication

- **Project Management**
  - Create, read, update, and delete projects
  - Project status tracking (Pending, In Progress, Completed)
  - Project details including client, dates, and description
  - Search and filter projects

- **Estimation System**
  - Create detailed cost estimations
  - Organize estimations into sections
  - Add items with quantities, prices, and margins
  - Automatic total calculations
  - Currency formatting

- **Internationalization**
  - Support for English and Spanish languages
  - Language switching functionality
  - Automatic language detection

- **Responsive Design**
  - Mobile-friendly interface
  - Material-UI components
  - Consistent styling across devices

## Project Structure

```
src/
├── components/
│   ├── auth/           # Authentication components
│   │   └── RegisterForm.js
│   ├── common/         # Shared components
│   │   └── LanguageSwitcher.js
│   └── ProtectedRoute.js
├── layouts/            # Layout components
│   └── MainLayout.js
├── pages/             # Page components
│   ├── Login.js
│   ├── Register.js
│   ├── ForgotPassword.js
│   ├── Dashboard.js
│   ├── Projects.js
│   └── Estimations.js
├── store/             # Redux store configuration
│   ├── index.js
│   └── slices/        # Redux slices
│       ├── authSlice.js
│       ├── projectSlice.js
│       └── estimationSlice.js
├── services/          # API services
│   └── api.js
├── utils/            # Utility functions
│   └── validation.js
├── i18n/             # Internationalization
│   └── i18n.js
├── constants/        # Constants and configurations
│   └── index.js
├── theme.js         # Material-UI theme configuration
└── App.js           # Main application component
```

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd react-test
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
REACT_APP_API_URL=http://localhost:3001
```

## Running the Application

1. Start the mock server:
```bash
npm run server
```

2. In a new terminal, start the development server:
```bash
npm start
```

3. Open your browser and navigate to:
```
http://localhost:3000
```

The mock API will be available at:
```
http://localhost:3001
```

## Available Scripts

- `npm start` - Start the React development server
- `npm run server` - Start the mock API server
- `npm run build` - Build the production version
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## Design Choices

### State Management
- Redux Toolkit for global state management
- Async thunks for API calls
- Slice-based organization for better code splitting

### UI Framework
- Material-UI for consistent design
- Custom theme configuration
- Responsive layout system

### Form Handling
- Formik for form state management
- Yup for validation schemas
- Custom validation messages

### Routing
- React Router v6
- Protected routes with authentication
- Nested routing for better organization

### Internationalization
- i18next for translations
- Language detection
- Support for multiple languages

## API Endpoints

### Authentication
- POST `/auth/login` - User login
- POST `/auth/register` - User registration
- POST `/auth/forgot-password` - Password recovery

### Projects
- GET `/projects` - Get all projects
- POST `/projects` - Create a new project
- PUT `/projects/:id` - Update a project
- DELETE `/projects/:id` - Delete a project

### Estimations
- GET `/estimations` - Get all estimations
- POST `/estimations` - Create a new estimation
- PUT `/estimations/:id` - Update an estimation
- DELETE `/estimations/:id` - Delete an estimation

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.