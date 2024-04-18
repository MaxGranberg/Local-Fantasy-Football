import React from 'react';

function Footer() {
  return (
    <footer className="bg-blue-900 text-white py-4">
      <p className="text-sm ml-6">&copy; {new Date().getFullYear()}</p>
    </footer>
  );
}

export default Footer;