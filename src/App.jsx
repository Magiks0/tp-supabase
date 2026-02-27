import { BrowserRouter, Routes, Route } from 'react-router'
import './App.css'
import SignInPage from './Pages/Auth/SignInPage';
import LoginPage from './Pages/Auth/LoginPage';
import Home from './Pages/Home';
import ProtectedRoutes from './Context/ProtectedRoutes.jsx';
import Article from './Pages/Article.jsx';
import { AuthProvider } from './context/auth.context.jsx';
import Layout from './Components/Layout.jsx';
import AddArticleForm from './Components/AddArticle.jsx';

function App() {
  return (
    <div>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
         <Route element={<Layout />}>
            <Route element={<ProtectedRoutes />}>
                <Route path="/post/new" element={<AddArticleForm />} />
            </Route>
          
            <Route index path="/home" element={<Home />} />
            <Route path="/post/:id" element={<Article />} />

            <Route path='/sign-up' element={<SignInPage />}/>
            <Route path='/login' element={<LoginPage />}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </div>
  )
}

export default App
