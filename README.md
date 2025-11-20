# 📝 Simple Note App

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Build](https://img.shields.io/badge/build-passing-brightgreen.svg)
![React](https://img.shields.io/badge/React-18+-61DAFB.svg?logo=react)
![Tailwind](https://img.shields.io/badge/TailwindCSS-3+-38BDF8.svg?logo=tailwindcss)
![Spring Boot](https://img.shields.io/badge/SpringBoot-3+-6DB33F.svg?logo=springboot)

---

## 🎯 Purpose
A **simple and efficient note-taking application** that allows users to create, edit, delete, and manage notes with ease.  
Built using **React + TailwindCSS** for the frontend and **Spring Boot** for the backend.

---

## 📌 High-Level Features
✅ Create notes  
✅ Edit notes  
❌ Delete notes  
📂 View and manage all notes  
⚡ Smooth UI with TailwindCSS  
🔗 Backend powered by Spring Boot (REST API)  

---

## 🗂️ Repository Structure
```bash
📁 simple-note-app/
├── 📁 frontend/     # React + TailwindCSS UI
├── 📁 backend/      # Spring Boot REST API
├── 📁 .github/      # GitHub Actions workflows
├── 📄 README.md
└── 📄 package.json
```

---

## ⚙️ Local Setup

### 📥 Clone the Repository
```bash
git clone https://github.com/FrancisGarryNillama/Simple-Notes-App.git
cd Simple-Note-App
```

---

## 🚀 Installation & Running

### ▶️ Frontend (React + Tailwind)
```bash
cd frontend
npm install
npm run dev
```

### ▶️ Backend (Spring Boot)
```bash
cd backend
./mvnw spring-boot:run
```

Frontend runs on:  
`http://localhost:5173`

Backend runs on:  
`http://localhost:8080`

---

## 🔗 Tech Stack

| Layer      | Technology |
|------------|-------------|
| Frontend   | React, TailwindCSS, Vite |
| Backend    | Spring Boot, Java, REST API |
| Database   | H2 / MySQL |
| Dev Tools  | VS Code, IntelliJ |

---

## 🌐 API Endpoints

| Method | Endpoint       | Description |
|--------|----------------|-------------|
| GET    | `/notes`       | Get all notes |
| GET    | `/notes/{id}`  | Get a note by ID |
| POST   | `/notes`       | Create a new note |
| PUT    | `/notes/{id}`  | Update a note |
| DELETE | `/notes/{id}`  | Delete a note |

---

## 🖥️ Frontend (React + TailwindCSS)
- Responsive and clean UI  
- Add/edit/delete notes  
- Real-time note list update  
- TailwindCSS utility styling  
- Modern React hooks & components  

---

## 🗃️ Notes Table Schema

| Field       | Type        |
|-------------|-------------|
| id          | Long        |
| title       | String      |
| content     | Text        |
| createdAt   | Timestamp   |
| updatedAt   | Timestamp   |

---

## 🧪 Testing & CI/CD
- JUnit tests for backend  
- GitHub Actions for CI  
- API testing (Postman)  

---

## 📈 System Architecture
```txt
+-------------+     HTTP      +--------------+      Database    +-------------+
|  Frontend   | <===========> |   Backend    | <==============> | Notes Table |
|  (React)    |               | (Spring Boot)|                  | (H2/MySQL)  |
+-------------+               +--------------+                  +-------------+
```

---

## 👥 Developers

<table align="center">
  <tr>
    <td align="center">
      <a href="https://github.com/ShayVC">
        <img src="https://avatars.githubusercontent.com/ShayVC" width="100px;" />
        <br /><b>Shayne Marie B. Angus</b>
      </a><br/>🌐 GitHub
    </td>
    <td align="center">
      <a href="https://github.com/Howardness">
        <img src="https://avatars.githubusercontent.com/Howardness" width="100px;" />
        <br /><b>Mac Howard Caranzo</b>
      </a><br/>🌐 GitHub
    </td>
    <td align="center">
      <a href="https://github.com/FrancisGarryNillama">
        <img src="https://avatars.githubusercontent.com/FrancisGarryNillama" width="100px;" />
        <br /><b>Francis Garry S. Nillama</b>
      </a><br/>🌐 GitHub
    </td>
    <td align="center">
      <a href="https://github.com/drN-n">
        <img src="https://avatars.githubusercontent.com/drN-n" width="100px;" />
        <br /><b>Aldrin R. Mangubat</b>
      </a><br/>🌐 GitHub
    </td>
  </tr>
</table>

---

## 🏁 Future Improvements
🚀 Add tags/categories for notes  
📝 Add markdown support  
🔒 PIN / lock feature for protected notes  
💎 Add wallet integration support
