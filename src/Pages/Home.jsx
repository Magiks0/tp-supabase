import { useEffect, useState } from "react";
import supabase from "../utils/supabase";
import { useNavigate } from "react-router";

export default function Home() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        id,
        title,
        content,
        profiles (
          username
        )
      `);
    if (data) setArticles(data);
    setLoading(false);
  };

  const channelA = supabase
  .channel('posts-changes')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'posts'
    },
    () => fetchPosts()
  )
  .subscribe()

  useEffect(() => {
    fetchPosts()
  })

  return (
    <div className="min-h-screen text-slate-900 font-sans selection:bg-indigo-100">
        {/* Hero Section */}
        <header className="mb-16">
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-slate-900">
            Dernières <span className="text-indigo-600">réflexions.</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl leading-relaxed">
            Explorez nos derniers articles sur le design, le développement et la tech.
          </p>
        </header>

        {loading ? (
          /* Skeleton Loader Amélioré */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-4 animate-pulse">
                <div className="aspect-[16/10] bg-slate-200 rounded-3xl"></div>
                <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                <div className="h-6 bg-slate-200 rounded w-full"></div>
                <div className="h-4 bg-slate-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-32 border-2 border-dashed border-slate-200 rounded-3xl">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4 text-2xl">
              🌙
            </div>
            <h3 className="text-xl font-bold text-slate-900">Le silence est d'or</h3>
            <p className="text-slate-500">Revenez plus tard pour de nouveaux articles.</p>
          </div>
        ) : (
          /* Grille d'articles */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {articles.map((article, index) => (
              <article key={article.id} className="group cursor-pointer" onClick={() => navigate(`/post/${article.id}`)}>
                
                {/* Image Placeholder / Gradient Card */}
                <div className="relative aspect-[16/10] mb-6 overflow-hidden rounded-3xl bg-slate-100 shadow-sm border border-slate-200/50">
                  <div 
                    className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500"
                    style={{ background: `linear-gradient(135deg, hsl(${(index * 60) % 360}, 80%, 70%), hsl(${(index * 60 + 40) % 360}, 80%, 80%))` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-slate-300 group-hover:scale-110 transition-transform duration-500">
                     <span className="text-6xl font-bold opacity-10">0{index + 1}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                      Tech
                    </span>
                    <span className="text-xs text-slate-400 font-medium">5 min de lecture</span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">
                    {article.title}
                  </h3>

                  <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">
                    {article.content || "Pas de description disponible pour cet article incroyable..."}
                  </p>

                  <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-700">
                        {article.profiles.username}
                      </span>
                    </div>
                    <div className="text-slate-900 font-bold text-sm group-hover:translate-x-1 transition-transform">
                      →
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
    </div>
  );
}