"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import TiptapLink from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import { useEffect, useRef, useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

interface RichTextEditorProps {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

function ToolbarButton({
  onClick,
  active,
  title,
  children,
  disabled,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault(); // prevent editor losing focus
        onClick();
      }}
      title={title}
      disabled={disabled}
      className={`p-1.5 rounded text-sm transition-colors min-w-[28px] flex items-center justify-center ${
        active
          ? "bg-[#c9a84c] text-black font-bold"
          : "text-gray-400 hover:text-white hover:bg-white/10"
      } disabled:opacity-30 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-5 bg-gray-700 mx-0.5 shrink-0" />;
}

export default function RichTextEditor({
  name,
  value = "",
  onChange,
  placeholder = "Write your content here...",
}: RichTextEditorProps) {
  const [mounted, setMounted] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder }),
      TiptapLink.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-[#c9a84c] underline cursor-pointer",
          rel: "noopener noreferrer",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-sm my-4 border border-gray-800",
        },
      }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate({ editor }) {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[300px] p-4 text-gray-200 text-sm leading-relaxed focus:outline-none",
      },
    },
  });

  useEffect(() => {
    if (editor && editor.getHTML() !== value) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);


  const handleSetLink = () => {
    if (!editor) return;
    const prevUrl = editor.getAttributes("link").href ?? "";
    const url = window.prompt("Enter URL (leave empty to remove link):", prevUrl);
    if (url === null) return; // cancelled
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }
  };

  const handleImageUrl = () => {
    if (!editor) return;
    const url = window.prompt("Enter Image URL:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    try {
      setIsUploading(true);
      const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "")}`;
      const storageRef = ref(storage, `editor-images/${filename}`);
      
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      
      editor.chain().focus().setImage({ src: url }).run();
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Failed to upload image.");
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const headingValue = !editor
    ? "p"
    : editor.isActive("heading", { level: 1 })
    ? "1"
    : editor.isActive("heading", { level: 2 })
    ? "2"
    : editor.isActive("heading", { level: 3 })
    ? "3"
    : "p";

  if (!mounted) return null;

  return (
    <div className="border border-gray-800 rounded-sm overflow-hidden bg-[#0a0a0a] focus-within:border-[#c9a84c] transition-colors">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 bg-[#111111] border-b border-gray-800 sticky top-0 z-10">
        {/* Heading/Paragraph select */}
        <select
          className="bg-[#0a0a0a] text-gray-400 text-xs border border-gray-700 rounded px-2 py-1 mr-1 focus:outline-none hover:border-gray-500 cursor-pointer"
          onMouseDown={(e) => e.stopPropagation()}
          onChange={(e) => {
            if (!editor) return;
            const val = e.target.value;
            if (val === "p") editor.chain().focus().setParagraph().run();
            else editor.chain().focus().setHeading({ level: parseInt(val) as 1 | 2 | 3 }).run();
          }}
          value={headingValue}
        >
          <option value="p">Paragraph</option>
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
        </select>

        <Divider />

        {/* Bold */}
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleBold().run()}
          active={editor?.isActive("bold")}
          title="Bold (Ctrl+B)"
        >
          <strong>B</strong>
        </ToolbarButton>
        {/* Italic */}
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          active={editor?.isActive("italic")}
          title="Italic (Ctrl+I)"
        >
          <em>I</em>
        </ToolbarButton>
        {/* Underline */}
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
          active={editor?.isActive("underline")}
          title="Underline (Ctrl+U)"
        >
          <span className="underline">U</span>
        </ToolbarButton>
        {/* Strikethrough */}
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleStrike().run()}
          active={editor?.isActive("strike")}
          title="Strikethrough"
        >
          <span className="line-through">S</span>
        </ToolbarButton>
        {/* Inline Code */}
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleCode().run()}
          active={editor?.isActive("code")}
          title="Inline Code"
        >
          <code className="text-xs">{"`c`"}</code>
        </ToolbarButton>

        <Divider />

        {/* Align Left */}
        <ToolbarButton
          onClick={() => editor?.chain().focus().setTextAlign("left").run()}
          active={editor?.isActive({ textAlign: "left" })}
          title="Align Left"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 6h18v2H3zm0 4h12v2H3zm0 4h18v2H3zm0 4h12v2H3z"/>
          </svg>
        </ToolbarButton>
        {/* Align Center */}
        <ToolbarButton
          onClick={() => editor?.chain().focus().setTextAlign("center").run()}
          active={editor?.isActive({ textAlign: "center" })}
          title="Align Center"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 6h18v2H3zm3 4h12v2H6zm-3 4h18v2H3zm3 4h12v2H6z"/>
          </svg>
        </ToolbarButton>
        {/* Align Right */}
        <ToolbarButton
          onClick={() => editor?.chain().focus().setTextAlign("right").run()}
          active={editor?.isActive({ textAlign: "right" })}
          title="Align Right"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 6h18v2H3zm6 4h12v2H9zm-6 4h18v2H3zm6 4h12v2H9z"/>
          </svg>
        </ToolbarButton>

        <Divider />

        {/* Bullet List */}
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          active={editor?.isActive("bulletList")}
          title="Bullet List"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3-1h14v2H7zm-3 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3-1h14v2H7zm-3 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3-1h14v2H7z"/>
          </svg>
        </ToolbarButton>
        {/* Ordered List */}
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          active={editor?.isActive("orderedList")}
          title="Numbered List"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2zm1-9h1V4H2v1h1zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2zm5-5v2h14V6zm0 6v2h14v-2zm0 6v2h14v-2z"/>
          </svg>
        </ToolbarButton>

        <Divider />

        {/* Blockquote */}
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          active={editor?.isActive("blockquote")}
          title="Blockquote"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
          </svg>
        </ToolbarButton>
        {/* Code Block */}
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
          active={editor?.isActive("codeBlock")}
          title="Code Block"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9.4 16.6 4.8 12l4.6-4.6L8 6l-6 6 6 6zm5.2 0 4.6-4.6-4.6-4.6L16 6l6 6-6 6z"/>
          </svg>
        </ToolbarButton>
        {/* Horizontal Rule */}
        <ToolbarButton
          onClick={() => editor?.chain().focus().setHorizontalRule().run()}
          title="Horizontal Divider"
          active={false}
        >
          <span className="text-xs font-bold">—</span>
        </ToolbarButton>

        <Divider />

        {/* Link */}
        <ToolbarButton
          onClick={handleSetLink}
          active={editor?.isActive("link")}
          title="Insert Link (Ctrl+K)"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
          </svg>
        </ToolbarButton>

        {/* Image URL */}
        <ToolbarButton
          onClick={handleImageUrl}
          title="Insert Image from URL"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
          </svg>
        </ToolbarButton>

        {/* Image Upload */}
        <ToolbarButton
          onClick={() => fileInputRef.current?.click()}
          title="Upload Image"
          disabled={isUploading}
        >
          {isUploading ? (
            <span className="text-xs font-bold animate-pulse">...</span>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/>
            </svg>
          )}
        </ToolbarButton>

        <Divider />

        {/* Undo */}
        <ToolbarButton
          onClick={() => editor?.chain().focus().undo().run()}
          disabled={!editor?.can().undo()}
          title="Undo (Ctrl+Z)"
          active={false}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"/>
          </svg>
        </ToolbarButton>
        {/* Redo */}
        <ToolbarButton
          onClick={() => editor?.chain().focus().redo().run()}
          disabled={!editor?.can().redo()}
          title="Redo (Ctrl+Y)"
          active={false}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7z"/>
          </svg>
        </ToolbarButton>
      </div>

      {/* Editor area with placeholder styles */}
      <style>{`
        .tiptap p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #4b5563;
          pointer-events: none;
          height: 0;
        }
        .tiptap h1 { font-size: 1.75rem; font-weight: 700; color: #fff; margin: 0.75rem 0 0.5rem; }
        .tiptap h2 { font-size: 1.4rem; font-weight: 700; color: #fff; margin: 0.75rem 0 0.5rem; }
        .tiptap h3 { font-size: 1.15rem; font-weight: 600; color: #fff; margin: 0.5rem 0 0.25rem; }
        .tiptap ul { list-style: disc; padding-left: 1.5rem; margin: 0.5rem 0; }
        .tiptap ol { list-style: decimal; padding-left: 1.5rem; margin: 0.5rem 0; }
        .tiptap li { margin: 0.2rem 0; }
        .tiptap blockquote { border-left: 3px solid #c9a84c; padding-left: 1rem; margin: 0.75rem 0; color: #9ca3af; font-style: italic; }
        .tiptap pre { background: #111; border: 1px solid #374151; border-radius: 4px; padding: 0.75rem 1rem; margin: 0.75rem 0; overflow-x: auto; }
        .tiptap code { background: #1f2937; color: #c9a84c; padding: 0.15rem 0.4rem; border-radius: 3px; font-size: 0.85em; font-family: monospace; }
        .tiptap pre code { background: none; color: #e5e7eb; padding: 0; font-size: 0.875rem; }
        .tiptap hr { border: none; border-top: 1px solid #374151; margin: 1rem 0; }
        .tiptap a { color: #c9a84c; text-decoration: underline; }
        .tiptap p { margin: 0.4rem 0; }
        .tiptap:focus { outline: none; }
      `}</style>

      <EditorContent editor={editor} className="tiptap-wrapper" />

      {/* Hidden input to submit content via form */}
      <input type="hidden" name={name} value={value} />
      
      {/* Hidden file input for image upload */}
      <input 
        type="file" 
        ref={fileInputRef} 
        hidden 
        accept="image/*" 
        onChange={handleImageUpload} 
      />
    </div>
  );
}
