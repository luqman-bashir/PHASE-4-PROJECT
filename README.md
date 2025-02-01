# Learning Management System
# By Luqman Bashir
# 31/1/2025

Develop a web-based Educational Management System that allows administrators to manage instructors, students, and courses via a user-friendly React frontend with a Flask-powered RESTful backend.

## Table of Contents
-Project Description
-Features
-Technologies Used
-File Structure
-Installation
-Usage
-API
-Live Server
-Contributors
-License
-Project Description

## Core Features

### Instructor Management
Add, view, update, and delete instructors.
Display the courses assigned to each instructor.

### Course Management
Add, view, update, and delete courses.
Assign instructors to courses.
Track students enrolled in each course.

### Student Management
Add, view, update, and delete student information.
Enroll students in courses.
View courses a student is enrolled in.


## Features
-User Authentication: Secure user registration and login using JWT authentication.
-Add Video: Users can add new educational videos.
-Edit Video: Users can edit existing videos.
-Delete Video: Users can delete videos they have uploaded.
-Search Functionality: Users can search for videos by title or category.

## Technologies Used
### Frontend:
React: For creating a responsive and interactive user interface.
React Router: For routing between pages (dashboard, instructors, courses, students).
Axios: For making API calls to the backend.
Styling: TailwindCSS
### Backend:
Flask: RESTful API framework for the backend logic.
Flask-SQLAlchemy: ORM for database management.
Flask-JWT-Extended: Authentication and role-based access.
Flask-Cors: To handle cross-origin requests between React and Flask.

### File Structure
bash
Copy code
/LMS-Project
├── /backend                           # Backend folder
│   ├── /instance                     # Configuration and database instance
│   │   └── LMS.db                    # SQLite database file
│   │
│   ├── /migrations                   # Alembic migration files
│   │   └── versions                  # Specific migration scripts
│   │
│   ├── /views                        # Flask routes
│   │   ├── auth.py                   # Authentication (login, registration)
│   │   ├── course.py                 # Course management routes
│   │   ├── enrollment.py             # Enrollment management routes
│   │   └── user.py                   # User management routes
│   │
│   ├── __init__.py                   # Package initializer
│   ├── app.py                        # Main application entry for Flask
│   ├── models.py                     # SQLAlchemy models
│   ├── database.py                   # Database setup and connection
│   ├── .env                          # Environment variables
│   ├── requirements.txt              # Backend dependencies
│   ├── Pipfile                       # Dependency manager
│   └── Pipfile.lock                  # Locked dependency versions
│
├── /frontend                         # Frontend folder
│   ├── /node_modules                 # Dependencies (handled by npm)
│   │
│   ├── /src                          # React app source files
│   │   ├── /components               # Reusable components
│   │   │   ├── Footer.js             # Footer for pages
│   │   │   ├── Navbar.js             # Navigation bar
│   │   │   └── other components...   # Other reusable components
│   │   │
│   │   ├── /context                  # React Context for global state
│   │   │   ├── UserContext.jsx       # Manages user data globally
│   │   │
│   │   ├── /pages                    # Page components
│   │   │   ├── Home.jsx              # Home page
│   │   │   ├── Login.jsx             # Login page
│   │   │   ├── Register.jsx          # Register page
│   │   │   ├── DashBoard.jsx         # Dashboard
│   │   │   ├── ManageCourse.jsx      # Manage courses
│   │   │   ├── ManagingStudent.jsx   # Manage students
│   │   │   ├── Profile.jsx           # User profile
│   │   │   └── NoPage.jsx            # 404 page
│   │   │
│   │   ├── /styles                   # Styling files
│   │   │   ├── App.css               # Global styles
│   │   │   └── index.scss            # SCSS styles
│   │   │
│   │   ├── App.js                    # Main React component
│   │   ├── index.js                  # Entry point
│   │   ├── vite.config.js            # Vite configuration
│   │   └── other files...            # Miscellaneous configurations
│   │
│   ├── public                        # Publicly served files
│   │   └── index.html                # Main HTML file
│   │
│   ├── package.json                  # Frontend dependencies and scripts
│   ├── package-lock.json             # Locked dependency versions
│   └── README.md                     # Frontend documentation
│
├── LICENSE.md                        # License for the project
├── README.md                         # Main project documentation
└── .gitignore                        # Files to ignore in Git

Installation
1. Clone the repository
bash
Copy code
git clone https://github.com/yourusername/educational-video-app.git
cd educational-video-app
2. Install backend dependencies
bash
Copy code
cd backend
pip install -r requirements.txt
3. Apply database migrations
bash
Copy code
alembic upgrade head
4. Install frontend dependencies
bash
Copy code
cd ../frontend
npm install
Usage
Start the Backend Server
Run the following command in the backend directory:

bash
Copy code
uvicorn app.main:app --reload
Start the Frontend Development Server
Run the following command in the frontend directory:

bash
Copy code
npm start
Access the Application

## API
Authentication:
POST /auth/login: Login with email and password.
POST /auth/register: Register a new admin.
POST /auth/logout: Logout a user.
GET /auth/me: Get details of the logged-in user.

Instructor Management:
POST /instructors: Add a new instructor.
GET /instructors: List all instructors.
GET /instructors/<id>: Get details of a specific instructor.
PUT /instructors/<id>: Update instructor details.
DELETE /instructors/<id>: Delete an instructor.

Course Management:
POST /courses: Add a new course.
GET /courses: List all courses.
GET /courses/<id>: Get details of a specific course.
PUT /courses/<id>: Update course details.
DELETE /courses/<id>: Delete a course.

Student Management:
POST /students: Add a new student.
GET /students: List all students.
GET /students/<id>: Get details of a specific student.
PUT /students/<id>: Update student details.
DELETE /students/<id>: Delete a student.


### Live Server
-This is the explanation of my project[Screen recording](https://app.screencastify.com/v2/manage/videos/qqbP4J3qTnTpZusk06Zn).
-Frontend[live](https://lms-ten-gray.vercel.app/)
-View my slides[Slides](https://www.canva.com/design/DAGZ0IKhHtA/xqZMkhqa5xnm2mu-LUg2GA/view?utm_content=DAGZ0IKhHtA&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h8c7d772e6d).

-Watch the [live demo](https://peaceful-snickerdoodle-11c590.netlify.app/auth).



### License

[MIT License](https://github.com/luqman-bashir/PHASE-4-PROJECT/blob/main/LICENSE.md)
