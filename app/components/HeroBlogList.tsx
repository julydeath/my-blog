// components/BlogList.jsx
'use client';
import { SetStateAction, useState } from 'react';
import Link from 'next/link';

// Mock data - In a real application, you would fetch this from an API
const blogPostsData = [
  {
    id: 1,
    title: 'Getting Started with Next.js',
    description: 'Learn the basics of Next.js and how to create your first application using this powerful React framework.',
    author: 'Jane Doe',
    date: '2025-03-10',
    readTime: '5 min',
    upvotes: 42,
    downvotes: 3,
    tags: ['Next.js', 'React', 'Web Development']
  },
  {
    id: 2,
    title: 'Styling with Tailwind CSS',
    description: 'Discover how to create beautiful, responsive designs quickly with Tailwind CSS utility classes.',
    author: 'John Smith',
    date: '2025-03-08',
    readTime: '4 min',
    upvotes: 38,
    downvotes: 5,
    tags: ['CSS', 'Tailwind', 'Design']
  },
  {
    id: 3,
    title: 'Building a Blog with Next.js App Router',
    description: 'A comprehensive guide to creating a blog using the new App Router in Next.js 13+.',
    author: 'Alex Johnson',
    date: '2025-03-05',
    readTime: '7 min',
    upvotes: 64,
    downvotes: 2,
    tags: ['Next.js', 'App Router', 'Tutorial']
  },
  {
    id: 4,
    title: 'State Management in Modern React Applications',
    description: 'Compare different state management solutions and learn when to use each one for optimal performance.',
    author: 'Sarah Williams',
    date: '2025-03-01',
    readTime: '6 min',
    upvotes: 51,
    downvotes: 4,
    tags: ['React', 'State Management', 'Performance']
  }
];

export default function HeroBlogList() {
  const [sortBy, setSortBy] = useState('latest');
  const [selectedTag, setSelectedTag] = useState('');
  const [blogPosts, setBlogPosts] = useState([...blogPostsData]);
  
  // Get all unique tags
  const allTags = [...new Set(blogPostsData.flatMap(post => post.tags))];
  
  // Handle sorting and filtering
  const handleSort = (option: SetStateAction<string>) => {
    setSortBy(option);
    let sortedPosts = [...blogPosts];
    
    switch(option) {
      case 'latest':
        sortedPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'oldest':
        sortedPosts.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case 'popular':
        sortedPosts.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
        break;
      default:
        break;
    }
    
    setBlogPosts(sortedPosts);
  };
  
  const handleTagFilter = (tag : any) => {
    setSelectedTag(tag);
    
    if (tag === '') {
      // Reset to all posts
      setBlogPosts([...blogPostsData]);
    } else {
      // Filter by selected tag
      const filtered = blogPostsData.filter(post => post.tags.includes(tag));
      setBlogPosts(filtered);
    }
    
    // Re-apply current sort after filtering
    handleSort(sortBy);
  };
  
  // Handle voting (in a real app, this would call an API)
  const handleVote = (id : any, voteType : any) => {
    setBlogPosts(posts => 
      posts.map(post => {
        if (post.id === id) {
          if (voteType === 'up') {
            return {...post, upvotes: post.upvotes + 1};
          } else {
            return {...post, downvotes: post.downvotes + 1};
          }
        }
        return post;
      })
    );
  };

  return (
    <div>
      {/* Filter and sort controls */}
      <div className="mb-8 mt-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {/* <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => handleTagFilter('')}
            className={`px-3 py-1 text-sm rounded-full transition ${
              selectedTag === '' 
                ? 'bg-black text-white dark:bg-white dark:text-black' 
                : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700'
            }`}
          >
            All
          </button>
          {allTags.map(tag => (
            <button 
              key={tag}
              onClick={() => handleTagFilter(tag)}
              className={`px-3 py-1 text-sm rounded-full transition ${
                selectedTag === tag 
                  ? 'bg-black text-white dark:bg-white dark:text-black' 
                  : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700'
              }`}
            >
              {tag}
            </button>
          ))}
        </div> */}
        
        <div className="flex gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400 self-center">Sort by:</span>
          <select 
            value={sortBy}
            onChange={(e) => handleSort(e.target.value)}
            className="bg-gray-100 dark:bg-gray-800 border-none rounded py-1 px-2 text-sm focus:ring-1 focus:ring-gray-400 mx-auto text-center"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
            <option value="popular">Popular</option>
          </select>
        </div>
      </div>
      
      {/* Blog posts grid */}
      <div className="grid grid-cols-1 gap-8">
        {blogPosts.map((post) => (
          <article 
            key={post.id} 
            className="rounded-lg overflow-hidden transition hover:shadow-md dark:hover:shadow-gray-800 p-6 border border-gray-100 dark:border-gray-800"
          >
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-3">
              {post.tags.map(tag => (
                <span 
                  key={`${post.id}-${tag}`} 
                  className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            {/* Title with link */}
            <h2 className="text-xl md:text-2xl font-bold mb-3 hover:text-gray-700 dark:hover:text-gray-300">
              <Link href={`/blog/${post.id}`}>
                {post.title}
              </Link>
            </h2>
            
            {/* Description */}
            <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
              {post.description}
            </p>
            
            {/* Footer section with meta info and votes */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              <div className="mb-2 md:mb-0">
                <div className="flex items-center">
                  <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700 mr-2"></div>
                  <span className="text-sm font-medium">{post.author}</span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {new Date(post.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })} · {post.readTime} read
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Voting buttons */}
                <div className="flex items-center">
                  <button 
                    onClick={() => handleVote(post.id, 'up')}
                    className="text-gray-500 hover:text-green-500 dark:text-gray-400 dark:hover:text-green-400"
                    aria-label="Upvote"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <span className="mx-1 text-sm font-medium">{post.upvotes - post.downvotes}</span>
                  <button 
                    onClick={() => handleVote(post.id, 'down')}
                    className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                    aria-label="Downvote"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                
                {/* Read more link */}
                <Link 
                  href={`/blog/${post.id}`} 
                  className="text-sm font-medium hover:underline"
                >
                  Read more →
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}