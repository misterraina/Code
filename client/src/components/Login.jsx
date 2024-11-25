import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../AuthProvider";

const Login = ({ setIsAuthenticated, setRole }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null); // State for error messages
    const navigate = useNavigate();
    const {login} = useAuth()

    const handleLogin = async (e) => {
        e.preventDefault(); 
        setError(null); 

        try {
            const user = await login(username, password);
            if (user) {
                if (user.role === "admin") {
                    navigate("/admin", { replace: true }); // Use replace to avoid history stack clutter.
                } else if (user.role === "user") {
                    navigate("/", { replace: true });
                } else {
                    setError("Role not recognized. Please contact support.");
                }
            } else {
                setError("Invalid username or password. Please try again.");
            }
        } catch (err) {
            setError("An error occurred while logging in. Please try again.");
            console.error("Login error:", err);
        }
    };


    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-100">
        <form 
          onSubmit={handleLogin} 
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-md"
        >
          <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
  
          <div className="mb-4">
            <label 
              htmlFor="username" 
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-200"
              required
            />
          </div>
  
          <div className="mb-6">
            <label 
              htmlFor="password" 
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-200"
              required
            />
          </div>
  
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          >
            Login
          </button>
        <p className="text-center mt-4">
          <span className="text-gray-600">Don't have an account? </span>
          <Link to="/register" className="text-blue-500 hover:text-blue-600">
            Go to Register
          </Link>
        
        </p>
        </form>
      </div>
    );
};

export default Login;
