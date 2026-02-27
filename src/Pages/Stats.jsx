import { useEffect, useState } from "react";
import supabase from "../utils/supabase";
import Layout from "../components/Layout";

export default function Stats() {
  const [metrics, setMetrics] = useState({
    posts: 0,
    profiles: 0,
    comments: 0,
    latestPost: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getStats() {
      // On lance toutes les requêtes en parallèle pour la performance
      const [postsCount, profilesCount, commentsCount, lastPost] = await Promise.all([
        supabase.from('posts').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('comments').select('*', { count: 'exact', head: true }),
        supabase.from('posts').select('title, created_at').order('created_at', { ascending: false }).limit(1)
      ]);

      setMetrics({
        posts: postsCount.count || 0,
        profiles: profilesCount.count || 0,
        comments: commentsCount.count || 0,
        latestPost: lastPost.data?.[0] || null
      });
      setLoading(false);
    }

    getStats();
  }, []);

  const statsCards = [
    { label: "Articles publiés", value: metrics.posts, icon: "📄", color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Membres actifs", value: metrics.profiles, icon: "👥", color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Commentaires", value: metrics.comments, icon: "💬", color: "text-amber-600", bg: "bg-amber-50" },
  ];

  return (
      <main className="max-w-6xl mx-auto px-6 py-16">
        <header className="mb-12">
          <h2 className="text-3xl font-black tracking-tighter uppercase mb-2">Tableau de <span className="text-indigo-600">Bord</span></h2>
          <p className="text-slate-500 font-medium">Aperçu global de l'activité de votre plateforme.</p>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-pulse">
            {[1, 2, 3].map(i => <div key={i} className="h-40 bg-slate-100 rounded-3xl"></div>)}
          </div>
        ) : (
          <div className="space-y-12">
            {/* Chiffres Clés */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {statsCards.map((stat, i) => (
                <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center text-2xl mb-6`}>
                    {stat.icon}
                  </div>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className={`text-4xl font-black ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Insights Supplémentaires */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-slate-900 rounded-3xl p-8 text-white">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-6">Dernière activité</h3>
                {metrics.latestPost ? (
                  <div>
                    <p className="text-2xl font-bold mb-2">"{metrics.latestPost.title}"</p>
                    <p className="text-slate-400 text-sm">
                      Publié le {new Date(metrics.latestPost.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                    </p>
                  </div>
                ) : (
                  <p className="text-slate-500 italic text-sm">Aucun article récent.</p>
                )}
              </div>

              <div className="bg-white rounded-3xl p-8 border border-slate-100 flex flex-col justify-center">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1">Engagement Communauté</h3>
                    <p className="text-xs text-slate-500 italic">Moyenne de commentaires par article</p>
                  </div>
                  <p className="text-3xl font-black text-slate-900">
                    {metrics.posts > 0 ? (metrics.comments / metrics.posts).toFixed(1) : 0}
                  </p>
                </div>
                {/* Petite barre de progression visuelle */}
                <div className="w-full h-2 bg-slate-100 rounded-full mt-6 overflow-hidden">
                   <div className="h-full bg-indigo-600 rounded-full w-2/3"></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
  );
}