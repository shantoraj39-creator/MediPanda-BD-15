import React from 'react';
import { X, Facebook, Instagram, MessageCircle, Twitter, Copy, Check, Link } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  text: string;
  url?: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, title, text, url }) => {
  if (!isOpen) return null;

  const shareUrl = url || window.location.href;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(`${title}\n${text}`);
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${title}\n${text}\n${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInstagram = () => {
     // Instagram doesn't have a direct web share intent for text/links.
     // Best practice: Copy content to clipboard and open Instagram.
     navigator.clipboard.writeText(`${title}\n${text}\n${shareUrl}`);
     alert("Content copied! You can now paste it into your Instagram Story or Messages.");
     window.open('https://www.instagram.com', '_blank');
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-white w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl p-6 animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
           <h3 className="font-bold text-lg text-gray-800">Share via</h3>
           <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5 text-gray-500" /></button>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
           {/* Facebook */}
           <a 
             href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`}
             target="_blank"
             rel="noopener noreferrer"
             className="flex flex-col items-center gap-2 group"
           >
              <div className="w-12 h-12 bg-[#1877F2] rounded-full flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform">
                 <Facebook className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium text-gray-600">Facebook</span>
           </a>

           {/* Instagram */}
           <button 
             onClick={handleInstagram}
             className="flex flex-col items-center gap-2 group"
           >
              <div className="w-12 h-12 bg-gradient-to-tr from-[#FFDC80] via-[#FD1D1D] to-[#833AB4] rounded-full flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform">
                 <Instagram className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium text-gray-600">Instagram</span>
           </button>

           {/* WhatsApp */}
           <a 
             href={`https://wa.me/?text=${encodedText}%20${encodedUrl}`}
             target="_blank"
             rel="noopener noreferrer"
             className="flex flex-col items-center gap-2 group"
           >
              <div className="w-12 h-12 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform">
                 <MessageCircle className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium text-gray-600">WhatsApp</span>
           </a>

           {/* Twitter/X */}
           <a 
             href={`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`}
             target="_blank"
             rel="noopener noreferrer"
             className="flex flex-col items-center gap-2 group"
           >
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform">
                 <Twitter className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium text-gray-600">X</span>
           </a>
        </div>

        {/* Copy Link */}
        <div className="bg-gray-50 p-3 rounded-xl flex items-center justify-between border border-gray-100">
           <div className="flex items-center gap-2 overflow-hidden mr-2">
             <Link className="w-4 h-4 text-gray-400 flex-shrink-0" />
             <p className="text-xs text-gray-500 truncate">{shareUrl}</p>
           </div>
           <button 
             onClick={handleCopy}
             className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
           >
             {copied ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
             {copied ? 'Copied' : 'Copy'}
           </button>
        </div>

      </div>
    </div>
  );
};

export default ShareModal;