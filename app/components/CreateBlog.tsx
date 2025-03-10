'use client';

import { useState } from 'react';
import { useEditor, EditorContent, BubbleMenu, FloatingMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import Youtube from '@tiptap/extension-youtube';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import Blockquote from '@tiptap/extension-blockquote';
import CodeBlock from '@tiptap/extension-code-block';
import { TbHeading, TbBold, TbItalic, TbList, TbListNumbers, TbAlignLeft, TbAlignCenter, 
         TbAlignRight, TbLink, TbPhoto, TbBrandYoutube, TbQuote, TbCode } from 'react-icons/tb';

export default function CreateBlog() {
  const [query, setQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [showVideoInput, setShowVideoInput] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      Heading.configure({
        levels: [1, 2, 3, 4],
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
        validate: href => /^https?:\/\//.test(href),
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder: 'Start writing or generate content...',
      }),
      Youtube.configure({
        controls: true,
        nocookie: true,
      }),
      BulletList,
      OrderedList,
      ListItem,
      Blockquote,
      CodeBlock,
    ],
    content: "<h1>Understanding JavaScript Promises: An In-depth Guide with Examples</h1>\n\n<p>When it comes to handling asynchronous operations in JavaScript, Promises come to the rescue. They offer a powerful and flexible approach to manage asynchronous code, providing a significant improvement over traditional callback functions. This blog post delves into the core concepts of JavaScript Promises and illustrates their use with practical examples.</p>\n\n<h2>What is a Promise in JavaScript?</h2>\n\n<p>A Promise in JavaScript is an object that represents the eventual completion or failure of an asynchronous operation. It serves as a placeholder for the eventual results of the operation. Promises are in one of three states:</p>\n\n<ol>\n<li>Pending: The operation is still ongoing.</li>\n<li>Fulfilled: The operation has completed, and the Promise has a resulting value.</li>\n<li>Rejected: The operation failed, and the Promise has a reason for the failure.</li>\n</ol>\n\n<h2>Creating a Promise</h2>\n\n<p>Creating a Promise in JavaScript is straightforward. You instantiate a new Promise object and provide it with an executor function that takes two parameters - resolve and reject. These are functions that you call to determine the outcome of the Promise.</p>\n\n<blockquote>\n<pre>\nnew Promise((resolve, reject) => {\n  // asynchronous operation\n});\n</pre>\n</blockquote>\n\n<h3>Example: Creating a Promise</h3>\n\n<pre>\nlet promise = new Promise((resolve, reject) => {\n  let success = true;\n  if(success) {\n    resolve(\"The operation was successful.\");\n  } else {\n    reject(\"The operation failed.\");\n  }\n});\n</pre>\n\n<h2>Using a Promise</h2>\n\n<p>Once a Promise is created, you can use the <code>.then()</code> method to schedule actions once the Promise is settled (either fulfilled or rejected). The <code>.then()</code> method takes two optional arguments, both of which are callback functions. The first callback is invoked when the Promise is fulfilled, and the second when the Promise is rejected.</p>\n\n<h3>Example: Using a Promise</h3>\n\n<pre>\npromise.then(\n  successMessage => {\n    console.log(successMessage);\n  },\n  failureMessage => {\n    console.log(failureMessage);\n  }\n);\n</pre>\n\n<h2>Error Handling in Promises</h2>\n\n<p>Promises in JavaScript provide a robust way of handling errors. The <code>.catch()</code> method is used to handle any rejection in a chain of Promises. If a Promise is rejected but does not have a corresponding rejection handler, the error is passed down the chain until it encounters a <code>.catch()</code> method.</p>\n\n<h3>Example: Error Handling in Promises</h3>\n\n<pre>\npromise.then(\n  successMessage => {\n    console.log(successMessage);\n  }\n).catch(\n  failureMessage => {\n    console.log(failureMessage);\n  }\n);\n</pre>\n\n<h2>Conclusion</h2>\n\n<p>JavaScript Promises provide an efficient way to handle asynchronous operations, making your code cleaner and easier to understand. They offer great features like chaining and error propagation that simplify the management of async tasks. With the knowledge of Promises, you can write more efficient and manageable JavaScript code.</p>",
  });
  
  const generateContent = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query,
          format: 'blog' // Tell the AI to format as a blog with headings, lists, etc.
        }),
      });
      
      const data = await response.json();
      if (data.content) {
        editor?.commands.setContent(data.content);
        // Extract a title from the first few words if none exists
        if (!title) {
          const firstLine = data.content.split('\n')[0];
          setTitle(firstLine.replace(/^#\s+/, '').slice(0, 50));
        }
      }
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const addImage = () => {
    if (imageUrl && editor) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl('');
      setShowImageInput(false);
    }
  };
  
  const addVideo = () => {
    if (videoUrl && editor) {
      editor.chain().focus().setYoutubeVideo({ src: videoUrl }).run();
      setVideoUrl('');
      setShowVideoInput(false);
    }
  };
  
  const addLink = () => {
    if (linkUrl && editor) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl('');
      setShowLinkInput(false);
    }
  };
  
  const publishPost = async () => {
    if (!editor || !title) return;
    
    const content = editor.getHTML();
    const slug = title.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-');
    
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          content,
          publishedAt: new Date().toISOString(),
        }),
      });
      
      if (response.ok) {
        // Reset the form
        setTitle('');
        setQuery('');
        editor.commands.setContent('<p>Post published successfully!</p>');
      }
    } catch (error) {
      console.error('Error publishing post:', error);
    }
  };
  
  if (!editor) {
    return null;
  }
  
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-4">Create New Blog Post</h1>
      
      <div className="mb-6">
        <input
          type="text"
          placeholder="Enter a topic to generate content..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button 
          onClick={generateContent}
          disabled={isGenerating || !query}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
        >
          {isGenerating ? 'Generating...' : 'Generate Content'}
        </button>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Post Title</label>
        <input
          type="text"
          placeholder="Enter blog title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      
      <div className="border rounded mb-4 overflow-hidden">
        <div className="bg-gray-800 p-2 border-b flex flex-wrap gap-2">
          {/* Text formatting */}
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-1 rounded ${editor.isActive('bold') ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
            title="Bold"
          >
            <TbBold size={20} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-1 rounded ${editor.isActive('italic') ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
            title="Italic"
          >
            <TbItalic size={20} />
          </button>
          
          {/* Headings */}
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-1 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
            title="Heading"
          >
            <TbHeading size={20} />
          </button>
          
          {/* Lists */}
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-1 rounded ${editor.isActive('bulletList') ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
            title="Bullet List"
          >
            <TbList size={20} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-1 rounded ${editor.isActive('orderedList') ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
            title="Numbered List"
          >
            <TbListNumbers size={20} />
          </button>
          
          {/* Alignment */}
          <button
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`p-1 rounded ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
            title="Align Left"
          >
            <TbAlignLeft size={20} />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`p-1 rounded ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
            title="Align Center"
          >
            <TbAlignCenter size={20} />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`p-1 rounded ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
            title="Align Right"
          >
            <TbAlignRight size={20} />
          </button>
          
          {/* Quote and code */}
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-1 rounded ${editor.isActive('blockquote') ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
            title="Quote"
          >
            <TbQuote size={20} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`p-1 rounded ${editor.isActive('codeBlock') ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
            title="Code Block"
          >
            <TbCode size={20} />
          </button>
          
          {/* Link */}
          <button
            onClick={() => setShowLinkInput(!showLinkInput)}
            className={`p-1 rounded ${editor.isActive('link') ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
            title="Link"
          >
            <TbLink size={20} />
          </button>
          
          {/* Media */}
          <button
            onClick={() => setShowImageInput(!showImageInput)}
            className="p-1 rounded hover:bg-gray-200"
            title="Add Image"
          >
            <TbPhoto size={20} />
          </button>
          <button
            onClick={() => setShowVideoInput(!showVideoInput)}
            className="p-1 rounded hover:bg-gray-200"
            title="Add YouTube Video"
          >
            <TbBrandYoutube size={20} />
          </button>
        </div>
        
        {showImageInput && (
          <div className="p-2 bg-gray-50 border-b flex">
            <input
              type="text"
              placeholder="Enter image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="flex-1 p-1 border rounded mr-2"
            />
            <button 
              onClick={addImage}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              Add Image
            </button>
          </div>
        )}
        
        {showVideoInput && (
          <div className="p-2 bg-gray-50 border-b flex">
            <input
              type="text"
              placeholder="Enter YouTube URL"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="flex-1 p-1 border rounded mr-2"
            />
            <button 
              onClick={addVideo}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              Add Video
            </button>
          </div>
        )}
        
        {showLinkInput && (
          <div className="p-2 bg-gray-50 border-b flex">
            <input
              type="text"
              placeholder="Enter URL"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="flex-1 p-1 border rounded mr-2"
            />
            <button 
              onClick={addLink}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              Add Link
            </button>
          </div>
        )}
        
        <div className="p-4 min-h-[400px]">
          <EditorContent editor={editor} className="prose max-w-none" />
        </div>
      </div>

      {editor && (
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
          <div className="bg-white shadow-lg rounded flex p-1 border">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-1 rounded ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
            >
              <TbBold size={16} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-1 rounded ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
            >
              <TbItalic size={16} />
            </button>
            <button
              onClick={() => setShowLinkInput(!showLinkInput)}
              className={`p-1 rounded ${editor.isActive('link') ? 'bg-gray-200' : ''}`}
            >
              <TbLink size={16} />
            </button>
          </div>
        </BubbleMenu>
      )}
      
      <button 
        onClick={publishPost}
        disabled={!editor?.getText() || !title}
        className="bg-green-500 text-white px-6 py-2 rounded font-medium hover:bg-green-600"
      >
        Publish Post
      </button>
    </div>
  );
}