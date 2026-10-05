"use client";

import { useState, useEffect, useTransition } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { BlogComment } from "@/lib/data";
import { incrementLike, addComment } from "@/lib/actions";

export default function BlogInteractions({ 
  slug, 
  initialLikes, 
  comments,
  type = 'blog'
}: { 
  slug: string; 
  initialLikes: number; 
  comments: BlogComment[];
  type?: 'blog' | 'portfolio';
}) {
  const { t } = useLanguage();
  const [likes, setLikes] = useState(initialLikes || 0);
  const [hasLiked, setHasLiked] = useState(false);
  const [isPendingLike, startLikeTransition] = useTransition();
  const [isPendingComment, startCommentTransition] = useTransition();
  
  const [shareStatus, setShareStatus] = useState<"idle" | "copied">("idle");
  const [commentStatus, setCommentStatus] = useState<"idle" | "pendingApproval">("idle");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasLiked(localStorage.getItem(`liked_${type}_${slug}`) === "true");
    }
  }, [slug, type]);

  const handleLike = () => {
    if (hasLiked || isPendingLike) return;

    setLikes(prev => prev + 1);
    setHasLiked(true);
    if (typeof window !== "undefined") {
      localStorage.setItem(`liked_${type}_${slug}`, "true");
    }

    startLikeTransition(async () => {
      await incrementLike(slug, type);
    });
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          url,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(url);
      setShareStatus("copied");
      setTimeout(() => setShareStatus("idle"), 2000);
    }
  };

  const submitComment = async (formData: FormData) => {
    startCommentTransition(async () => {
      const result = await addComment(slug, formData, type);
      if (result.success) {
        setCommentStatus("pendingApproval");
        setReplyingTo(null);
        setTimeout(() => setCommentStatus("idle"), 5000); // clear after 5s
      } else {
        alert(result.error || "An error occurred");
      }
    });
  };

  // Group comments
  const topLevelComments = comments.filter(c => !c.parentId);
  
  const getReplies = (parentId: number) => {
    return comments.filter(c => c.parentId === parentId);
  };

  const CommentForm = ({ parentId = null }: { parentId?: number | null }) => (
    <div className={`rounded-md ${parentId ? 'mt-4' : 'p-6 border'} transition-all`} style={{ background: parentId ? 'transparent' : 'var(--bg-card)', borderColor: "var(--border-color)" }}>
      {!parentId && (
        <h4 className="font-bold text-lg mb-4" style={{ color: "var(--text-primary)" }}>
          {t.blogInteractions.addComment}
        </h4>
      )}
      
      {commentStatus === "pendingApproval" ? (
        <div className="p-4 rounded text-sm text-center font-medium" style={{ background: "var(--bg-secondary)", color: "var(--color-accent)" }}>
          {t.blogInteractions.pendingApproval}
        </div>
      ) : (
        <form action={submitComment} className="space-y-4">
          {parentId && <input type="hidden" name="parentId" value={parentId} />}
          <div>
            <input 
              type="text" 
              name="name" 
              required
              placeholder={t.blogInteractions.namePlaceholder}
              className="w-full px-4 py-3 rounded-sm border focus:outline-none transition-colors"
              style={{ 
                background: "var(--bg-secondary)", 
                borderColor: "var(--border-color)",
                color: "var(--text-primary)"
              }}
            />
          </div>
          <div>
            <textarea 
              name="content" 
              required
              rows={3}
              placeholder={t.blogInteractions.commentPlaceholder}
              className="w-full px-4 py-3 rounded-sm border focus:outline-none transition-colors resize-y"
              style={{ 
                background: "var(--bg-secondary)", 
                borderColor: "var(--border-color)",
                color: "var(--text-primary)"
              }}
            ></textarea>
          </div>
          <div className="flex gap-3">
            <button 
              type="submit"
              disabled={isPendingComment}
              className="px-6 py-2 font-semibold text-sm rounded-sm transition-all disabled:opacity-50"
              style={{ background: "var(--color-accent)", color: "var(--bg-primary)" }}
            >
              {isPendingComment ? t.blogInteractions.submitting : t.blogInteractions.submit}
            </button>
            {parentId && (
              <button 
                type="button"
                onClick={() => setReplyingTo(null)}
                className="px-6 py-2 font-semibold text-sm rounded-sm transition-all border"
                style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)" }}
              >
                {t.blogInteractions.cancelReply}
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );

  return (
    <div className="mt-16 pt-8 border-t" style={{ borderColor: "var(--border-color)" }}>
      {/* Actions (Like & Share) */}
      <div className="flex items-center space-x-6 mb-12">
        <button 
          onClick={handleLike}
          disabled={hasLiked || isPendingLike}
          className="flex items-center space-x-2 transition-opacity hover:opacity-80 disabled:opacity-50"
          style={{ color: hasLiked ? "var(--color-accent)" : "var(--text-secondary)" }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={hasLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
          </svg>
          <span className="font-medium text-lg">{likes}</span>
        </button>

        <button 
          onClick={handleShare}
          className="flex items-center space-x-2 transition-opacity hover:opacity-80"
          style={{ color: "var(--text-secondary)" }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
            <polyline points="16 6 12 2 8 6"/>
            <line x1="12" x2="12" y1="2" y2="15"/>
          </svg>
          <span className="font-medium text-sm">
            {shareStatus === "copied" ? t.blogInteractions.copied : t.blogInteractions.share}
          </span>
        </button>
      </div>

      {/* Comments Section */}
      <div>
        <h3 className="text-2xl font-bold mb-8" style={{ color: "var(--text-primary)" }}>
          {t.blogInteractions.comments} ({comments.length})
        </h3>

        {comments.length === 0 ? (
          <p className="mb-8 italic" style={{ color: "var(--text-secondary)" }}>
            {t.blogInteractions.noComments}
          </p>
        ) : (
          <div className="space-y-6 mb-10">
            {topLevelComments.map(comment => (
              <div key={comment.id} className="space-y-4">
                {/* Parent Comment */}
                <div className="p-5 rounded-md border" style={{ background: "var(--bg-secondary)", borderColor: "var(--border-color)" }}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>{comment.name}</span>
                    <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{comment.date}</span>
                  </div>
                  <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--text-secondary)" }}>{comment.content}</p>
                  
                  <button 
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                    className="text-xs font-semibold hover:underline"
                    style={{ color: "var(--color-accent)" }}
                  >
                    {replyingTo === comment.id ? t.blogInteractions.cancelReply : t.blogInteractions.reply}
                  </button>
                  
                  {replyingTo === comment.id && (
                    <CommentForm parentId={comment.id} />
                  )}
                </div>

                {/* Replies */}
                {getReplies(comment.id).length > 0 && (
                  <div className="pl-8 space-y-4 border-l-2 ml-4" style={{ borderColor: "var(--border-color)" }}>
                    {getReplies(comment.id).map(reply => (
                      <div key={reply.id} className="p-4 rounded-md border" style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>
                            {reply.name} 
                            <span className="text-xs font-normal opacity-50 ml-2">(Reply)</span>
                          </span>
                          <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{reply.date}</span>
                        </div>
                        <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{reply.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Top-Level Comment Form */}
        <CommentForm />
      </div>
    </div>
  );
}
