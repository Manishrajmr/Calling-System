import { useNavigate } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';

const SupportHub = () => {
    const navigate = useNavigate();

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans">
            <button
                onClick={() => navigate('/support-center')}
                className="w-16 h-16 bg-[#00D67D] text-[#121212] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,214,125,0.3)] hover:shadow-[0_0_30px_rgba(0,214,125,0.5)] transition-all transform hover:scale-110 active:scale-95 relative group"
            >
                <div className="absolute inset-0 bg-[#00D67D] rounded-full blur-md opacity-30 group-hover:opacity-60 animate-pulse transition-opacity" />
                <MessageSquare size={28} className="relative z-10 fill-transparent" />
            </button>
        </div>
    );
};

export default SupportHub;
