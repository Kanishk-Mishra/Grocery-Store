# Grocery Store Web Application

```html
<iframe src="https://drive.google.com/file/d/1KnQvIeLW85F3PuPSA_C9XC82dFLIECPb/preview" width="640" height="480" allow="autoplay"></iframe>
```

## Introduction
The **GroceryStore** is a web-based application developed using **Vue.js** for the frontend and **Flask** (a Python-based web framework) for the backend. The application allows users to browse and purchase products across various categories while leveraging the dynamic (asynchronous) capabilities of modern web applications.

## Overview
This project consists of four major components:
- **Category Management** - Creation, Modification & Deletion
- **Product Management** - Creation, Modification & Deletion
- **Product Purchase**
- **Asynchronous Jobs** - Daily Reminders, Monthly Reports, CSV Download

Additionally, the project includes various features to enhance user experience:
- Role-based access control (**Admin / Store-Manager / User**)
- Login/Signup process
- Sending and approving requests
- Product & category search functionality
- Shopping cart feature
- API performance optimization & caching
- Product reviews and rating system
- Graphs displaying popular categories
- Aesthetic UI enhancements

## System Design
The application follows the **Model-View-Controller (MVC)** architecture and **client-server** architecture.

### Backend
- Built with **Flask** (Python)
- Uses **SQLAlchemy ORM** with an **SQLite** database
- API-driven approach (Flask-RESTful)
- Uses **Flask-Security-Too** for authentication & role management
- Backend task management with **Celery**
- Redis for caching and background task queueing
- Jinja templating used for **monthly reports** and **reminder emails**

### Frontend
- Built using **Vue.js**, a JavaScript framework for SPA (Single Page Applications)
- API-based communication with the backend
- Handles user interactions, product browsing, and shopping cart management

## Database Models
The system consists of six models:
1. **User**: Stores user credentials and relationships with other tables (Role, Category & Product)
2. **Role**: Stores role-based access control (**Admin, User, Store-Manager**)
3. **Category & Product**: Stores category and product details
4. **Rate**: Stores product ratings (star values from users)
5. **Purchase**: Stores user purchase records

## Functionalities
- Users must log in or sign up to access features beyond product viewing.
- **Admins** can create, update, and delete **categories**, while **Store Managers** can only request these actions.
- **Store Managers** require **Admin approval** for access, which can be revoked later.
- **Store Managers** can create, update, and delete **products**.
- **Store Managers** can download a **CSV report** of product details and stock.
- **Product search** is available for both store managers and customers.
- **Shopping cart** stores products for later purchase (persists across logins based on inventory availability).
- **Multi-category purchases** are supported.
- **Inactive users** receive **daily email reminders** about special offers.
- **Active customers** receive a **monthly expenditure report**.

## How to Run the Project
### Run the Application
```bash
# In WSL
python main.py
```

### Run Celery Workers
```bash
# Start the Celery worker
celery -A main:celery_app worker --loglevel INFO

# Start the Celery beat scheduler
celery -A main:celery_app beat --loglevel INFO
```

### Run Redis Server
```bash
# Start Redis server
redis-server
```

### Run MailHog
```bash
# Start MailHog
~/go/bin/MailHog
```

## Presentation Video
For a detailed overview, watch the presentation video here:
[Project Presentation Video](https://drive.google.com/file/d/1KnQvIeLW85F3PuPSA_C9XC82dFLIECPb/view?usp=sharing)

## Setup Instructions
### Prerequisites
- Python 3.x
- Node.js & npm
- Redis server
- Flask & Vue.js dependencies

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

### Frontend Setup
```bash
cd frontend
npm install
npm run serve
```

### Running Celery Worker
```bash
celery -A app.celery worker --loglevel=info
```

## License
This project is licensed under the MIT License.
