import React, { useState } from 'react';
import { Upload, Sparkles, BookOpen, Save, Edit, Trash2, Brain, Target, Clock, Trophy } from 'lucide-react';

const StudyCenterMain = () => {
  const [activeTab, setActiveTab] = useState('Quiz');
  const [quizTitle, setQuizTitle] = useState('');
  const [studyMaterial, setStudyMaterial] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [questionType, setQuestionType] = useState('Multiple Choice');
  const [difficulty, setDifficulty] = useState('Medium');
  const [apiKey, setApiKey] = useState('');
  const [showApiDialog, setShowApiDialog] = useState(false);
  const [generatedQuiz, setGeneratedQuiz] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedQuizzes, setSavedQuizzes] = useState([]);
  const [error, setError] = useState('');

  const questionTypes = [
    { id: 'Multiple Choice', label: 'Multiple Choice', desc: 'Questions with multiple options to choose from', icon: '🔤' },
    { id: 'True/False', label: 'True/False', desc: 'Simple true or false questions', icon: '✅' },
    { id: 'Short Answer', label: 'Short Answer', desc: 'Brief written responses', icon: '✍️' },
    { id: 'Essay', label: 'Essay', desc: 'Long-form written responses', icon: '📝' },
    { id: 'Mixed Types', label: 'Mixed Types', desc: 'Combination of different question types', icon: '🎯' }
  ];

  const difficultyLevels = [
    { id: 'Easy', label: 'Easy', color: 'bg-green-100 text-green-800' },
    { id: 'Medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'Hard', label: 'Hard', color: 'bg-red-100 text-red-800' }
  ];

  const generatePrompt = () => {
    const basePrompt = `Create a ${difficulty.toLowerCase()} level quiz with ${numQuestions} ${questionType.toLowerCase()} questions based on the following study material. 

Study Material:
${studyMaterial}

Requirements:
1. Generate exactly ${numQuestions} questions
2. Each question should be ${difficulty.toLowerCase()} level
3. Question type: ${questionType}
4. Include correct answers
5. For multiple choice, provide 4 options (A, B, C, D)
6. Make questions comprehensive and test understanding

Format the response as a JSON object with this exact structure:
{
  "quiz": {
    "title": "Quiz Title",
    "questions": [
      {
        "id": 1,
        "question": "Question text here",
        "type": "${questionType}",
        "options": ["Option A", "Option B", "Option C", "Option D"], // Only for multiple choice
        "correctAnswer": "Correct answer here",
        "explanation": "Brief explanation of why this is correct"
      }
    ]
  }
}

Important: Return ONLY the JSON object, no additional text or formatting.`;

    return basePrompt;
  };

  const callGeminiAPI = async (prompt) => {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  };

  const parseQuizResponse = (responseText) => {
    try {
      // Clean the response text
      let cleanedText = responseText.trim();
      
      // Remove any markdown code blocks
      cleanedText = cleanedText.replace(/```json\s*/g, '').replace(/```\s*/g, '');
      
      // Find JSON object
      const jsonStart = cleanedText.indexOf('{');
      const jsonEnd = cleanedText.lastIndexOf('}') + 1;
      
      if (jsonStart === -1 || jsonEnd === 0) {
        throw new Error('No valid JSON found in response');
      }
      
      const jsonString = cleanedText.substring(jsonStart, jsonEnd);
      const parsed = JSON.parse(jsonString);
      
      if (!parsed.quiz || !parsed.quiz.questions) {
        throw new Error('Invalid quiz structure in response');
      }
      
      return parsed.quiz;
    } catch (error) {
      console.error('Parse error:', error);
      throw new Error('Failed to parse quiz response. Please try again.');
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setStudyMaterial(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  const generateQuiz = async () => {
    if (!apiKey) {
      setShowApiDialog(true);
      return;
    }

    if (!studyMaterial.trim()) {
      setError('Please provide study material first!');
      return;
    }

    setIsGenerating(true);
    setError('');
    
    try {
      const prompt = generatePrompt();
      const response = await callGeminiAPI(prompt);
      
      if (!response.candidates || !response.candidates[0] || !response.candidates[0].content) {
        throw new Error('Invalid response from Gemini API');
      }
      
      const responseText = response.candidates[0].content.parts[0].text;
      const quiz = parseQuizResponse(responseText);
      
      // Add title if not provided
      if (!quiz.title && quizTitle) {
        quiz.title = quizTitle;
      } else if (!quiz.title) {
        quiz.title = 'Generated Quiz';
      }
      
      setGeneratedQuiz(quiz);
    } catch (error) {
      console.error('Generation error:', error);
      setError(error.message || 'Failed to generate quiz. Please check your API key and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const saveQuiz = () => {
    if (generatedQuiz) {
      const savedQuiz = { ...generatedQuiz, id: Date.now(), createdAt: new Date().toISOString() };
      setSavedQuizzes([...savedQuizzes, savedQuiz]);
      alert('Quiz saved successfully!');
    }
  };

  const deleteSavedQuiz = (id) => {
    setSavedQuizzes(savedQuizzes.filter(quiz => quiz.id !== id));
  };

  const editQuestion = (questionIndex, newQuestion) => {
    if (generatedQuiz) {
      const updatedQuiz = { ...generatedQuiz };
      updatedQuiz.questions[questionIndex] = newQuestion;
      setGeneratedQuiz(updatedQuiz);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 rounded-xl">
                <Brain size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Study Center</h1>
                <p className="text-gray-600">AI-powered quiz and flashcard generator</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Trophy className="w-4 h-4" />
              <span>Create • Study • Master</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl mb-8">
          {['Quiz', 'Flashcards'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-white text-purple-600 shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quiz Creation Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quiz Title */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Target className="w-5 h-5 text-purple-600" />
                <h2 className="text-xl font-semibold text-gray-900">Quiz Details</h2>
              </div>
              <input
                type="text"
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
                placeholder="Enter a title for your quiz (optional)"
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Study Material */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Study Material</h2>
                </div>
                <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
                  <Upload size={16} />
                  <span className="text-sm font-medium">Upload File</span>
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    accept=".txt,.doc,.docx"
                    className="hidden"
                  />
                </label>
              </div>
              <textarea
                value={studyMaterial}
                onChange={(e) => setStudyMaterial(e.target.value)}
                placeholder="Paste or type your study material here. The AI will analyze this content to generate relevant quiz questions..."
                className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
              />
            </div>

            {/* Quiz Configuration */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Quiz Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Number of Questions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Number of Questions
                  </label>
                  <div className="space-y-3">
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={numQuestions}
                      onChange={(e) => setNumQuestions(e.target.value)}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="text-center">
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
                        {numQuestions} questions
                      </span>
                    </div>
                  </div>
                </div>

                {/* Question Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Question Type
                  </label>
                  <select
                    value={questionType}
                    onChange={(e) => setQuestionType(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {questionTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.icon} {type.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    {questionTypes.find(t => t.id === questionType)?.desc}
                  </p>
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Difficulty Level
                  </label>
                  <div className="space-y-2">
                    {difficultyLevels.map((level) => (
                      <label key={level.id} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="difficulty"
                          value={level.id}
                          checked={difficulty === level.id}
                          onChange={(e) => setDifficulty(e.target.value)}
                          className="sr-only"
                        />
                        <div className={`flex-1 p-2 rounded-lg text-center text-sm font-medium transition-all ${
                          difficulty === level.id 
                            ? level.color + ' ring-2 ring-purple-500' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}>
                          {level.label}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={generateQuiz}
              disabled={isGenerating || !studyMaterial.trim()}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center space-x-3 ${
                isGenerating || !studyMaterial.trim()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl'
              }`}
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Generating Quiz...</span>
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  <span>Generate Quiz with AI</span>
                </>
              )}
            </button>
          </div>

          {/* Saved Quizzes Panel */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Clock className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-900">Saved Quizzes</h2>
            </div>
            
            {savedQuizzes.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 mb-2">No saved quizzes yet</p>
                <p className="text-sm text-gray-400">Create and save your first quiz to see it here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {savedQuizzes.map((quiz) => (
                  <div key={quiz.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900 line-clamp-2">{quiz.title}</h3>
                      <button
                        onClick={() => deleteSavedQuiz(quiz.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{quiz.questions.length} questions</span>
                      <span>{new Date(quiz.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Generated Quiz Display */}
        {generatedQuiz && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{generatedQuiz.title}</h2>
                <p className="text-gray-600">{generatedQuiz.questions.length} questions • {difficulty} difficulty</p>
              </div>
              <button
                onClick={saveQuiz}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
              >
                <Save size={16} />
                <span>Save Quiz</span>
              </button>
            </div>
            
            <div className="space-y-6">
              {generatedQuiz.questions.map((question, index) => (
                <div key={question.id || index} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Question {index + 1}
                    </h3>
                    <div className="flex space-x-2">
                      <button className="text-blue-500 hover:text-blue-700 transition-colors">
                        <Edit size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-gray-800 mb-4 text-lg">{question.question}</p>
                  
                  {question.options && question.options.length > 0 && (
                    <div className="space-y-2 mb-4">
                      {question.options.map((option, optIndex) => (
                        <div
                          key={optIndex}
                          className={`p-3 rounded-lg border transition-colors ${
                            option === question.correctAnswer 
                              ? 'bg-green-50 border-green-200 text-green-800' 
                              : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <span className="font-medium mr-2">
                            {String.fromCharCode(65 + optIndex)}.
                          </span>
                          {option}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {question.explanation && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm text-blue-800">
                        <strong>Explanation:</strong> {question.explanation}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* API Key Dialog */}
      {showApiDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Gemini API Key Required</h2>
              <p className="text-gray-600">Enter your API key to generate AI-powered quizzes</p>
            </div>
            
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Gemini API key"
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-4"
            />
            
            <div className="flex space-x-3 mb-6">
              <button
                onClick={() => {
                  setShowApiDialog(false);
                  if (apiKey) generateQuiz();
                }}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
              >
                Save & Generate
              </button>
              <button
                onClick={() => setShowApiDialog(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-semibold text-gray-900 mb-2">How to get your API key:</p>
              <ol className="text-sm text-gray-600 space-y-1">
                <li>1. Visit <a href="https://makersuite.google.com/app/apikey" className="text-purple-600 hover:underline" target="_blank" rel="noopener noreferrer">Google AI Studio</a></li>
                <li>2. Sign in with your Google account</li>
                <li>3. Click "Create API Key"</li>
                <li>4. Copy and paste the key above</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #7c3aed;
          cursor: pointer;
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #7c3aed;
          cursor: pointer;
          border: none;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default StudyCenterMain;