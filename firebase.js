// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  setDoc,
  doc
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// ✅ 1️⃣ Your Firebase configuration (replace with your actual config)
const firebaseConfig = {
  apiKey: "AIzaSyA5tMd9tXKnRuIe9tXm_cqrVNNimd-J6SA",
  authDomain: "to-do-list-3011.firebaseapp.com",
  projectId: "to-do-list-3011",
  storageBucket: "to-do-list-3011.firebasestorage.app",
  messagingSenderId: "118532137814",
  appId: "1:118532137814:web:953ac3ba0608d729a06cf7",
  measurementId: "G-GFLG14Y41F"
};

// ✅ 2️⃣ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ✅ 3️⃣ Login & Signup functionality
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");

loginBtn?.addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  if (!email || !password) return alert("Please fill in all fields!");

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("✅ Login successful!");
    window.location.href = "index.html"; // redirect to your To-Do app
  } catch (error) {
    alert("❌ " + error.message);
  }
});

signupBtn?.addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  if (!email || !password) return alert("Please fill in all fields!");

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("🎉 Account created successfully!");
    window.location.href = "index.html";
  } catch (error) {
    alert("❌ " + error.message);
  }
});

// ✅ 4️⃣ Check login state (used in index.html)
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User logged in:", user.email);
  } else {
    console.log("No user logged in.");
  }
});

// ✅ 5️⃣ Logout (add this in index.html if needed)
export async function logout() {
  await signOut(auth);
  window.location.href = "login.html";
}
