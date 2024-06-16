import { useContext, useState } from "react";
import "./Login.css";
import { useNavigate, Link } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";

function Login() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { updateUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const enterSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const formInfo = new FormData(e.target);

    const username = formInfo.get("username");
    const password = formInfo.get("password");

    try {
      const res = await apiRequest.post("/auth/login", {
        username,
        password,
      });
      alert("Welcome!")

      updateUser(res.data);

      navigate("/");
    } catch (err) {
      setError(err.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="loginPage">
      <section className="formSection">
        <form onSubmit={enterSubmit}>
          <h1>Welcome back</h1>
          <input name="username" required type="text" placeholder="Username"
            minLength={3}
            maxLength={12}
          />
          <input name="password" type="password" required placeholder="Password"
            minLength={8}
            maxLength={24}
          />
          <button disabled={isLoading}>Login</button>
          {error && <span>{error}</span>}
          <Link to="/register">{"Don't"} you have an account?</Link>
        </form>
      </section>
      <aside className="imageSection">
        <img src="/bg.png" alt="Image background" />
      </aside>
    </div>
  );
}

export default Login;
