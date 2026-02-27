import { useRef } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/auth.context";
import supabase from "../../utils/supabase";

export default function LoginForm() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  async function login() {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: emailRef.current.value,
      password: passwordRef.current.value,
    });

    if (error) {
      console.error(error.message);
      return null;
    }

    return data;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = await login();

    if (!data) return;

    setAuth(data); 

    navigate('/home');
  };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
                    Email
                </label>
                <input 
                    id="email"
                    name="email" 
                    type="email" 
                    ref={emailRef}
                    placeholder="nom@exemple.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
            </div>

            <div>
                <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">
                    Mot de passe
                </label>
                <input 
                    id="password"
                    name="password" 
                    type="password"
                    ref={passwordRef}
                    placeholder="••••••••"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
            </div>

            <button className="w-full py-3 mt-4 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 active:transform active:scale-[0.98] transition-all shadow-md">
                Se connecter
            </button>
        </form>
    )
}