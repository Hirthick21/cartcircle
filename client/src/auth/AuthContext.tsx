
import React, { createContext, useContext } from 'react';

type User = { id: string; email?: string; name?: string; phone?: string; firstName?: string; lastName?: string };
type AuthCtx = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: () => void;
  logout: () => void;
};

const Ctx = createContext<AuthCtx>({
  isAuthenticated: false,
  isLoading: false,
  user: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setAuthed] = React.useState(false);
  const [isLoading, setLoading] = React.useState(true);
  const [user, setUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    // Check authentication status
    fetch('/api/user')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Not authenticated');
      })
      .then((data) => {
        setAuthed(true);
        setUser(data);
      })
      .catch(() => {
        setAuthed(false);
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = () => {
    window.location.href = '/api/login';
  };

  const logout = () => {
    window.location.href = '/api/logout';
  };

  return (
    <Ctx.Provider value={{ isAuthenticated, isLoading, user, login, logout }}>
      {children}
    </Ctx.Provider>
  );
};

export const useAuthContext = () => useContext(Ctx);
