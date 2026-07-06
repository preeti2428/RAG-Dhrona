import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, Mic, Volume2, VolumeX, Moon, Sun } from 'lucide-react';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Speech Recognition (STT) setup
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  if (recognition) {
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      alert('Microphone error: ' + event.error + '. Please check your browser permissions, and ensure you are using Chrome or Edge.');
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  }

  const toggleListening = () => {
    if (!recognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }
    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  // Text-to-Speech (TTS) setup
  const speakText = (text) => {
    if (!voiceEnabled || !window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setMessages((prev) => [...prev, { text: userMessage, sender: 'user' }]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post('http://127.0.0.1:8000/chat', { message: userMessage });
      const botMessage = response.data.answer;
      
      setMessages((prev) => [...prev, { text: botMessage, sender: 'bot' }]);
      speakText(botMessage);
      
    } catch (error) {
      console.error('Error fetching chat response:', error);
      setMessages((prev) => [...prev, { text: "Error: Unable to reach the backend.", sender: 'bot' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} transition-colors duration-300 flex flex-col items-center justify-center p-4`}>
      <div className={`w-full max-w-4xl h-[80vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        
        {/* Header */}
        <div className={`p-4 flex justify-between items-center border-b ${darkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-blue-600 text-white'}`}>
          <h1 className="text-xl font-bold flex items-center gap-2">
            RAG Assistant 🤖
          </h1>
          <div className="flex gap-4">
            <button onClick={() => setVoiceEnabled(!voiceEnabled)} className="p-2 rounded-full hover:bg-opacity-20 hover:bg-white transition" title="Toggle Voice Output">
              {voiceEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full hover:bg-opacity-20 hover:bg-white transition" title="Toggle Theme">
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full opacity-50">
              <p>Hello! Ask me a question about your documents.</p>
            </div>
          )}
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] p-4 rounded-2xl shadow-md ${
                msg.sender === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-none' 
                  : `${darkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-200 text-gray-800'} rounded-bl-none`
              }`}>
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className={`p-4 rounded-2xl rounded-bl-none shadow-md ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className={`p-4 border-t ${darkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'}`}>
          <form onSubmit={handleSend} className="flex gap-2 relative">
            <button
              type="button"
              onClick={toggleListening}
              className={`absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full transition-colors ${
                isListening ? 'bg-red-500 text-white animate-pulse' : 'text-gray-400 hover:text-blue-500'
              }`}
              title="Voice Input (Speech-to-Text)"
            >
              <Mic size={20} />
            </button>
            
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question or use the mic..."
              className={`flex-1 pl-12 pr-12 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'
              }`}
            />
            
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-white bg-blue-600 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
        
      </div>
    </div>
  );
}

export default App;
