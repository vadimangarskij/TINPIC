import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Image as ImageIcon, Smile, Mic, MoreVertical, Sparkles } from 'lucide-react';
import { messagesAPI } from '../utils/api';
import toast from 'react-hot-toast';

const ChatPage = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  
  const [messages, setMessages] = useState([]);
  const [matchedUser, setMatchedUser] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [showIcebreaker, setShowIcebreaker] = useState(false);
  const [icebreaker, setIcebreaker] = useState('');
  
  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, [matchId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async () => {
    try {
      const response = await messagesAPI.getMessages(matchId);
      setMessages(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load messages:', error);
      toast.error('Не удалось загрузить сообщения');
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    try {
      const response = await messagesAPI.sendMessage({
        match_id: matchId,
        content: newMessage,
        message_type: 'text'
      });
      
      setMessages([...messages, response.data]);
      setNewMessage('');
    } catch (error) {
      toast.error('Не удалось отправить сообщение');
    } finally {
      setIsSending(false);
    }
  };

  const handleGetIcebreaker = async () => {
    try {
      const response = await messagesAPI.getIcebreaker(matchId);
      setIcebreaker(response.data.icebreaker);
      setShowIcebreaker(true);
    } catch (error) {
      toast.error('Не удалось получить icebreaker');
    }
  };

  const useIcebreaker = () => {
    setNewMessage(icebreaker);
    setShowIcebreaker(false);
  };

  const formatTime = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString('ru-RU', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch {
      return '';
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Загружаем чат...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate('/matches')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        
        <div className="flex-1 flex items-center gap-3">
          <div className="relative">
            <img
              src={matchedUser?.photos?.[0] || '/placeholder-user.png'}
              alt={matchedUser?.full_name || 'User'}
              className="w-12 h-12 rounded-full object-cover"
            />
            {matchedUser?.is_verified && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-gray-800 truncate">
              {matchedUser?.full_name || 'Пользователь'}
            </h2>
            <p className="text-sm text-gray-500">
              {matchedUser?.is_online ? 'онлайн' : 'оффлайн'}
            </p>
          </div>
        </div>
        
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <MoreVertical className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-6">
            <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full flex items-center justify-center mb-4">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Новый матч! 🎉
            </h3>
            <p className="text-gray-600 mb-6">
              Начните общение с интересного вопроса
            </p>
            <button
              onClick={handleGetIcebreaker}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Получить идею для разговора
            </button>
          </div>
        ) : (
          messages.map((message) => {
            const isOwn = message.is_own;
            return (
              <div
                key={message.id}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                    isOwn
                      ? 'bg-gradient-to-br from-pink-500 to-orange-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                  <p
                    className={`text-xs mt-1 ${
                      isOwn ? 'text-white/70' : 'text-gray-500'
                    }`}
                  >
                    {formatTime(message.sent_at)}
                    {message.is_read && isOwn && ' • прочитано'}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Icebreaker Suggestion */}
      {showIcebreaker && (
        <div className="px-4 py-2 bg-purple-50 border-t border-purple-100">
          <div className="flex items-start gap-2">
            <Sparkles className="w-5 h-5 text-purple-500 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <p className="text-sm text-gray-700 mb-2">{icebreaker}</p>
              <div className="flex gap-2">
                <button
                  onClick={useIcebreaker}
                  className="text-xs bg-purple-500 text-white px-3 py-1 rounded-full hover:bg-purple-600 transition-colors"
                >
                  Использовать
                </button>
                <button
                  onClick={() => setShowIcebreaker(false)}
                  className="text-xs text-gray-600 hover:text-gray-800"
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <button
            type="button"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ImageIcon className="w-6 h-6 text-gray-600" />
          </button>
          
          <button
            type="button"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Smile className="w-6 h-6 text-gray-600" />
          </button>
          
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Напишите сообщение..."
            className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          
          {newMessage.trim() ? (
            <button
              type="submit"
              disabled={isSending}
              className="p-2.5 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full hover:shadow-lg transition-all disabled:opacity-50"
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          ) : (
            <button
              type="button"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Mic className="w-6 h-6 text-gray-600" />
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
