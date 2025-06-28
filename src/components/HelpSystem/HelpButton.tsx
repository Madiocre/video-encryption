import { FaQuestionCircle } from 'react-icons/fa';

interface HelpButtonProps {
  onClick: () => void;
}

export default function HelpButton({ onClick }: HelpButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed top-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-300 z-40"
      aria-label="Help"
    >
      <FaQuestionCircle className="text-xl" />
    </button>
  );
}