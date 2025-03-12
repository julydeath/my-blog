'use client';
import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e : any) => {
    e.preventDefault();
    // Here you would typically send the email to your backend
    setSubmitted(true);
    setEmail('');
  };

  return (
    <footer className="border-t border-gray-200 dark:border-gray-700 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
          {submitted ? (
            <p className="text-green-600 dark:text-green-400 mb-4">Thanks for subscribing!</p>
          ) : (
            <p className="mb-4">Subscribe to our newsletter to get the latest updates.</p>
          )}
          <form onSubmit={handleSubmit} className="flex">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              required
              className="flex-grow px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l focus:outline-none focus:ring-2 focus:ring-gray-400 dark:bg-gray-800"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black font-medium rounded-r hover:bg-gray-800 dark:hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Subscribe
            </button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} MinimalBlog. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}