import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { useAuth } from "../context/auth.context";
import supabase from "../utils/supabase";
import { Plus } from "lucide-react";

export default function Layout() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  console.log(user)

  useEffect(() => {
    if (!user) return;

    const userInfos = JSON.parse(user);

    const getUser = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("username,email")
        .eq("id", userInfos.user.id)
        .single();

      if (error) {
        console.error("Erreur récupération profile :", error);
        setLoading(false);
        return;
      }

      setProfile(data);
      setLoading(false);
    };

    getUser();
  }, [user]);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg rotate-3 shadow-indigo-200 shadow-lg"></div>
            <span className="text-xl font-black tracking-tighter uppercase">
              Journal.
            </span>
          </div>
          <div className="flex items-center gap-6">
            {!loading && user && <span>Bonjour, {profile.username}</span>}
            {!loading && !profile && <span>Utilisateur inconnu</span>}
            {!user && <span onClick={() => navigate('/login')} className="text-indigo-600 hover:underline cursor-pointer">Connectez-vous</span>}

          {user &&
            <button className="flex items-center bg-slate-900 text-white px-5 cursor-pointer py-2.5 rounded-full text-sm font-medium hover:bg-indigo-600 transition-all shadow-sm" onClick={() => navigate('/post/new')}>
             <Plus /> Écrire un article
            </button>
          }
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <Outlet />
      </main>

      {/* Footer minimal */}
      <footer className="max-w-6xl mx-auto px-6 py-12 border-t border-slate-200 mt-20 text-center md:text-left">
        <p className="text-sm text-slate-400">© 2026 Journal Inc. Tous droits réservés.</p>
      </footer>
    </>
  );
}