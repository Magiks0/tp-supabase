import { useRef } from "react"
import { useNavigate } from "react-router";
import supabase from "../../utils/supabase";

export default function SignInForm(){
    const formRef = useRef();
    const emailRef = useRef();
    const usernameRef = useRef();
    const passwordRef = useRef();
    const navigate = useNavigate();

    async function insertUser() {
        const {data, error: signUpError} = await supabase.auth.signUp({
            email: emailRef.current.value,
            password: passwordRef.current.value,
        });
       
       if(signUpError) {
        console.error(signUpError);

        return;
       }

       const isAdmin = emailRef.current.value.includes('admin');

       const infos = {id: data.user.id,
        email: emailRef.current.value,
        username: usernameRef.current.value,
        role: isAdmin ? 'ROLE_ADMIN': 'ROLE_USER'};

        console.log(infos)

       const {error: profilesError} = await supabase.from('profiles').insert({
        id: data.user.id,
        email: emailRef.current.value,
        username: usernameRef.current.value,
        role: isAdmin ? 'ROLE_ADMIN': 'ROLE_USER',
       });

       if (profilesError) {
        console.error(signUpError);

        return;
       }

       navigate('/login');
    }

    const handleSubmit = (e) => {
        e.preventDefault();

       insertUser();
    } 

    return (
        <form onSubmit={handleSubmit} ref={formRef} className="space-y-4">
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
                <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
                    Nom d'utilisateur
                </label>
                <input 
                    id="username"
                    name="username" 
                    type="username" 
                    ref={usernameRef}
                    placeholder="Nom d'utilisateur"
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
                S'enregistrer
            </button>
        </form>
    )
}