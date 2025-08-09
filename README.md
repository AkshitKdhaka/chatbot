# 🧠 AI Chatbot Microservice with Groq + LLaMA 3 (Next.js + MongoDB)

This project is an AI-powered chatbot microservice that you can plug into **any website or app**. It uses:

- 🧠 [Groq](https://console.groq.com/) + **LLaMA 3 70B (Versatile)** model for free AI responses
- 🧱 **Next.js App Router** for combining frontend + API backend
- 🪄 **Tailwind CSS** for styling
- 🌱 **MongoDB Atlas** for message history
- 🔌 Designed to be used as a **microservice with a JS SDK** or directly from Postman

---

## 🚀 Features

✅ Chat with LLaMA 3 (70B) for free using Groq API  
✅ Stores user/assistant messages in MongoDB  
✅ API-first architecture for easy integration  
✅ JavaScript SDK for embedding on any site  
✅ Built with Next.js App Router + TypeScript + Tailwind

---

---

## 🔧 Setup & Installation

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/ai-chatbot.git
cd ai-chatbot
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Environment Variables
Create a .env file:
```bash 
GROQ_API_KEY=your_groq_api_key_here
MONGODB_URI=your_mongodb_connection_uri_here
```
### 4. Run Locally
```bash 
npm run dev
```

### 📬 API Usage
Endpoint
POST /api/chat

### 🧠 LLaMA 3 via Groq
Model used: llama-3-70b-8192 or llama-3-3-70b-versatile

Docs: https://console.groq.com/docs

### 🛠 Technologies Used
Next.js

TypeScript

Tailwind CSS

MongoDB Atlas

Groq API


### 🙌 Credits
Built with ❤️ Akshit
Powered by Groq + Meta’s LLaMA 3
