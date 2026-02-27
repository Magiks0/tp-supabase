import { useNavigate } from "react-router";
import LoginForm from "../../Components/Auth/LoginForm";

export default function LoginPage(){
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-sm border border-gray-100">
                <h2 className="mb-6 text-2xl font-semibold text-center text-gray-800">Connexion</h2>
                
                <LoginForm />
                
                <p className="mt-6 text-sm text-center text-gray-500">
                    Pas encore inscrit ? <span onClick={() => navigate('/sign-up')} className="text-blue-600 hover:underline cursor-pointer">S'inscrire</span>
                </p>
            </div>
        </div>
    )
}