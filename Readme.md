# 🚀 Project Manager Application

A full-stack MERN (MongoDB, Express.js, React, Node.js) application designed to streamline project and task management for teams. It provides a collaborative environment with Kanban-style task boards, user authentication, and project-specific functionalities.

## ℹ️ Live Demo
https://project-manager-backend-tmyq.onrender.com

## ✨ Features

### Security
- **User Authentication (JWT Auth):** Secure user registration and login using JSON Web Tokens (JWT) for authentication.
- **Secure Passwords:** All user passwords are hashed using a robust algorithm (e.g., bcrypt) before being stored in the database, ensuring high security.

### Project Creation & Joining
- Users can create new projects and become the project admin.
- Users can join existing projects by entering a unique project code.

### Dynamic Project Pages
- Each project has its own dedicated page with a dynamic route (`/projects/:projectId`) to display project-specific information and tasks.

### Kanban-style Task Management
- Tasks are organized into four intuitive columns: ToDo, Assigned, In Progress, and Completed.
- **Task Assignment:** Easily assign tasks to team members using a dropdown. Assigned tasks automatically move to the "Assigned" column.
- **Task Acceptance:** Assigned members can "Accept" tasks, moving them to the "In Progress" column.
- **Task Completion:** Mark tasks as "Completed" to move them to the respective column.
- **Task Deletion:** Any team member can delete a task by hovering over the task card and clicking the delete icon.

### Project Administration
- **Admin Privileges:** Project administrators have the ability to delete the entire project.
- **Team Member Options:** Non-admin team members have the option to leave a project.

### Responsive Design
- Built with Tailwind CSS for a modern, mobile-first, and responsive user interface.

## 🛠️ Technologies Used

### Frontend
- **React.js:** A JavaScript library for building user interfaces.
- **React Router DOM:** For declarative routing in React applications.
- **Axios:** Promise-based HTTP client for making API requests.
- **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
- **Vite:** Fast build tool for modern web projects.

### Backend
- **Node.js:** JavaScript runtime environment.
- **Express.js:** Fast, unopinionated, minimalist web framework for Node.js.
- **MongoDB:** A NoSQL database for flexible data storage.
- **Mongoose:** ODM (Object Data Modeling) library for MongoDB and Node.js.
- **jsonwebtoken (JWT):** For creating and verifying secure authentication tokens.
- **bcrypt.js:** For hashing passwords.
- **CORS:** Node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.
- **Render:** Deployment Platform

## ⚙️ Setup Instructions

Follow these steps to get the project running locally on your machine.

### Prerequisites
- Node.js (v14 or higher recommended)
- npm or Yarn
- MongoDB (local installation or cloud service like MongoDB Atlas)

### 1. Clone the Repository
```sh
git clone https://github.com/AayushVerma-04/project-manager
cd PROJECT-MANAGER
```

### 2. Backend Setup
Navigate into the backend directory, install dependencies, and set up environment variables.

```sh
cd backend
npm install # or yarn install
```

Create a `.env` file in the backend directory with the following variables:

```
PORT=5000
MONGO_URI=<Your MongoDB Connection String>
JWT_SECRET=<A strong, random secret string for JWT>
```

Replace `<Your MongoDB Connection String>` with your MongoDB URI (e.g., from MongoDB Atlas).

Replace `<A strong, random secret string for JWT>` with a long, random string.

Start the backend server:

```sh
npm start # or node server.js
```

The backend will run on [http://localhost:5000](http://localhost:5000) by default.

### 3. Frontend Setup
Open a new terminal, navigate into the frontend directory, install dependencies, and set up environment variables.

```sh
cd ../frontend
npm install # or yarn install
```

Create a `.env.development` file in the frontend directory:

```
VITE_API_BASE_URL=http://localhost:5000/api
```

This points your frontend to the local backend.

Start the frontend development server:

```sh
npm run dev # or vite
```

The frontend will typically run on [http://localhost:5173](http://localhost:5173) (or another port depending on Vite's default).

## 🤝 Contributing

Feel free to fork the repository, create a new branch, and submit
