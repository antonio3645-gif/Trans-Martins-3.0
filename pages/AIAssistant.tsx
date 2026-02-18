import React, { useState, useRef, useEffect } from 'react';
import { BrainCircuit, Send, Bot, User, Sparkles } from 'lucide-react';
import { analyzeLogisticsData } from '../services/geminiService';
import { MOCK_TRIPS, MOCK_TRUCKS } from '../constants';

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: 'Olá! Sou a IA da Trans Martins. Posso analisar seus dados de frota, calcular eficiência de rotas ou resumir custos. Como posso ajudar hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const response = await analyzeLogisticsData(userMessage, { trips: MOCK_TRIPS, trucks: MOCK_TRUCKS });
      setMessages(prev => [...prev, { role: 'assistant', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Desculpe, tive um problema ao processar sua solicitação.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    "Qual caminhão está disponível em SP?",
    "Resuma o faturamento das viagens ativas.",
    "Existem viagens atrasadas? Por quê?",
    "Sugira uma otimização para a rota SP-RJ."
  ];

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col space-y-4">
      <div className="flex items-center space-x-3 mb-2">
        <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg">
          <BrainCircuit className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Logistics AI</h1>
          <p className="text-sm text-slate-500">Powered by Gemini 2.5</p>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-3`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 
                  ${msg.role === 'user' ? 'bg-slate-200' : 'bg-blue-100'}`}>
                  {msg.role === 'user' ? <User size={16} className="text-slate-600" /> : <Bot size={16} className="text-blue-600" />}
                </div>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap
                  ${msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'}`}>
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
               <div className="flex flex-row items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <Bot size={16} className="text-blue-600" />
                </div>
                <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-500 animate-pulse" />
                  <span className="text-sm text-slate-500">Analisando dados da frota...</span>
                </div>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-100">
          {messages.length === 1 && (
            <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
              {suggestions.map((s, i) => (
                <button 
                  key={i}
                  onClick={() => setInput(s)}
                  className="whitespace-nowrap px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs rounded-full transition-colors border border-slate-200"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
          
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Pergunte sobre sua frota ou viagens..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white p-3 rounded-xl transition-colors shadow-sm shadow-blue-600/20"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
