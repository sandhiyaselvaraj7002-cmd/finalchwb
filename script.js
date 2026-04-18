// ===================== 🔥 FIREBASE IMPORTS =====================
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";

// ===================== 🔥 FIREBASE CONFIG =====================
 const firebaseConfig = {
    apiKey: "AIzaSyDwh8I7Q-rznqld_yKTI8NZoKNCYNQFJFw",
    authDomain: "usspace-81fc6.firebaseapp.com",
    projectId: "usspace-81fc6",
    storageBucket: "usspace-81fc6.firebasestorage.app",
    messagingSenderId: "759765363721",
    appId: "1:759765363721:web:a894ba10e2878aba8d9cd8",
    measurementId: "G-53ZX9KXDYS"
  };


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ===================== 💬 CORE MESSAGING =====================

async function sendMessage(textOverride = null) {
    const input = document.getElementById("message");
    const msgText = textOverride || (input ? input.value.trim() : null);
    
    if (!msgText) return;

    // Get sender or default to "Me"
    const currentSender = localStorage.getItem("chatName") || "User";

    try {
        await addDoc(collection(db, "messages"), {
            text: msgText,
            time: Date.now(),
            sender: currentSender
        });
        
        if (input && !textOverride) input.value = "";
        console.log("Message sent successfully!");
    } catch (err) {
        console.error("Firebase Send Error:", err);
        alert("Check your Firebase API Key!");
    }
}

function loadMessages() {
    const chatBox = document.getElementById("chatBox");
    if (!chatBox) return;

    const q = query(collection(db, "messages"), orderBy("time"));

    onSnapshot(q, (snapshot) => {
        chatBox.innerHTML = "";
        const myName = localStorage.getItem("chatName") || "User";

        snapshot.forEach((doc) => {
            const data = doc.data();
            const isMe = data.sender === myName;

            const div = document.createElement("div");
            div.className = `message ${isMe ? "my-msg" : "other-msg"}`;
            div.innerHTML = `
                <b>${data.sender}</b><br>
                ${data.text}<br>
                <small>${new Date(data.time).toLocaleTimeString()}</small>
            `;
            chatBox.appendChild(div);
        });
        chatBox.scrollTop = chatBox.scrollHeight;
    });
}

// ===================== 💖 HEART BUTTON =====================

function triggerMissYou() {
    if (navigator.vibrate) navigator.vibrate(200);
    sendMessage("Missing you ❤️");
}

// ===================== 👤 PROFILE & UI =====================

function changeName() {
    const name = prompt("What's your name?");
    if (name) {
        localStorage.setItem("chatName", name);
        location.reload();
    }
}

// ===================== 🌍 EXPOSE TO HTML =====================

window.sendMessage = () => sendMessage();
window.missYou = triggerMissYou;
window.quickMissYou = triggerMissYou;
window.changeName = changeName;
window.openChat = () => location.href = "chat.html";
window.goHome = () => location.href = "home.html";
window.openNotes = () => location.href = "notes.html";
window.goChat = () => location.href = "chat.html";

window.onload = () => {
    loadMessages();
    
    // Load Name Display
    const nameEl = document.getElementById("chatName") || document.getElementById("homeName");
    if (nameEl) {
        nameEl.innerText = localStorage.getItem("chatName") || "My Person 💜";
    }
};