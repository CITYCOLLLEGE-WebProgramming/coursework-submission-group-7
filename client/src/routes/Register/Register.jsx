import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import apiRequest from "../../lib/apiRequest";

function Register() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const enterSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    const formData = new FormData(e.target);

    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const res = await apiRequest.post("/auth/register", {
        username,
        email,
        password,
      });
      alert("Successful register!");
      navigate("/login");
    } catch (err) {
      setError(err.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="registerPage">
      <section className="formSection">
        <form onSubmit={enterSubmit}>
          <h1>Create an Account</h1>
          <input name="username" required type="text" placeholder="Username" 
          minLength={3}
          maxLength={12} />
          <input name="email" required type="email" placeholder="Email" />
          <input name="password" required type="password" placeholder="Password" 
          minLength={8}
            maxLength={24}/>
          <button disabled={isLoading}>Register</button>
          {error && <span>{error}</span>}
          <Link to="/login">Do you have an account?</Link>
        </form>
      </section>
      <aside className="imageSection">
        <img src="/bg.png" alt="Background" />
      </aside>
    </div>
  );
}

export default Register;
