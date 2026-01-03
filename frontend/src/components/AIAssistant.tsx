import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, ShoppingBag, Loader2, Mic, Volume2, Image as ImageIcon, Camera } from 'lucide-react';
import client from '../api/client';

type Message = {
  role: 'user' | 'assistant';
  content: string;
  data?: any[];
  intent?: string;
  entities?: any;
  type?: string;        // For ESCALATION_CREATED, IMAGE_ANALYSIS
  escalationId?: string; // For tracking
  notes?: string;       // For Image Analysis notes
};

export const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi! I'm your AI inventory assistant. Ask me about stock, prices, or upload an image to scan!" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false); // Voice State
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // --- Voice Logic ---
  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN'; // Indian English for better recognition
      recognition.continuous = false;
      
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
      };
      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };
      
      recognition.start();
    } else {
      alert("Voice input is not supported in this browser.");
    }
  };

  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any previous speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN'; // Hindi/Indian accent for authentic shopkeeper feel
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };
  // -------------------

  // --- Image Logic ---
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image is too large. Max 5MB allowed.");
      return;
    }

    setMessages(prev => [...prev, { role: 'user', content: `Uploaded Image: ${file.name}` }]);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await client.post('/ai/analyze-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const { message, data, type, notes } = response.data;

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: message,
        data: data, // Items list
        type: type, // IMAGE_ANALYSIS
        notes: notes
      }]);

    } catch (error: any) {
      console.error('Image Analysis Error:', error);
       setMessages(prev => [...prev, { role: 'assistant', content: `Error analyzing image: ${error.message || "Unknown error"}` }]);
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = ''; // Reset input
    }
  };
  // -------------------

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const response = await client.post('/ai/chat', { 
        message: userMsg,
        history: messages.map(m => ({ role: m.role, content: m.content })) 
      });

      const { message, data, intent, entities, type, escalationId } = response.data;

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: message,
        data: data,
        intent: intent,
        entities: entities,
        type: type,
        escalationId: escalationId
      }]);
      
    } catch (error: any) {
      console.error('AI Chat Error:', error);
      const errorMsg = error.response?.data?.message || error.message || "Sorry, I encountered an error checking the brain.";
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${errorMsg}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white w-80 md:w-96 h-[500px] rounded-2xl shadow-2xl border border-gray-200 flex flex-col mb-4 overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-1.5 rounded-lg">
                <MessageSquare className="w-5 h-5" />
              </div>
              <span className="font-semibold">AI Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div 
                  className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm relative group ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-none' 
                      : 'bg-white border border-gray-200 text-gray-700 rounded-bl-none shadow-sm'
                  }`}
                >
                  {msg.content}
                  
                  {/* Speaker Button */}
                  {msg.role === 'assistant' && (
                      <button 
                        onClick={() => speakResponse(msg.content)}
                        className="absolute -right-8 top-1 p-1 text-gray-400 hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100"
                        title="Read Aloud"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                  )}
                </div>
                
                {/* Product Cards (Standard) */}
                {msg.data && msg.data.length > 0 && !msg.type && (
                  <div className="mt-3 w-full space-y-2">
                    {msg.data.map((product: any) => (
                      <div key={product.id} className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3 text-left hover:border-blue-300 transition-colors cursor-pointer">
                        <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                          <ShoppingBag className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{product.custom_name || product.name || 'Unknown Item'}</p>
                          <p className="text-xs text-gray-500">
                            Stock: {product.quantity} | ₹{product.price}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Detected Items List (IMAGE_ANALYSIS) */}
                {msg.type === 'IMAGE_ANALYSIS' && msg.data && (
                    <div className="mt-3 w-full bg-indigo-50 border border-indigo-100 rounded-xl p-3 shadow-sm animate-in fade-in">
                         <div className="flex items-center gap-2 mb-2 text-indigo-800">
                            <Camera className="w-4 h-4" />
                            <span className="font-semibold text-xs uppercase tracking-wide">Detected Inventory</span>
                        </div>
                        <div className="space-y-2">
                            {msg.data.map((item: any, i: number) => (
                                <div key={i} className="bg-white p-2 rounded border border-indigo-100 flex justify-between items-center text-sm">
                                    <div>
                                        <p className="font-medium text-gray-900">{item.name}</p>
                                        <p className="text-xs text-gray-500">{item.category}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="font-bold text-indigo-600">x{item.quantity_estimate}</span>
                                        <p className="text-[10px] text-gray-400">{Math.round(item.confidence * 100)}% Conf.</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {msg.notes && <p className="mt-2 text-xs text-gray-500 italic border-t border-indigo-100 pt-1">{msg.notes}</p>}
                    </div>
                )}

                {/* Escalation Card */}
                {msg.type === 'ESCALATION_CREATED' && (
                    <div className="mt-3 w-full bg-orange-50 border border-orange-200 rounded-xl p-4 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                        <div className="flex items-center gap-2 mb-2 text-orange-700">
                            <div className="bg-orange-100 p-1.5 rounded-full">
                                <span className="font-bold text-lg">!</span> 
                            </div>
                            <span className="font-semibold text-sm">Escalation Request Sent</span>
                        </div>
                        <div className="text-xs text-gray-600 space-y-1">
                            <p><strong>Escalation ID:</strong> <span className="font-mono bg-white px-1 rounded border">{msg.escalationId}</span></p>
                            <p><strong>Status:</strong> <span className="text-orange-600 font-medium bg-white px-1 rounded border border-orange-200">PENDING APPROVAL</span></p>
                            <p className="italic mt-1">Request exceeds allowed limit. Sent to admin.</p>
                        </div>
                    </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none border border-gray-200 shadow-sm">
                  <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleFileChange}
            />

            <button 
                onClick={handleImageClick}
                className="p-2.5 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-indigo-600 transition-all"
                title="Upload Image"
                disabled={loading}
            >
                <ImageIcon className="w-5 h-5" />
            </button>

            <button 
                onClick={startListening}
                className={`p-2.5 rounded-xl transition-all ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                title="Speak Query"
                disabled={loading}
            >
                <Mic className="w-5 h-5" />
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={isListening ? "Listening..." : "Ask or Upload Image..."}
              className="flex-1 bg-gray-100 text-gray-900 border-0 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
              disabled={loading}
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      {!isOpen && (
        <button 
            onClick={() => setIsOpen(true)}
            className="group flex items-center justify-center w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:scale-110 hover:shadow-blue-500/30 transition-all duration-300"
        >
          <MessageSquare className="w-7 h-7 group-hover:rotate-12 transition-transform" />
        </button>
      )}
    </div>
  );
};
