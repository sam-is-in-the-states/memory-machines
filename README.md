This Website allows users to generate a live transcript while speaking, and then generate key topics from the same speech. The website will also identify the emotion and change the Aura Particles based on the indentified emotion.

# Aura Particle Effects

- ## Particle Color:
-   **0-0.2 (Very Negative)**: Deep Blue
-   **0.2-0.4 (Negative)**: Blue-cyan
-   **0.4-0.6 (Neutral)**: Cyan-Green
-   **0.6-0.8 (Slightly Positive)**: Yellow-orange
-   **0.8-1.0 (Very Positive)**: Orange-red

- ## Particle Behavior:

-   **0-0.2 (Very Negative)**: Chaotic, aggressive movement with high speed (3.5) and lots of randomness
-   **0.2-0.4 (Negative)**: Tense, jittery motion with moderate randomness
-   **0.4-0.6 (Neutral)**: Restless, wandering with subtle variations
-   **0.6-0.8 (Slightly Positive)**: Smooth, flowing movement
-   **0.8-1.0 (Very Positive)**: Graceful, gentle gliding motion

- ## Flow Field Patterns:

-   **0-0.2**: Violent turbulence with fast-oscillating sine waves creating sharp disruptions
-   **0.2-0.4**: Sharp, angular changes with quantized directions for a jittery feel
-   **0.4-0.6**: Subtle wavering with gentle sine perturbations
-   **0.6-0.8**: Gentle spirals emanating from center with soft oscillations
-   **0.8-1.0**: Expansive, flowing spirals with harmonious wave patterns


# Backend

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

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;``uvicorn app.main:app --reload --host 0.0.0.0 --port 8000``

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
