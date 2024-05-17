import React from 'react';

const FlashMessage = ({ message, type, onClose }) => {
  const getMessageStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-100 border-green-500 text-green-700';
      case 'error':
        return 'bg-red-100 border-red-500 text-red-700';
      default:
        return 'bg-blue-100 border-blue-500 text-blue-700';
    }
  };

  return (
    <div className={`border-l-4 p-4 ${getMessageStyles()} my-4`} role="alert">
      <div className="flex justify-between items-center">
        <p>{message}</p>
        <button onClick={onClose} className="text-xl font-bold ml-4">&times;</button>
      </div>
    </div>
  );
};

export default FlashMessage;
