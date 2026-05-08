import { useNavigate } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';

const SupportHub = () => {
    const navigate = useNavigate();

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans">
            <button
                onClick={() => navigate('/support-center')}
                className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-indigo-700 transition-all transform hover:scale-110 active:scale-95"
            >
                <MessageCircle size={32} />
            </button>
        </div>
    );
};

export default SupportHub;
