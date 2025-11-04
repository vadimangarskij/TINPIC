import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const ChatPage = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b flex items-center space-x-3">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="font-bold">Чат</h1>
      </div>
      
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-500">Сообщения</p>
      </div>
    </div>
  );
};

export default ChatPage;
