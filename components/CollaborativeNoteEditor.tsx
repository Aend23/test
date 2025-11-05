"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";
import { Bold, Italic, List, Users } from "lucide-react";
import Pusher from "pusher-js";

interface CollaborativeNoteEditorProps {
  noteId?: string;
  contactId: string;
  initialContent?: string;
  currentUser: {
    id: string;
    name: string;
    color: string;
  };
  onUpdate?: (content: string) => void;
  placeholder?: string;
}

export function CollaborativeNoteEditor({
  noteId,
  contactId,
  initialContent = "",
  currentUser,
  onUpdate,
  placeholder = "Start typing...",
}: CollaborativeNoteEditorProps) {
  const [activeUsers, setActiveUsers] = useState<Set<string>>(new Set());
  const [pusherChannel, setPusherChannel] = useState<any>(null);

  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onUpdate?.(html);
      
      // Broadcast typing status
      if (pusherChannel) {
        pusherChannel.trigger("client-typing", {
          userId: currentUser.id,
          userName: currentUser.name,
        });
      }
    },
  });

  useEffect(() => {
    // Initialize Pusher for real-time presence
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY || "", {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "us2",
    });

    const channelName = `presence-note-${contactId}`;
    const channel = pusher.subscribe(channelName);

    channel.bind("pusher:subscription_succeeded", (members: any) => {
      const userIds = new Set<string>();
      members.each((member: any) => {
        if (member.id !== currentUser.id) {
          userIds.add(member.info.name);
        }
      });
      setActiveUsers(userIds);
    });

    channel.bind("pusher:member_added", (member: any) => {
      if (member.id !== currentUser.id) {
        setActiveUsers((prev) => new Set(prev).add(member.info.name));
      }
    });

    channel.bind("pusher:member_removed", (member: any) => {
      setActiveUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(member.info.name);
        return newSet;
      });
    });

    setPusherChannel(channel);

    // Cleanup
    return () => {
      pusher.unsubscribe(channelName);
      pusher.disconnect();
    };
  }, [contactId, currentUser.id, currentUser.name]);

  if (!editor) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p>Loading editor...</p>
      </div>
    );
  }

  return (
    <div className="border-2 border-gray-200 rounded-xl bg-white focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={`p-2 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-30 ${
              editor.isActive("bold") ? "bg-indigo-100 text-indigo-700" : "text-gray-700"
            }`}
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={`p-2 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-30 ${
              editor.isActive("italic") ? "bg-indigo-100 text-indigo-700" : "text-gray-700"
            }`}
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-gray-300 mx-1"></div>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded-lg hover:bg-gray-200 transition-colors ${
              editor.isActive("bulletList") ? "bg-indigo-100 text-indigo-700" : "text-gray-700"
            }`}
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>
        </div>

        {/* Active users indicator */}
        {activeUsers.size > 0 && (
          <div className="flex items-center gap-2 text-xs text-gray-600 bg-indigo-50 px-3 py-1 rounded-full">
            <Users className="w-3 h-3" />
            <span>
              {activeUsers.size === 1
                ? `${Array.from(activeUsers)[0]} editing`
                : `${activeUsers.size} people editing`}
            </span>
          </div>
        )}
      </div>

      {/* Editor Content */}
      <EditorContent
        editor={editor}
        className="px-4 py-3 min-h-[120px] prose prose-sm max-w-none focus:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[100px]"
        placeholder={placeholder}
      />
    </div>
  );
}
