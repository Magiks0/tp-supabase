import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router";
import { useAuth } from "./auth.context";

export default function ProtectedRoutes() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Tant que user est null, on ne montre rien
  if (!user) return null;

  return <Outlet />;
}