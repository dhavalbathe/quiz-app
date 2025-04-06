import { useState, useEffect, useRef } from "react";

export const Dashboard = ({ user, onLogout }) => {
  // State management remains the same
  const [activeTab, setActiveTab] = useState("practice");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showCreateButton, setShowCreateButton] = useState(true);
  const [quizCode, setQuizCode] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [pulseQoD, setPulseQoD] = useState(false);
  
  // Reference for the profile dropdown to detect outside clicks
  const profileDropdownRef = useRef(null);

  // Sample practice quiz data remains the same
  const practiceQuizzes = [
    {
      id: 1,
      title: "JavaScript Basics",
      questionCount: 8,
      difficulty: "Beginner",
      category: "Programming"
    },
    {
      id: 2,
      title: "HTML Fundamentals",
      questionCount: 10,
      difficulty: "Beginner",
      category: "Web Development"
    },
    {
      id: 3,
      title: "CSS Styling",
      questionCount: 12,
      difficulty: "Beginner",
      category: "Web Design"
    }
  ];

  // Animation effect when component mounts
  useEffect(() => {
    setIsLoaded(true);
    
    // Pulse QoD button every 10 seconds to draw attention
    const interval = setInterval(() => {
      setPulseQoD(true);
      setTimeout(() => setPulseQoD(false), 1500);
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  // Effect to close profile dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    // Add event listener when dropdown is open
    if (showProfileDropdown) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    
    // Clean up event listener
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

  return (
    <div className={`min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {/* Quiz Code Section with subtle animation */}
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
                        onClick={() => alert(`Starting practice quiz: ${quiz.title}`)}
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