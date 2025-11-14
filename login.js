// ==========================
// Firebase Configuration
// ==========================
const firebaseConfig = {
  apiKey: "AIzaSyA5tMd9tXKnRuIe9tXm_cqrVNNimd-J6SA",
  authDomain: "to-do-list-3011.firebaseapp.com",
  projectId: "to-do-list-3011",
  storageBucket: "to-do-list-3011.firebasestorage.app",
  messagingSenderId: "118532137814",
  appId: "1:118532137814:web:953ac3ba0608d729a06cf7",
  measurementId: "G-GFLG14Y41F"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// -------------------- Login & Signup --------------------
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

// ✅ Login existing user
loginBtn.addEventListener("click", () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    alert("Please enter email and password.");
    return;
  }

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      localStorage.setItem("currentUserEmail", email); // ✅ store logged-in user
      alert("Login successful!");
      window.location.href = "index.html"; // Redirect to home
    })
    .catch((error) => {
      alert("❌ " + error.message);
    });
});

// 🆕 Create a new user
signupBtn.addEventListener("click", () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    alert("Please enter email and password.");
    return;
  }

  auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      localStorage.setItem("currentUserEmail", email); // ✅ store logged-in user
      alert("Account created successfully!");
      window.location.href = "index.html"; // Redirect to home
    })
    .catch((error) => {
      alert("❌ " + error.message);
    });
});

// -------------------- Session Management --------------------
auth.onAuthStateChanged((user) => {
  const currentPage = window.location.pathname.split("/").pop();

  if (user && currentPage === "login.html") {
    console.log("User logged in:", user.email);
    // Stay on login page until user clicks login (prevents auto redirect)
  } else if (!user && currentPage === "index.html") {
    // Prevent direct access to main app
    window.location.href = "login.html";
  }
});

// -------------------- Logout Helper --------------------
function logout() {
  auth.signOut().then(() => {
    localStorage.removeItem("currentUserEmail"); // ✅ remove user email on logout
    alert("Logged out successfully.");
    window.location.href = "login.html";
  }).catch((error) => {
    alert("❌ " + error.message);
  });
}
