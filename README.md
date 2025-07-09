# Study Center - AI Quiz Generator

A modern, AI-powered quiz generation application using Google's Gemini API. Transform your study materials into interactive quizzes with multiple question types and difficulty levels.

## 🚀 Features

- **AI-Powered Generation**: Uses Google Gemini API to create intelligent quizzes
- **Multiple Question Types**: Multiple choice, True/False, Short answer, Essay, and Mixed types
- **Difficulty Levels**: Easy, Medium, and Hard difficulty settings
- **Modern UI**: Clean, responsive design with smooth animations
- **File Upload**: Upload text files directly as study material
- **Quiz Management**: Save, view, and delete generated quizzes
- **Real-time Feedback**: Instant error handling and loading states

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Get Your Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### 3. Create index.html (if not exists)

Create an `index.html` file in the root directory:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Study Center - AI Quiz Generator</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### 4. Run the Application

```bash
npm run dev
```

The app will open at `http://localhost:3000`

## 📖 How to Use

### 1. Enter API Key
- Click "Generate Quiz with AI"
- Enter your Gemini API key in the dialog
- The key is stored temporarily in your browser session

### 2. Add Study Material
- Paste your study content in the text area, or
- Upload a text file using the "Upload File" button

### 3. Configure Quiz Settings
- **Number of Questions**: Use the slider (1-20 questions)
- **Question Type**: Choose from multiple formats
- **Difficulty Level**: Select Easy, Medium, or Hard

### 4. Generate Quiz
- Click "Generate Quiz with AI"
- Wait for the AI to process your material
- Review the generated questions and answers

### 5. Save and Manage
- Click "Save Quiz" to store generated quizzes
- View saved quizzes in the sidebar
- Delete unwanted quizzes with the trash icon

## 🔧 Technical Details

### Key Improvements Made

#### API Integration
- **Real Gemini API calls** instead of mock data
- Structured prompts for consistent quiz generation
- Robust response parsing and error handling
- Support for different question types and difficulties

#### UI/UX Enhancements
- Modern, clean design replacing the pixelated style
- Responsive layout that works on all devices
- Smooth animations and loading states
- Clear visual hierarchy and typography
- Better color scheme and spacing

#### New Features
- Difficulty level selection
- Enhanced question types
- Question explanations
- Creation timestamps
- Better file upload handling
- Comprehensive error messages

### Dependencies

- **React 18**: Modern React with hooks
- **Lucide React**: Beautiful, consistent icons
- **Tailwind CSS**: Utility-first CSS framework
- **Vite**: Fast development server and build tool

## 🌟 Usage Tips

1. **Study Material Quality**: Provide clear, well-structured content for better quiz questions
2. **Question Types**: 
   - Multiple Choice: Best for factual recall
   - True/False: Good for concept verification
   - Short Answer: Tests understanding
   - Essay: Evaluates comprehensive knowledge
3. **Difficulty Levels**:
   - Easy: Basic recall and recognition
   - Medium: Application and analysis
   - Hard: Synthesis and evaluation

## 🔒 Privacy & Security

- API keys are stored only in browser session storage
- No study materials are stored permanently
- All data processing happens in your browser
- Gemini API calls are made directly from your browser

## 🐛 Troubleshooting

### Common Issues

1. **"Invalid API Key" Error**
   - Verify your API key is correct
   - Check if you have credits remaining in Google AI Studio
   - Ensure the API key has proper permissions

2. **"Failed to Parse Response" Error**
   - Try simplifying your study material
   - Reduce the number of questions
   - Check your internet connection

3. **UI Not Loading Properly**
   - Clear browser cache
   - Ensure all dependencies are installed
   - Check console for JavaScript errors

## 📱 Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## 🚀 Future Enhancements

- [ ] Quiz taking mode with scoring
- [ ] Export quizzes to PDF
- [ ] Collaborative quiz sharing
- [ ] Analytics and progress tracking
- [ ] Integration with learning management systems

## 📄 License

MIT License - feel free to use and modify as needed.

---

**Happy Studying! �**
