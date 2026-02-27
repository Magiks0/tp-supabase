import {createContext, useContext, useState} from 'react';
import { useNavigate } from 'react-router';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({children}) => {
    let userStorage = localStorage.getItem("user");
    const [user, setUser] = useState(userStorage);
    const setAuth = (data) => {
        localStorage.setItem("user", JSON.stringify(data));
        setUser(user);
    }

    const logout = () => {
        localStorage.removeItem("user");
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, setAuth, logout}}>
            {children}
        </AuthContext.Provider>
    )
}