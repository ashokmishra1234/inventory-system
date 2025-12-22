import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, ShoppingBag, Loader2 } from 'lucide-react';
import client from '../api/client';

type Message = {
  role: 'user' | 'assistant';
  content: string;
  data?: any[];
  intent?: string;
  entities?: any; // Add entities to type
};

export const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi! I'm your AI inventory assistant. Ask me about stock, prices, or find products!" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

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

      const { message, data, intent, entities } = response.data; // Capture entities

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: message,
        data: data,
        intent: intent,
        entities: entities // Store it
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
                  className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-none' 
                      : 'bg-white border border-gray-200 text-gray-700 rounded-bl-none shadow-sm'
                  }`}
                >
                  {msg.content}
                </div>
                
                {/* Product Cards in Chat */}
                {msg.data && msg.data.length > 0 && (
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
                            {msg.intent === 'discount_inquiry' && product.discount_rules?.max_percent > 0 && (
                                <span className="ml-2 text-green-600 font-medium bg-green-50 px-1 rounded">
                                    {/* Logic: If user asked for LESS than max, show REQUESTED. Else show MAX. */}
                                    {msg.entities?.requested_discount && msg.entities.requested_discount <= product.discount_rules.max_percent ? (
                                        <>Approved: -{msg.entities.requested_discount}% Off</>
                                    ) : (
                                        <>-{product.discount_rules.max_percent}% Off</>
                                    )}
                                </span>
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
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
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about inventory..."
              className="flex-1 bg-gray-100 text-gray-900 border-0 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
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
