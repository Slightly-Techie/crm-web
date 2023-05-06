import { ReactNode, createContext, useContext, useState } from "react";

type Auth = {
  isAuthenticated: boolean;
  accessToken?: string;
  user?: string;
};

interface IAuthContext {
  auth: Auth;
  setAuth: React.Dispatch<React.SetStateAction<Auth>>;
  persist: boolean;
  setPersist: React.Dispatch<React.SetStateAction<boolean>>;
}

const initialAuthContext: IAuthContext = {
  auth: {
    isAuthenticated: false,
  },
  setAuth: () => {
    return;
  },
  persist: JSON.parse(localStorage.getItem("persist")?.toString() || "true"),
  setPersist: () => {
    return;
  },
};

const AuthContext = createContext<IAuthContext>(initialAuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<Auth>(initialAuthContext.auth);
  const [persist, setPersist] = useState(initialAuthContext.persist);

  return (
    <AuthContext.Provider value={{ auth, setAuth, persist, setPersist }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuthContext = () => useContext(AuthContext);
