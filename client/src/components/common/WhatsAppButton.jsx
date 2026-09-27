import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton = ({ phone = "919876543210", message = "Hi Zelvora Accessories! I have an inquiry regarding your products." }) => {
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 rounded-full shadow-lg transition-transform hover:scale-110 flex items-center gap-2 group cursor-pointer"
      title="Chat on WhatsApp"
      aria-label="Contact Store via WhatsApp"
    >
      <MessageCircle className="w-6 h-6 fill-current" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out text-sm font-medium pr-1">
        Chat with Us
      </span>
    </a>
  );
};

export default WhatsAppButton;
