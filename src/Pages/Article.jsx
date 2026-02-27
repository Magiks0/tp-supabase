import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import supabase from "../utils/supabase";
import CommentForm from "../Components/CommentForm";
import { useAuth } from "../Context/auth.context";

export default function Article() {
  const { id } = useParams();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  const userInfos = JSON.parse(user);

  const isAdmin = userInfos.user.email.includes('admin');

  const fetchComments = async () => {
    const { data } = await supabase
      .from("comments")
      .select("id, content, author_id(username)")
      .eq("post_id", id)
    if (data) setComments(data);
  };

  const handleDelete = async () => {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id)

      if (error) {
        console.error(error);
        return;
      }

      navigate('/home');
  }

  useEffect(() => {
    async function getPostDetails() {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          id,
          title,
          content,
          author_id (
            username
          )
        `)
        .eq('id', id);

      if (error) {
        console.error(error);
        return;
      }
      setArticles(data);
      await fetchComments();
      setLoading(false);
    }
    getPostDetails();
  }, [id]);

  const article = articles[0];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center font-sans text-slate-400 animate-pulse">
      Chargement de l'article...
    </div>
  );

  if (!article) return (
    <div className="min-h-screen flex flex-col items-center justify-center font-sans">
      <p className="text-slate-500 mb-4">Article introuvable.</p>
      <button onClick={goBack} className="text-indigo-600 font-bold underline">Retour</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-serif">
      {/* Barre de progression fictive */}
      <div className="fixed top-0 left-0 w-full h-1 bg-indigo-600 z-50"></div>

      <nav className="max-w-3xl mx-auto px-6 py-8 flex items-center justify-between font-sans">
        <button 
          onClick={goBack}
          className="group flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> 
          Retour
        </button>
        {isAdmin && (
          <button 
            onClick={handleDelete}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-red-500 bg-red-50 rounded-lg hover:bg-red-100 hover:text-red-600 transition-all active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Supprimer l'article
          </button>
        )}
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Lecture en cours</span>
      </nav>

      <main className="max-w-3xl mx-auto px-6 pt-8 pb-24">
        <header className="mb-12 font-sans">
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-indigo-50 text-indigo-600 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
              Publication #{article.id}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] mb-8 tracking-tight">
            {article.title}
          </h1>

          <div className="flex items-center gap-4 py-6 border-y border-slate-100">
            <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-100">
              {article.author_id?.username?.substring(0, 1).toUpperCase() || "A"}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">
                {article.author_id?.username || "Auteur Anonyme"}
              </p>
              <p className="text-xs text-slate-500 font-medium">Expert technique</p>
            </div>
          </div>
        </header>

        {/* Image de couverture dynamique */}
        <div className="aspect-video mb-12 rounded-3xl overflow-hidden bg-slate-100 border border-slate-200">
           <div 
             className="w-full h-full opacity-80 flex items-center justify-center"
             style={{ background: `linear-gradient(135deg, #4f46e5, #9333ea)` }}
           >
                <span className="text-white font-black text-2xl opacity-30 uppercase tracking-tighter">
                  {article.title.split(' ')[0]}
                </span>
           </div>
        </div>

        {/* Contenu de l'article */}
        <article className="prose prose-slate lg:prose-xl max-w-none">
          {/* On utilise un affichage simple du contenu. Si ton contenu est en HTML, utilise dangerouslySetInnerHTML */}
          <div className="whitespace-pre-line text-lg leading-relaxed text-slate-700">
            {article.content}
          </div>
        </article>

        <div className="mt-16 flex flex-wrap gap-2 pt-8 border-t border-slate-100">
          {['Tech', 'Supabase', 'React'].map(tag => (
            <span key={tag} className="text-xs font-medium text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full">
              #{tag}
            </span>
          ))}
        </div>

        <section className="mt-24 pt-16 border-t border-slate-100 font-sans">
          <h3 className="text-2xl font-black tracking-tighter uppercase mb-8">
            Commentaires <span className="text-slate-300 ml-2">{comments.length}</span>
          </h3>

          {/* Formulaire */}
          <CommentForm postId={id} onCommentAdded={fetchComments} />

          {/* Liste des commentaires */}
          <div className="mt-16 space-y-10">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400 uppercase">
                      {comment.author_id?.username?.substring(0, 1) || "A"}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {comment.author_id?.username || "Anonyme"}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                        {new Date(comment.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <div className="pl-11">
                    <p className="text-slate-600 leading-relaxed text-[15px]">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-10 text-slate-400 italic text-sm">
                Soyez le premier à partager votre avis.
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}