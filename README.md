<h1 align="center">
  QuizBot
</h1>

<p align="center">
  <a href="#about">About</a> •
  <a href="#preview">Preview</a> •
  <a href="#features">Features</a> •
  <a href="#techs">Technologies</a> •
  <a href="#usage">Usage</a>
</p>

<h2 id="about">About</h2>
<p>
<strong>QuizBot</strong> is a bot that allows the users to chat with their uploaded documents(*.pdf, *.docx, *.txt), and also extract the bloom's taxonomy questions on the different level. <br />

</p>

<h2 id="preview">Preview</h2>

<div align="center">
  <img src="preview/1. Auth.png" width="200">
  <img src="preview/2. Bots.png" width="200">
  <img src="preview/3. Chat.png" width="200">
  <img src="preview/4. Training_Documents.png" width="200">
  <img src="preview/5. QA.png" width="200">
  <img src="preview/6. MCQ.png" width="200">
</div>

<h2 id="features">Features</h2>

- Authentication
- Chat with documents
- Extract bloom's taxonomy question on high, medium, low level
- Contact us

### Plan to add

- Voice chat

<h2 id="techs">Technologies</h2>

- Frontend - React | TailwindCSS | Vite
- Backend - Express.js
- DB - MySQL
- NLP Framework - Javascript Langchain
- NLP API - OpenAI
- VectorDB - Pinecone

<h2 id="usage">Usage</h2>

Assuming that you have a React environment ready:

<p><b>1.</b> Clone the project </p>

```bash
$ git clone https://github.com/BestHappy90619/QuizBot.git
```

<p><b>2.</b> Install packages </p>

```bash
$ cd backend
$ yarn install
$ cd..
$ cd frontend
$ yarn install
```

<p><b>3.</b> Install database with quizbot.sql</p>

<p><b>4.</b> Set up environments </p>

<h6> Change the file name ./backend/.env.example to .env </h6>

<h6> DB_HOST: Your database's host url </h6>

<h6> DB_USER: The user name to access your database </h6>

<h6> DB_PASS: The user password to access your database </h6>

<h6> DB_NAME: The databse name </h6>

<h6> JWT_SECRET_KEY: The key for JSON Web Token </h6>

<h6> PORT: The port of the server to be hosting </h6>

<h6> PUBLIC_URL: The public folder on the side of backend </h6>

<h6> PINECONE_API_KEY: Your Pinecone API key </h6>

<h6> PINECONE_ENVIRONMENT: Your Pinecone environment </h6>

<h6> PINECONE_INDEX_NAME: Your Pinecone index name </h6>

<h6> MAILER_SERVICE: Your mailer service </h6>

<h6> MAILER_HOST: Your mailer server </h6>

<h6> MAILER_PORT: Your mailer's port </h6>

<h6> MAILER_SECURE: Your mailer secure </h6>

<h6> MAILER_USER: Your mailer user </h6>

<h6> MAILER_PASS: Your mailer password </h6>

<h6> CONTACT_MAIL_ADDRESS: Contact address </h6>

<h6> SELF_URL: The backend's hosting url </h6>

<p><b>5.</b> Run the backend and frontend </p>
