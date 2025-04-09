import { useState, useEffect } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import { doc, setDoc, getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { Dashboard } from "./dashboard";


// Main Auth Component
export default function QuizAuthDashboard() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [quizCode, setQuizCode] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [verificationSent, setVerificationSent] = useState(false);
  const db = getFirestore();


  console.log(user);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      try {
        setUser(currentUser);
        if (currentUser?.emailVerified) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Auth state error:", error);
      }
    });
    
    return () => {
      // Properly unsubscribe
      unsubscribe();
    };
  }, []);

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkUsernameExists = async (username) => {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("username", "==", username));
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error("Firestore query error:", error);
      // Treat as if username exists to prevent duplicates
      return true;
    }
  };

  const handleQuickJoin = (e) => {
    e.preventDefault();
    alert(`Attempting to join quiz with code: ${quizCode}`);
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isSignup) {
        if (username.trim() === "") {
          setUsernameError("Username is required");
          setIsLoading(false);
          return;
        }

        const usernameExists = await checkUsernameExists(username);
        if (usernameExists) {
          setUsernameError("Username already taken");
          setIsLoading(false);
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

          // Write to Firestore FIRST while user is authenticated
        await setDoc(doc(db, "users", userCredential.user.uid), {
        email: userCredential.user.email,
        fullName: fullName.trim(),
        username: username.trim().toLowerCase(),
        createdAt: new Date(),
        quizzesTaken: 0,
        averageScore: 0,
        emailVerified: false
      });
        
        // Then send verification email
      await sendEmailVerification(userCredential.user);
      setVerificationSent(true);
        
        await signOut(auth);
        alert("Signup successful! Please verify your email before logging in.");
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        if (!userCredential.user.emailVerified) {
          alert("Please verify your email before logging in.");
          await signOut(auth);
          setIsLoading(false);
          return;
        }
        setIsAuthenticated(true);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      alert("Please enter your email to reset password");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent. Check your inbox!");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setIsAuthenticated(false);
  };

  if (isAuthenticated) {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Quick Join Section */}
      <div className="bg-white shadow-md py-4 px-6">
        <div className="max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Join a Quiz Quickly</h3>
          <form onSubmit={handleQuickJoin} className="flex gap-2">
            <input
              type="text"
              value={quizCode}
              onChange={(e) => setQuizCode(e.target.value)}
              placeholder="Enter quiz code"
              className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              required
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Join
            </button>
          </form>
        </div>
      </div>

      {/* App Header */}
      <header className="py-8 flex flex-col items-center justify-center">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <h1 className="ml-4 text-3xl font-bold text-indigo-800">SmartQuiz</h1>
        </div>
        <p className="text-indigo-600 text-lg">Test your knowledge, grow your skills</p>
      </header>

      {/* Auth Form */}
      <main className="flex-grow flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
              {isSignup ? "Create Your Account" : "Welcome Back"}
            </h2>
            
            {verificationSent && (
              <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded-lg text-sm">
                Verification email sent! Please check your inbox (and spam folder).
              </div>
            )}
            
            <form onSubmit={handleAuth} className="space-y-4">
              {isSignup && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      required
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        setUsernameError("");
                      }}
                      className={`w-full px-4 py-2 border ${usernameError ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition`}
                      required
                      placeholder="Choose a unique username"
                    />
                    {usernameError && <p className="text-red-500 text-xs mt-1">{usernameError}</p>}
                  </div>
                </>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  required
                  placeholder="your@email.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  required
                  placeholder="••••••••"
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full px-4 py-2 rounded-lg text-white font-medium transition ${
                  isLoading ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : isSignup ? (
                  "Sign Up"
                ) : (
                  "Login"
                )}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  setIsSignup(!isSignup);
                  setUsernameError("");
                  setVerificationSent(false);
                }}
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition"
              >
                {isSignup ? "Already have an account? Login" : "Don't have an account? Sign up"}
              </button>
            </div>

            {!isSignup && (
              <div className="mt-3 text-center">
                <button
                  onClick={handleForgotPassword}
                  className="text-gray-600 hover:text-gray-800 text-sm transition"
                >
                  Forgot Password?
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="py-4 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} SmartQuiz. All rights reserved.
      </footer>
    </div>
  );
}