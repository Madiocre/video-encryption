import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { FaTimes } from 'react-icons/fa';
import { useHelp } from '../../contexts/HelpContext';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HelpModal({ isOpen, onClose }: HelpModalProps) {
  const { helpContent } = useHelp();

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <div className="p-6 bg-sky-200">
          <DialogHeader>
            <div className="flex justify-between items-center mb-4">
              <DialogTitle>Help</DialogTitle>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
          </DialogHeader>
          <div className="text-xl leading-relaxed">
            {typeof helpContent === 'string' ? (
              <div className="whitespace-pre-line">
                {helpContent}
              </div>
            ) : (
              helpContent
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}