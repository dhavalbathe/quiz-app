import { useState, useEffect, useRef } from "react";

// New Quiz Component
const QuizComponent = ({ quiz, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes in seconds
  const [answeredQuestions, setAnsweredQuestions] = useState([]);

  const questions = quiz.questions;

  useEffect(() => {
    if (timeLeft > 0 && !quizCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !quizCompleted) {
      setQuizCompleted(true);
    }
  }, [timeLeft, quizCompleted]);

  const handleOptionSelect = (optionIndex) => {
    setSelectedOption(optionIndex);
  };

  const handleNextQuestion = () => {
    // Check if answer is correct
    const isCorrect = selectedOption === questions[currentQuestionIndex].correctAnswer;
    
    // Update score if correct
    if (isCorrect) {
      setScore(score + 1);
    }
    
    // Record answered question
    setAnsweredQuestions([
      ...answeredQuestions,
      {
        questionIndex: currentQuestionIndex,
        selectedOption,
        isCorrect
      }
    ]);
    
    // Move to next question or complete quiz
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
    } else {
      setQuizCompleted(true);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (quizCompleted) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Quiz Completed!</h2>
        <div className="text-center mb-8">
          <p className="text-lg mb-2">Your score:</p>
          <p className="text-4xl font-bold text-indigo-600">
            {score} / {questions.length}
          </p>
          <p className="text-gray-500 mt-2">
            ({Math.round((score / questions.length) * 100)}%)
          </p>
        </div>
        
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3">Question Review:</h3>
          <div className="space-y-3">
            {answeredQuestions.map((item, idx) => (
              <div key={idx} className={`p-3 rounded ${item.isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
                <p className="font-medium">{questions[item.questionIndex].question}</p>
                <p className={`text-sm ${item.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                  Your answer: {questions[item.questionIndex].options[item.selectedOption]}
                  {!item.isCorrect && (
                    <span className="text-green-600 block">
                      Correct answer: {questions[item.questionIndex].options[questions[item.questionIndex].correctAnswer]}
                    </span>
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        <button
          onClick={() => onComplete()}
          className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">{quiz.title}</h2>
        <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
          Time Left: {formatTime(timeLeft)}
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-500 mb-1">
          <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
          <span>Score: {score}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-indigo-600 h-2 rounded-full" 
            style={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">
          {questions[currentQuestionIndex].question}
        </h3>
        <div className="space-y-3">
          {questions[currentQuestionIndex].options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleOptionSelect(idx)}
              className={`w-full text-left p-3 rounded-md border transition-colors ${
                selectedOption === idx 
                  ? 'border-indigo-500 bg-indigo-50' 
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      
      <button
        onClick={handleNextQuestion}
        disabled={selectedOption === null}
        className={`w-full py-2 rounded-md transition-colors ${
          selectedOption === null
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-indigo-600 text-white hover:bg-indigo-700'
        }`}
      >
        {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
      </button>
    </div>
  );
};

// Updated Dashboard Component
export const Dashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState("practice");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showCreateButton, setShowCreateButton] = useState(true);
  const [quizCode, setQuizCode] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [pulseQoD, setPulseQoD] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState(null);
  
  const profileDropdownRef = useRef(null);

  // Enhanced practice quiz data with questions
  const practiceQuizzes = [
    {
      id: 1,
      title: "JavaScript Basics",
      questionCount: 20,
      difficulty: "Beginner",
      category: "Programming",
      questions: generateJavaScriptQuestions()
    },
    {
      id: 2,
      title: "HTML Fundamentals",
      questionCount: 20,
      difficulty: "Beginner",
      category: "Web Development",
      questions: generateHTMLQuestions()
    },
    {
      id: 3,
      title: "CSS Styling",
      questionCount: 20,
      difficulty: "Beginner",
      category: "Web Design",
      questions: generateCSSQuestions()
    }
  ];

  useEffect(() => {
    setIsLoaded(true);
    
    const interval = setInterval(() => {
      setPulseQoD(true);
      setTimeout(() => setPulseQoD(false), 1500);
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    if (showProfileDropdown) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [showProfileDropdown]);

  const handleJoinQuiz = (e) => {
    e.preventDefault();
    if (quizCode.trim()) {
      alert(`Joining quiz with code: ${quizCode}`);
      setQuizCode("");
    } else {
      alert("Please enter a valid quiz code");
    }
  };

  const startQuiz = (quiz) => {
    setActiveQuiz(quiz);
  };

  const completeQuiz = () => {
    setActiveQuiz(null);
  };

  if (activeQuiz) {
    return <QuizComponent quiz={activeQuiz} onComplete={completeQuiz} />;
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {/* Rest of the existing code remains the same until the practice section */}


      <div className="bg-gradient-to-r from-indigo-100 to-purple-100 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleJoinQuiz} className="flex items-center justify-center">
            <label htmlFor="quizCode" className="font-medium text-indigo-800 mr-3">
              Join Quiz:
            </label>
            <input
              type="text"
              id="quizCode"
              value={quizCode}
              onChange={(e) => setQuizCode(e.target.value)}
              placeholder="Enter quiz code"
              className="px-4 py-2 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 hover:shadow-md"
            />
            <button
              type="submit"
              className="ml-3 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 hover:shadow-md"
            >
              Join
            </button>
          </form>
        </div>
      </div>



{/* Navigation Bar with enhanced styling */}
<nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center transform hover:scale-105 transition-transform duration-300">
                <svg className="h-8 w-8 text-indigo-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" />
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <h1 className="ml-2 text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">SmartQuiz</h1>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => alert("Quiz of the Day feature will open here")}
                className={`px-5 py-2 mr-6 bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-base rounded-md hover:from-yellow-600 hover:to-amber-600 transition-all duration-300 transform hover:scale-105 hover:shadow-md ${pulseQoD ? 'animate-pulse' : ''}`}
              >
                QoD
              </button>
              <button
                onClick={() => alert("Explore quizzes feature will open here")}
                className="px-5 py-2 mr-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-base rounded-md hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 hover:shadow-md"
              >
                Explore
              </button>
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 text-white text-lg font-semibold hover:from-indigo-500 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                </button>
                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-2xl py-1 z-50 animate-fadeIn overflow-hidden">
                    <div className="px-5 py-4 border-b bg-gradient-to-r from-indigo-100 to-purple-100">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 mr-3">
                          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xl font-bold ring-2 ring-white">
                            {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div className="flex-grow">
                          <p className="text-base font-bold text-indigo-800">{user.name || "User"}</p>
                          <p className="text-sm text-indigo-600 truncate">{user.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="px-5 py-3 border-b hover:bg-indigo-50 transition-colors duration-200">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-xs font-medium text-indigo-500 uppercase tracking-wider">Username</p>
                          <p className="text-sm font-medium text-gray-800">{user.username || "Not set"}</p>
                        </div>
                        <button className="text-indigo-600 hover:text-indigo-800 text-xs">
                          Edit
                        </button>
                      </div>
                    </div>
                    <div className="px-5 py-3 border-b hover:bg-indigo-50 transition-colors duration-200">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-xs font-medium text-indigo-500 uppercase tracking-wider">Quiz Ranking</p>
                          <p className="text-sm font-medium text-gray-800">Not ranked</p>
                        </div>
                        <button className="text-indigo-600 hover:text-indigo-800 text-xs">
                          View Details
                        </button>
                      </div>
                    </div>
                    <div className="px-5 py-3 border-b">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded p-2">
                          <p className="text-xs text-indigo-500">Quizzes Taken</p>
                          <p className="text-lg font-bold text-indigo-600">0</p>
                        </div>
                        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded p-2">
                          <p className="text-xs text-indigo-500">Avg. Score</p>
                          <p className="text-lg font-bold text-indigo-600">-</p>
                        </div>
                      </div>
                    </div>
                    <div className="px-5 py-3 border-b hover:bg-indigo-50 transition-colors duration-200">
                      <button
                        onClick={() => alert("Profile settings would open here")}
                        className="w-full text-left text-sm text-indigo-600 hover:text-indigo-800 transition-colors duration-200 flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Profile Settings
                      </button>
                    </div>
                    <div className="px-5 py-3 hover:bg-red-50 transition-colors duration-200">
                      <button
                        onClick={onLogout}
                        className="w-full text-left text-sm text-red-600 hover:text-red-800 transition-colors duration-200 flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
     

      {/* Rest of the existing code remains the same */}

      {/* Main Content with animations */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs with hover effects */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("practice")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300 ${
                activeTab === "practice"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Practice
            </button>
            <button
              onClick={() => setActiveTab("quizzes")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300 ${
                activeTab === "quizzes"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              My Quizzes
            </button>
            <button
              onClick={() => setActiveTab("stats")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300 ${
                activeTab === "stats"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Statistics
            </button>
          </nav>
        </div>

        {/* Tab Content with animations */}
        <div className="bg-white shadow-lg rounded-lg p-6 relative min-h-[400px] transition-all duration-300 transform">
        {activeTab === "practice" && (
        <div className="animate-fadeIn">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Practice Quizzes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {practiceQuizzes.map((quiz, index) => (
              <div 
                key={quiz.id} 
                className="border rounded-lg p-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-white to-indigo-50"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <h3 className="font-medium text-gray-900">{quiz.title}</h3>
                <div className="mt-2 text-sm text-gray-500">
                  <p>Questions: {quiz.questionCount}</p>
                  <p>Difficulty: {quiz.difficulty}</p>
                  <p>Category: {quiz.category}</p>
                </div>
                <div className="mt-3 flex justify-end">
                  <button 
                    className="px-3 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-md hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                    onClick={() => startQuiz(quiz)}
                  >
                    Start Practice
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

          {activeTab === "quizzes" && (
            <div className="animate-fadeIn">
              <h2 className="text-lg font-medium text-gray-900 mb-4">My Quizzes</h2>
              <div className="text-center py-16 text-gray-500">
                <p>You haven't attempted any quizzes yet.</p>
                <p className="mt-2">Your attempted quizzes will appear here.</p>
              </div>
            </div>
          )}

          {activeTab === "stats" && (
            <div className="animate-fadeIn">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Your Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-4 transition-all duration-300 transform hover:shadow-md hover:scale-105">
                  <h3 className="text-sm font-medium text-gray-500">Quizzes Taken</h3>
                  <p className="text-2xl font-bold text-indigo-600">0</p>
                </div>
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-4 transition-all duration-300 transform hover:shadow-md hover:scale-105">
                  <h3 className="text-sm font-medium text-gray-500">Average Score</h3>
                  <p className="text-2xl font-bold text-indigo-600">-</p>
                </div>
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-4 transition-all duration-300 transform hover:shadow-md hover:scale-105">
                  <h3 className="text-sm font-medium text-gray-500">Current Ranking</h3>
                  <p className="text-2xl font-bold text-indigo-600">Not ranked</p>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced floating Create Quiz Button */}
          {showCreateButton && (
            <button
              onClick={() => {
                alert("Quiz creation form would open here");
                setShowCreateButton(false);
                setTimeout(() => setShowCreateButton(true), 1000);
              }}
              className="fixed bottom-6 left-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 hover:shadow-xl hover:from-green-700 hover:to-emerald-700 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="ml-2">Create Quiz</span>
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

// Helper functions to generate quiz questions
//! JavaScript Questions
function generateJavaScriptQuestions() {
  return [
    {
      question: "What is the correct way to declare a variable in JavaScript?",
      options: [
        "variable x;",
        "var x;",
        "let x;",
        "Both B and C"
      ],
      correctAnswer: 3
    },
    {
      question: "Which of the following is not a JavaScript data type?",
      options: [
        "Number",
        "String",
        "Boolean",
        "Character"
      ],
      correctAnswer: 3
    },
    {
      question: "What does the '===' operator do in JavaScript?",
      options: [
        "Compares values only",
        "Compares values and types",
        "Assigns a value",
        "Checks for null"
      ],
      correctAnswer: 1
    },
    {
      question: "How do you write a comment in JavaScript?",
      options: [
        "// This is a comment",
        "<!-- This is a comment -->",
        "' This is a comment",
        "# This is a comment"
      ],
      correctAnswer: 0
    },
    {
      question: "Which method can be used to find the length of a string?",
      options: [
        "length()",
        "getLength()",
        "size()",
        "length"
      ],
      correctAnswer: 3
    },
    {
      question: "Which keyword is used to define a function in JavaScript?",
      options: [
        "func",
        "def",
        "function",
        "method"
      ],
      correctAnswer: 2
    },
    {
      question: "Which built-in method adds one or more elements to the end of an array?",
      options: [
        "push()",
        "pop()",
        "addToEnd()",
        "concat()"
      ],
      correctAnswer: 0
    },
    {
      question: "What is the output of: typeof null?",
      options: [
        "'null'",
        "'object'",
        "'undefined'",
        "'number'"
      ],
      correctAnswer: 1
    },
    {
      question: "Which statement is used to stop a loop in JavaScript?",
      options: [
        "stop",
        "exit",
        "break",
        "end"
      ],
      correctAnswer: 2
    },
    {
      question: "Which method is used to remove the last element of an array?",
      options: [
        "shift()",
        "pop()",
        "remove()",
        "splice()"
      ],
      correctAnswer: 1
    },
    {
      question: "Which operator is used to assign a value to a variable?",
      options: [
        "*",
        "=",
        "-",
        "=="
      ],
      correctAnswer: 1
    },
    {
      question: "Which of these is a correct if statement in JavaScript?",
      options: [
        "if i = 5 then",
        "if i == 5",
        "if (i == 5)",
        "if i = 5"
      ],
      correctAnswer: 2
    },
    {
      question: "How do you define an array in JavaScript?",
      options: [
        "let arr = (1, 2, 3);",
        "let arr = {1, 2, 3};",
        "let arr = [1, 2, 3];",
        "let arr = <1, 2, 3>;"
      ],
      correctAnswer: 2
    },
    {
      question: "Which function is used to parse a string to an integer?",
      options: [
        "Number()",
        "parseInt()",
        "parseFloat()",
        "toInteger()"
      ],
      correctAnswer: 1
    },
    {
      question: "What is the purpose of 'return' in a function?",
      options: [
        "Stops the function execution",
        "Returns a value and exits the function",
        "Calls another function",
        "Assigns a value"
      ],
      correctAnswer: 1
    },
    {
      question: "Which of the following is a JavaScript loop structure?",
      options: [
        "for",
        "while",
        "do...while",
        "All of the above"
      ],
      correctAnswer: 3
    },
    {
      question: "Which symbol is used for single-line comments in JavaScript?",
      options: [
        "//",
        "/*",
        "#",
        "<!--"
      ],
      correctAnswer: 0
    },
    {
      question: "How do you call a function named myFunction?",
      options: [
        "call myFunction()",
        "myFunction()",
        "call function myFunction",
        "Call.myFunction()"
      ],
      correctAnswer: 1
    },
    {
      question: "Which method joins two or more arrays?",
      options: [
        "merge()",
        "concat()",
        "combine()",
        "join()"
      ],
      correctAnswer: 1
    },
    {
      question: "What will `console.log(typeof [])` return?",
      options: [
        "'object'",
        "'array'",
        "'list'",
        "'undefined'"
      ],
      correctAnswer: 0
    }
  ];
}

//! HTML Questions
function generateHTMLQuestions() {
  return [
    {
      question: "What does HTML stand for?",
      options: [
        "Hyper Text Markup Language",
        "Home Tool Markup Language",
        "Hyperlinks and Text Markup Language",
        "Hyper Text Makeup Language"
      ],
      correctAnswer: 0
    },
    {
      question: "Which tag is used to create a hyperlink in HTML?",
      options: [
        "<link>",
        "<a>",
        "<href>",
        "<hyperlink>"
      ],
      correctAnswer: 1
    },
    {
      question: "Which attribute is used to provide a unique name for an HTML element?",
      options: [
        "class",
        "id",
        "name",
        "type"
      ],
      correctAnswer: 1
    },
    {
      question: "Which HTML element is used to define the title of a document?",
      options: [
        "<meta>",
        "<title>",
        "<head>",
        "<header>"
      ],
      correctAnswer: 1
    },
    {
      question: "What is the correct HTML element for inserting a line break?",
      options: [
        "<lb>",
        "<br>",
        "<break>",
        "<newline>"
      ],
      correctAnswer: 1
    },
    {
      question: "Which HTML tag is used to define an unordered list?",
      options: [
        "<ul>",
        "<ol>",
        "<li>",
        "<list>"
      ],
      correctAnswer: 0
    },
    {
      question: "Which tag is used to display an image in HTML?",
      options: [
        "<img>",
        "<image>",
        "<src>",
        "<pic>"
      ],
      correctAnswer: 0
    },
    {
      question: "How can you make a numbered list in HTML?",
      options: [
        "<ul>",
        "<ol>",
        "<list>",
        "<dl>"
      ],
      correctAnswer: 1
    },
    {
      question: "Which element is used for the largest heading in HTML?",
      options: [
        "<h6>",
        "<heading>",
        "<h1>",
        "<head>"
      ],
      correctAnswer: 2
    },
    {
      question: "What is the purpose of the <div> tag in HTML?",
      options: [
        "To define a table",
        "To define a list",
        "To divide content into sections",
        "To display inline content"
      ],
      correctAnswer: 2
    },
    {
      question: "Which tag is used to create a checkbox in HTML?",
      options: [
        "<checkbox>",
        "<input type='checkbox'>",
        "<input checkbox>",
        "<check>"
      ],
      correctAnswer: 1
    },
    {
      question: "Which attribute specifies an alternate text for an image?",
      options: [
        "title",
        "alt",
        "src",
        "value"
      ],
      correctAnswer: 1
    },
    {
      question: "What is the correct way to start an HTML document?",
      options: [
        "<html>",
        "<!DOCTYPE html>",
        "<body>",
        "<head>"
      ],
      correctAnswer: 1
    },
    {
      question: "Which HTML tag is used to define a table row?",
      options: [
        "<tr>",
        "<td>",
        "<th>",
        "<row>"
      ],
      correctAnswer: 0
    },
    {
      question: "What is the correct HTML element for inserting a horizontal rule?",
      options: [
        "<hr>",
        "<line>",
        "<break>",
        "<border>"
      ],
      correctAnswer: 0
    },
    {
      question: "Which input type defines a slider control?",
      options: [
        "range",
        "slider",
        "scroll",
        "scale"
      ],
      correctAnswer: 0
    },
    {
      question: "Which tag is used to define a form in HTML?",
      options: [
        "<form>",
        "<input>",
        "<submit>",
        "<field>"
      ],
      correctAnswer: 0
    },
    {
      question: "What is the correct tag to make text italic in HTML?",
      options: [
        "<italic>",
        "<i>",
        "<em>",
        "<it>"
      ],
      correctAnswer: 1
    },
    {
      question: "Which tag is used to add a background color in HTML5?",
      options: [
        "style",
        "body style",
        "background",
        "bgcolor"
      ],
      correctAnswer: 1
    },
    {
      question: "Which HTML attribute is used to specify that an input field must be filled out?",
      options: [
        "validate",
        "required",
        "placeholder",
        "check"
      ],
      correctAnswer: 1
    }
  ];
}

//! CSS Questions
function generateCSSQuestions() {
  return [
    {
      question: "What does CSS stand for?",
      options: [
        "Creative Style Sheets",
        "Cascading Style Sheets",
        "Computer Style Sheets",
        "Colorful Style Sheets"
      ],
      correctAnswer: 1
    },
    {
      question: "Which property is used to change the background color in CSS?",
      options: [
        "bgcolor",
        "background-color",
        "color-background",
        "background"
      ],
      correctAnswer: 1
    },
    {
      question: "How do you select an element with id 'demo' in CSS?",
      options: [
        ".demo",
        "#demo",
        "*demo",
        "demo"
      ],
      correctAnswer: 1
    },
    {
      question: "Which CSS property controls the text size?",
      options: [
        "font-style",
        "text-size",
        "font-size",
        "text-style"
      ],
      correctAnswer: 2
    },
    {
      question: "Which is the correct CSS syntax?",
      options: [
        "{body:color=black;}",
        "body:color=black;",
        "body {color: black;}",
        "{body;color:black;}"
      ],
      correctAnswer: 2
    },
    {
      question: "How do you make all <p> elements bold in CSS?",
      options: [
        "p {font-weight: bold;}",
        "p {text-size: bold;}",
        "p {font: bold;}",
        "<p style='bold'>"
      ],
      correctAnswer: 0
    },
    {
      question: "What is the default position value in CSS?",
      options: [
        "absolute",
        "fixed",
        "relative",
        "static"
      ],
      correctAnswer: 3
    },
    {
      question: "How do you add a comment in CSS?",
      options: [
        "// this is a comment",
        "<!-- this is a comment -->",
        "/* this is a comment */",
        "# this is a comment"
      ],
      correctAnswer: 2
    },
    {
      question: "Which property is used to change the font of an element?",
      options: [
        "font-style",
        "text-style",
        "font-family",
        "font-type"
      ],
      correctAnswer: 2
    },
    {
      question: "Which property is used to change the text color of an element?",
      options: [
        "fgcolor",
        "text-color",
        "font-color",
        "color"
      ],
      correctAnswer: 3
    },
    {
      question: "How do you make a list not display bullets?",
      options: [
        "list-style-type: none;",
        "list-type: no-bullet;",
        "bullet-style: none;",
        "text-style: none;"
      ],
      correctAnswer: 0
    },
    {
      question: "Which value is used with the display property to hide an element?",
      options: [
        "visible",
        "hidden",
        "collapse",
        "none"
      ],
      correctAnswer: 3
    },
    {
      question: "Which CSS property is used for spacing inside the border?",
      options: [
        "margin",
        "padding",
        "border-spacing",
        "gap"
      ],
      correctAnswer: 1
    },
    {
      question: "Which property sets the outer space around an element?",
      options: [
        "padding",
        "spacing",
        "margin",
        "border"
      ],
      correctAnswer: 2
    },
    {
      question: "What does the z-index property control?",
      options: [
        "The zoom level",
        "The stacking order",
        "The background image",
        "The font size"
      ],
      correctAnswer: 1
    },
    {
      question: "Which pseudo-class targets the first child of a parent element?",
      options: [
        ":first-child",
        ":first",
        ":first-element",
        ":nth-child(0)"
      ],
      correctAnswer: 0
    },
    {
      question: "How can you apply a style to all <h1> elements on a page?",
      options: [
        "*h1",
        "#h1",
        ".h1",
        "h1"
      ],
      correctAnswer: 3
    },
    {
      question: "What does the 'hover' pseudo-class do?",
      options: [
        "Selects when an element is clicked",
        "Applies when an element is selected",
        "Applies when mouse hovers over an element",
        "Changes text on hover"
      ],
      correctAnswer: 2
    },
    {
      question: "Which CSS property controls the transparency of an element?",
      options: [
        "visibility",
        "display",
        "opacity",
        "transparent"
      ],
      correctAnswer: 2
    },
    {
      question: "How do you group selectors in CSS?",
      options: [
        "Separate with commas",
        "Separate with semicolons",
        "Separate with plus signs",
        "Separate with colons"
      ],
      correctAnswer: 0
    }
  ];
}
