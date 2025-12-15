# 💻 Developer Knowledge Base – React frontend for Snippet API

*Disclaimer: ChatGPT was used to help translate and structure this README.*

This project is a small front built with React.  
It acts as a *“Developer Knowledge Base”* on top of my existing *Snippet API (Project 2)*.

The app lets me:

- log in / register with email & password  
- browse all stored code snippets 
- filter snippets by language
- add new snippets
- copy snippet code to clipboard
- delete snippets

---

## 🔗 Live demo & backend

- 🌐 **Live frontend (GitHub Pages):**  
  `https://arttujuolahti.github.io/Project3-react/`
- 🛠 **Backend API (Project 2 on Render):**  
  `https://snippet-api-1xz2.onrender.com`

---

## 🧩 Tech stack

### Frontend

- **React** (functional components + hooks)
  - `useState`, `useEffect`
- **Vite** – development server & build tool
- **React Router DOM**
- Login route and main dashboard route
- **Axios** – HTTP client for API requests
- **Bootstrap** – layout and styling
- **react-syntax-highlighter (Prism)** – code block syntax highlighting
  - Theme: `oneDark`
- **Custom hook `useApi`**
  - shared logic for GET / POST / DELETE to the backend


## Learning reflections and future ideas 

In this project I learned how to connect a modern React frontend to an existing REST API and make them feel like one coherent application. 
Building the custom useApi hook helped me understand how to reuse data-loading logic, manage loading and error states, and keep the UI in sync with the backend. 
I also got more comfortable working with environment variables and separating concerns: the frontend only knows the public API URL, while all sensitive details stay safely on the backend.

One clear improvement for the future would be to make snippets user-specific instead of global. Right now, every logged-in user can see the same shared snippet list.
A better design would attach a userId to each snippet and filter them per logged-in user, or allow “private vs shared” snippets. 
That would turn this into a more personal knowledge base where each developer can safely store their own code library while still optionally sharing selected snippets with others.
