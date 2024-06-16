import "./layout.css";
import Navbar from "../../components/Navbar/Navbar";
import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function Layout() {
  return (
    <div className="layout">
      <header className="navbar">
        <Navbar />
      </header>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}

function RequireAuth() {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) return <Navigate to="/login" />;
  else {
    return (
      <div className="layout">
        <header className="navbar">
          <Navbar />
        </header>
        <main className="content">
          <Outlet />
        </main>
      </div>
    );
  }
}

export { Layout, RequireAuth };
