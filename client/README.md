# 🎓 QuizGenieAI

QuizGenieAI is a smart, AI-powered quiz platform built to generate, manage, and play quizzes with a delightful and responsive user interface. Designed for students, educators, and self-learners, it uses AI to generate custom questions and streamline quiz creation, all while supporting both dark and light themes.

![QuizGenieAI Banner](https://your-app-screenshot-url.com/banner.png)

---

## 🚀 Features

- 🔐 **Authentication System** – Secure login/signup with protected routes.
- 🧠 **AI-Powered Quiz Generation** – Generate quizzes instantly using AI (OpenAI GPT).
- 🎯 **MCQ-Based Quizzes** – Create, take, and review multiple-choice quizzes.
- 🌙 **Dark & Light Mode** – Toggle between themes for a smooth UX.
- 📊 **Performance Tracking** – Get feedback on correct, incorrect, and skipped answers.
- 💾 **Backend Integration** – Stores quizzes and results using MongoDB.
- 🎨 **Modern UI** – Built with React, styled with custom CSS and gradients (blue, purple, pink, white, black).

---

## 🧰 Tech Stack

### Frontend
- **React.js**
- **Tailwind CSS / Custom CSS**
- **React Router**
- **Context API** for Theme & Auth
- **Framer Motion** for animations

### Backend
- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose**
- **JWT Authentication**
- **OpenAI API** for AI-generated quizzes

---

## 🛠️ Installation

### Prerequisites

- Node.js (v18+)
- npm or yarn
- MongoDB running locally or Atlas URI
- OpenAI API Key

### Clone and Run

```bash
git clone https://github.com/yourusername/quizgenieai.git
cd quizgenieai

# Run backend
cd server
npm install
touch .env
# Add MONGO_URI and OPENAI_API_KEY
npm run dev

# Run frontend
cd ../client
npm install
npm start



quizgenieai/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # Navbar, QuizCard, etc.
│   │   ├── pages/           # Home, Login, Dashboard
│   │   ├── context/         # ThemeContext, AuthContext
│   │   ├── App.js
│   │   └── index.css
├── server/                  # Express backend
│   ├── routes/              # quiz, auth
│   ├── controllers/
│   ├── models/
│   ├── utils/
│   └── server.js
