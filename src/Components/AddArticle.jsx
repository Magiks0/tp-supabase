import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../Context/auth.context";
import supabase from "../utils/supabase";

export default function AddArticleForm() {
  const titleRef = useRef();
  const contentRef = useRef();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const userInfos = JSON.parse(user)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase
      .from("posts")
      .insert([
        {
          title: titleRef.current.value,
          content: contentRef.current.value,
          author_id: userInfos.user.id,
        },
      ]);

    setLoading(false);

    if (error) {
      console.error("Erreur lors de l'ajout:", error.message);
    } else {
      navigate("/home");
    }
  };

  return (
    <>
        <header className="mb-12">
          <h2 className="text-3xl font-black tracking-tighter uppercase mb-2">
            Nouvel <span className="text-indigo-600">Article</span>
          </h2>
          <p className="text-slate-500 font-medium">
            Partagez vos pensées avec le monde. Le style sera appliqué automatiquement.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Champ Titre */}
          <div className="group">
            <label htmlFor="title" className="block mb-3 text-xs font-bold uppercase tracking-widest text-slate-400 group-focus-within:text-indigo-600 transition-colors">
              Titre de l'article
            </label>
            <input 
              id="title"
              ref={titleRef}
              required
              placeholder="Un titre percutant..."
              className="w-full bg-transparent text-3xl md:text-4xl font-bold text-slate-900 placeholder:text-slate-200 border-b-2 border-slate-100 focus:border-indigo-600 outline-none pb-4 transition-all"
            />
          </div>

          {/* Champ Contenu */}
          <div className="group">
            <label htmlFor="content" className="block mb-3 text-xs font-bold uppercase tracking-widest text-slate-400 group-focus-within:text-indigo-600 transition-colors">
              Corps de l'article
            </label>
            <textarea 
              id="content"
              ref={contentRef}
              required
              rows="12"
              placeholder="Il était une fois..."
              className="w-full bg-white p-6 rounded-2xl border border-slate-200 text-lg leading-relaxed text-slate-700 placeholder:text-slate-300 focus:ring-4 focus:ring-indigo-50 shadow-sm outline-none transition-all resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-4">
            <button 
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
            >
              Annuler
            </button>
            <button 
              disabled={loading}
              className={`
                px-8 py-4 bg-slate-900 text-white rounded-full font-bold text-sm shadow-xl shadow-slate-200 
                hover:bg-indigo-600 hover:-translate-y-1 active:scale-95 transition-all
                ${loading ? "opacity-50 cursor-not-allowed" : ""}
              `}
            >
              {loading ? "Publication..." : "Publier l'article →"}
            </button>
          </div>
        </form>
        </>
  );
}