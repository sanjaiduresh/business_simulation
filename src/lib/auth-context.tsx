import { createContext, useContext, useState, useEffect } from "react";
import { useDatabase } from "./database-context";

// Define user type
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Define auth context type
interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
}

// Create auth context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  login: async () => {},
  logout: async () => {},
  register: async () => {},
});

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // const db = useDatabase();

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        // const demoUser = await db.getUserByEmail('demo@example.com');
        const res = await fetch("/api/users/me");
        const data: any = await res.json();
        if (data) {
          setUser({
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role,
          });
        }
        
        setLoading(false);
      } catch (err) {
        if (!user) {
          setLoading(false);
          return;
        }
        setError(
          "Failed to check session: " +
            (err instanceof Error ? err.message : String(err))
        );
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error(`${res.statusText}`);
      }

      const loggedUser: any = await res.json();
      if (!loggedUser) {
        throw new Error("Invalid email or password");
      }

      setUser({
        id: loggedUser.user.id,
        name: loggedUser.user.name,
        email: loggedUser.user.email,
        role: loggedUser.user.role,
      });

      setLoading(false);
    } catch (err) {
      setError(
        "Login failed: " + (err instanceof Error ? err.message : String(err))
      );
      setLoading(false);
      throw err;
    }
  };

  // Logout function
  const logout = () => {
    // In a real app, this would invalidate the session token
    try{
    setUser(null);
    setLoading(false);
    setError(null);
    fetch("/api/auth/logout", {
      method: "POST",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`${res.statusText}`);
        }
        return res.json();
      })
      .then(() => {
        console.log("Logged out successfully");
      })
      .catch((err) => {
        console.error("Logout failed:", err);
      });
    }catch(err){
      setError(
        "Logout failed: " + (err instanceof Error ? err.message : String(err))
      );
    }finally{
      window.location.href = "/";
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data: any = await res.json();
      const existingUser = data.error == "Email already in use";
      if (existingUser) {
        throw new Error("Email already in use");
      }
      const newUser = data;
      // const passwordHash = '$2a$10$demopasswordhashvalue';

      // const userId = await db.createUser({
      //   id: `user_${Date.now()}`,
      //   name,
      //   email,
      //   passwordHash,
      //   role: 'user',
      //   createdAt: new Date().toISOString(),
      //   updatedAt: new Date().toISOString()
      // });

      // const newUser = await db.getUser(userId);
      // if (!newUser) {
      //   throw new Error('Failed to create user');
      // }

      setUser({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      });

      setLoading(false);
    } catch (err) {
      setError(
        "Registration failed: " +
          (err instanceof Error ? err.message : String(err))
      );
      setLoading(false);
      throw err;
    }
  };

  // Context value
  const value = {
    user,
    loading,
    error,
    login,
    logout,
    register,
  };


  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook to use auth context
export function useAuth() {
  return useContext(AuthContext);
}
