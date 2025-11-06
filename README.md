

# Backend

---
- Navigate to the backend folder from root directory
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;``cd ../backend``
- Python 3.10 or later

- Create a virtual environment
	`python -m venv venv`
    `venv\Scripts\activate`

- All dependencies are listed in `requirements.txt`.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;To install them, run:

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<u>_```bash```_</u>

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;``pip install -r requirements.txt``

- create a .env file from .env.template

- run the server using the command

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<u>_```bash```_</u>

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;``uvicorn main:app --reload``

The backend will start on **http://127.0.0.1:8000**

---

# Frontend

- Install node.js: https://nodejs.org/en/

- Navigate to the frontend folder from root directory

  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;``cd ../frontend``
- Install dependencies
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;``npm install``

- create a .env file from .env.template in the frontend folder


- run the server using the command

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<u>_```bash```_</u>

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;``npm start``

The app will open on **http://localhost:3000**
