import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

export default function BackButton() {
  const navigate = useNavigate();
  
  return (
    <button
      onClick={() => navigate('/')}
      className="flex items-center text-gray-600 hover:text-blue-600 transition-colors mb-6 group"
    >
      <FaArrowLeft className="mr-2 transition-transform group-hover:-translate-x-1" /> 
      Back to Menu
    </button>
  );
}