import { useRef, useState } from "react";
import supabase from "../utils/supabase";
import { useAuth } from "../Context/auth.context";

export default function CommentForm({ postId, onCommentAdded }) {
  const commentRef = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const userInfos = JSON.parse(user)

  const handleSubmit = async (e) => {
    e.preventDefault();
    const content = commentRef.current.value.trim();
    if (!content) return;

    setIsSubmitting(true);
   
    const { error } = await supabase
      .from("comments")
      .insert({
        content: commentRef.current.value,
        author_id: userInfos.user.id,
        post_id: postId
      });

    setIsSubmitting(false);

    if (error) {
      alert("Erreur lors de l'envoi du commentaire");
    } else {
      commentRef.current.value = "";
      if (onCommentAdded) onCommentAdded();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-12 group">
      <label htmlFor="comment" className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
        Laisser un commentaire
      </label>
      <div className="relative">
        <textarea
          id="comment"
          ref={commentRef}
          required
          rows="4"
          placeholder="Qu'en pensez-vous ?"
          className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-700 placeholder:text-slate-300 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 outline-none transition-all resize-none font-sans"
        />
        <div className="flex justify-end mt-3">
          <button
            disabled={isSubmitting}
            className={`px-6 py-2.5 bg-slate-900 text-white rounded-full text-sm font-bold shadow-sm transition-all hover:bg-indigo-600 active:scale-95 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Envoi..." : "Publier"}
          </button>
        </div>
      </div>
    </form>
  );
}