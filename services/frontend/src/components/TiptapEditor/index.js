'use client';

import TextAlign from '@tiptap/extension-text-align';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  FiAlignCenter,
  FiAlignJustify,
  FiAlignLeft,
  FiAlignRight,
  FiBold,
  FiItalic,
} from 'react-icons/fi';

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="border-b border-gray-200 p-2 flex gap-2">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
        title="Bold"
      >
        <FiBold size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive('italic') ? 'bg-gray-200' : ''
        }`}
        title="Italic"
      >
        <FiItalic size={16} />
      </button>
      <div className="w-px h-6 bg-gray-200 mx-2" />
      <button
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : ''
        }`}
        title="Align left"
      >
        <FiAlignLeft size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : ''
        }`}
        title="Align center"
      >
        <FiAlignCenter size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : ''
        }`}
        title="Align right"
      >
        <FiAlignRight size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive({ textAlign: 'justify' }) ? 'bg-gray-200' : ''
        }`}
        title="Justify"
      >
        <FiAlignJustify size={16} />
      </button>
    </div>
  );
};

const TiptapEditor = ({ content = '', onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      TextAlign.configure({
        types: ['paragraph', 'heading'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
    },
    editorProps: {
      attributes: {
        class: 'prose max-w-none p-4 min-h-[200px] focus:outline-none [&_*]:outline-none',
        spellcheck: 'false',
      },
    },
    enableCoreExtensions: true,
    immediateRender: false,
  });

  if (typeof window === 'undefined') {
    return null;
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className="[&_*]:outline-none [&_*]:spellcheck-none" />
    </div>
  );
};

export default TiptapEditor;
