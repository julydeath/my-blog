import React, { ComponentPropsWithoutRef } from 'react';
import Link from 'next/link';
import { highlight } from 'sugar-high';
import Image from 'next/image';

type HeadingProps = ComponentPropsWithoutRef<'h1'>;
type ParagraphProps = ComponentPropsWithoutRef<'p'>;
type ListProps = ComponentPropsWithoutRef<'ul'>;
type ListItemProps = ComponentPropsWithoutRef<'li'>;
type AnchorProps = ComponentPropsWithoutRef<'a'> & { href?: string };
type BlockquoteProps = ComponentPropsWithoutRef<'blockquote'>;
type ImageProps = ComponentPropsWithoutRef<'img'> & { src?: string; alt?: string; };
type PreProps = ComponentPropsWithoutRef<'pre'>;
type CodeProps = ComponentPropsWithoutRef<'code'> & { className?: string; children: string; };

// Custom components for MDX
const TOCInline = ({
  toc,
  exclude = '',
  toHeading = 6,
  fromHeading = 1,
  asDisclosure = false,
  indentDepth = 3,
}: {
  toc: Array<{ value: string; url: string; depth: number }>;
  exclude?: string | string[];
  toHeading?: number;
  fromHeading?: number;
  asDisclosure?: boolean;
  indentDepth?: number;
}) => {
  const excludeArray = Array.isArray(exclude) ? exclude : [exclude];
  
  const filteredToc = toc.filter(
    (heading) => 
      heading.depth >= fromHeading && 
      heading.depth <= toHeading &&
      !excludeArray.includes(heading.value)
  );

  const DisclosureContent = () => (
    <ul className="mt-4 space-y-2 text-sm">
      {filteredToc.map((heading) => {
        const indentClass = heading.depth > indentDepth ? 'ml-4' : '';
        return (
          <li key={heading.value} className={`${indentClass}`}>
            <a 
              href={heading.url} 
              className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 transition-colors"
            >
              {heading.value}
            </a>
          </li>
        );
      })}
    </ul>
  );

  if (asDisclosure) {
    return (
      <details className="my-4 border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
        <summary className="font-medium cursor-pointer focus:outline-none">
          Table of Contents
        </summary>
        <DisclosureContent />
      </details>
    );
  }

  return <DisclosureContent />;
};

// Customized pre component for code blocks
const Pre = (props: PreProps) => {
  
  return (
    <pre 
      className="relative overflow-x-auto rounded-lg my-4 p-4 text-sm bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
      {...props}
    />
  );
};

// Code component with syntax highlighting and language label
const Code = ({ className, children, ...props }: CodeProps) => {
  const language = className ? className.replace(/language-/, '') : '';
  const codeHTML = highlight(children);
  
  return (
    <div className="group relative">
      {language && (
        <div className="absolute right-0 top-0 px-2 py-1 rounded-bl bg-gray-200 dark:bg-gray-700 text-xs font-mono opacity-70">
          {language}
        </div>
      )}
      {/* <button 
        className="absolute right-0 bottom-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => navigator.clipboard.writeText(children)}
        aria-label="Copy code"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
      </button> */}
      <code 
        className={className} 
        dangerouslySetInnerHTML={{ __html: codeHTML }} 
        {...props}
      />
    </div>
  );
};

// Custom component for rendering images
const ImageComponent = ({ src, alt, ...props }: ImageProps) => {
  if (!src) return null;
  
  return (
    <figure className="my-6">
      <div className="overflow-hidden rounded-lg">
        {src.startsWith('/') ? (
          <Image
            src={src}
            alt={alt || ''}
            width={800}
            height={500}
            className="w-full h-auto"
            {...props}
          />
        ) : (
          // For external images
          <img
            src={src}
            alt={alt || ''}
            className="w-full h-auto rounded-lg"
            {...props}
          />
        )}
      </div>
      {alt && <figcaption className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">{alt}</figcaption>}
    </figure>
  );
};

// Custom callout component
const Callout = ({
  type = 'info',
  children
}: {
  type?: 'info' | 'warning' | 'error' | 'success';
  children: React.ReactNode;
}) => {
  const typeStyles = {
    info: 'bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/30 dark:border-yellow-800',
    error: 'bg-red-50 border-red-200 dark:bg-red-900/30 dark:border-red-800',
    success: 'bg-green-50 border-green-200 dark:bg-green-900/30 dark:border-green-800'
  };
  
  return (
    <div className={`p-4 my-6 border rounded-lg ${typeStyles[type]}`}>
      {children}
    </div>
  );
};

// Footnote reference
const FootnoteReference = ({ id }: { id: string }) => {
  return (
    <a 
      href={`#footnote-${id}`} 
      id={`footnote-ref-${id}`}
      className="text-blue-500 align-super text-xs ml-0.5"
    >
      [{id}]
    </a>
  );
};

// Footnote
const Footnote = ({ id, children }: { id: string; children: React.ReactNode }) => {
  return (
    <div id={`footnote-${id}`} className="text-sm mt-2">
      <a href={`#footnote-ref-${id}`} className="mr-1 text-blue-500">
        [{id}]
      </a>
      {children}
    </div>
  );
};

// Table implementation
const Table = ({ children }: { children: React.ReactNode }) => (
  <div className="overflow-x-auto my-6">
    <table className="min-w-full border-collapse">
      {children}
    </table>
  </div>
);

const Thead = (props: ComponentPropsWithoutRef<'thead'>) => (
  <thead className="bg-gray-100 dark:bg-gray-800" {...props} />
);

const Tbody = (props: ComponentPropsWithoutRef<'tbody'>) => (
  <tbody className="divide-y divide-gray-200 dark:divide-gray-700" {...props} />
);

const Tr = (props: ComponentPropsWithoutRef<'tr'>) => (
  <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/60" {...props} />
);

const Th = (props: ComponentPropsWithoutRef<'th'>) => (
  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" {...props} />
);

const Td = (props: ComponentPropsWithoutRef<'td'>) => (
  <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-300" {...props} />
);

// Tags display component
const Tags = ({ tags = [] }: { tags: string[] }) => {
  if (!tags.length) return null;
  
  return (
    <div className="flex flex-wrap gap-2 my-4">
      {tags.map((tag) => (
        <Link 
          key={tag} 
          href={`/tags/${tag}`}
          className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full transition"
        >
          #{tag}
        </Link>
      ))}
    </div>
  );
};

// Divider
const Hr = () => (
  <hr className="my-8 border-t border-gray-200 dark:border-gray-800" />
);

// Export the combined components
const components = {
  h1: (props: HeadingProps) => (
    <h1 className="font-medium pt-12 mb-4 text-3xl" {...props} />
  ),
  h2: (props: HeadingProps) => (
    <h2
      className="text-gray-800 dark:text-zinc-200 font-medium mt-8 mb-3 text-2xl scroll-mt-24"
      {...props}
    />
  ),
  h3: (props: HeadingProps) => (
    <h3
      className="text-gray-800 dark:text-zinc-200 font-medium mt-8 mb-3 text-xl scroll-mt-24"
      {...props}
    />
  ),
  h4: (props: HeadingProps) => (
    <h4 
      className="font-medium text-lg mt-6 mb-2 scroll-mt-24" 
      {...props} 
    />
  ),
  h5: (props: HeadingProps) => (
    <h5 
      className="font-medium text-base mt-6 mb-2" 
      {...props} 
    />
  ),
  h6: (props: HeadingProps) => (
    <h6 
      className="font-medium text-base mt-6 mb-2 text-gray-600 dark:text-zinc-400" 
      {...props} 
    />
  ),
  p: (props: ParagraphProps) => (
    <p className="text-gray-800 dark:text-zinc-300 leading-relaxed my-4" {...props} />
  ),
  ol: (props: ListProps) => (
    <ol
      className="text-gray-800 dark:text-zinc-300 list-decimal pl-5 space-y-2 my-4"
      {...props}
    />
  ),
  ul: (props: ListProps) => (
    <ul
      className="text-gray-800 dark:text-zinc-300 list-disc pl-5 space-y-1 my-4"
      {...props}
    />
  ),
  li: (props: ListItemProps) => <li className="pl-1 mb-1" {...props} />,
  em: (props: ComponentPropsWithoutRef<'em'>) => (
    <em className="font-medium italic" {...props} />
  ),
  strong: (props: ComponentPropsWithoutRef<'strong'>) => (
    <strong className="font-semibold" {...props} />
  ),
  a: ({ href, children, ...props }: AnchorProps) => {
    const className =
      'text-blue-500 hover:text-blue-700 dark:text-blue-400 hover:dark:text-blue-300 underline underline-offset-2 decoration-gray-300 dark:decoration-gray-700';
    if (href?.startsWith('/')) {
      return (
        <Link href={href} className={className} {...props}>
          {children}
        </Link>
      );
    }
    if (href?.startsWith('#')) {
      return (
        <a href={href} className={className} {...props}>
          {children}
        </a>
      );
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        {...props}
      >
        {children}
      </a>
    );
  },
  img: ImageComponent,
  pre: Pre,
  code: ({ className, children, ...props }: CodeProps) => {
    if (className) {
      // This is a code block, use the enhanced Code component
      return <Code className={className} children={children} {...props} />;
    }
    // This is an inline code, use simple styling
    return (
      <code 
        className="font-mono text-sm px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700" 
        {...props}
      >
        {children}
      </code>
    );
  },
  blockquote: (props: BlockquoteProps) => (
    <blockquote
      className="ml-[0.075em] border-l-4 border-gray-300 pl-4 text-gray-700 italic dark:border-zinc-600 dark:text-zinc-300 my-6"
      {...props}
    />
  ),
  hr: Hr,
  table: Table,
  thead: Thead,
  tbody: Tbody,
  tr: Tr,
  th: Th,
  td: Td,
  // Custom components
  TOCInline,
  Callout,
  FootnoteReference,
  Footnote,
  Tags,
};

// Custom components for blog layouts
export const BlogHeader = ({ 
  title, 
  date, 
  author, 
  tags = [],
  readingTime 
}: { 
  title: string;
  date: string;
  author?: string;
  tags?: string[];
  readingTime?: string;
}) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      
      <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm space-x-4 mb-4">
        {date && (
          <time dateTime={date}>
            {new Date(date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        )}
        
        {readingTime && (
          <span>· {readingTime} read</span>
        )}
      </div>
      
      {author && (
        <div className="flex items-center mb-4">
          <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 mr-3"></div>
          <span className="font-medium">{author}</span>
        </div>
      )}
      
      {tags && tags.length > 0 && (
        <Tags tags={tags} />
      )}
      
      <hr className="mt-6 border-t border-gray-200 dark:border-gray-800" />
    </div>
  );
};

export const BlogFooter = ({
  nextPost,
  prevPost
}: {
  nextPost?: { slug: string; title: string };
  prevPost?: { slug: string; title: string };
}) => {
  return (
    <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {prevPost && (
          <Link 
            href={`/blog/${prevPost.slug}`}
            className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/60 transition"
          >
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Previous Article</div>
            <div className="font-medium">{prevPost.title}</div>
          </Link>
        )}
        
        {nextPost && (
          <Link 
            href={`/blog/${nextPost.slug}`}
            className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/60 transition text-right md:ml-auto"
          >
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Next Article</div>
            <div className="font-medium">{nextPost.title}</div>
          </Link>
        )}
      </div>
      
      <div className="mt-8 text-center">
        <Link 
          href="/blog"
          className="inline-flex items-center px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/60 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to all articles
        </Link>
      </div>
    </div>
  );
};

declare global {
  type MDXProvidedComponents = typeof components;
}

export function useMDXComponents(): MDXProvidedComponents {
  return components;
}