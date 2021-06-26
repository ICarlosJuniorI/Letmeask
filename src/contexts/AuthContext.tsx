import { createContext, ReactNode, useEffect, useState } from "react";
import { auth, firebase } from "../services/firebase";

type User = {
  id: string;
  name: string;
  avatar: string;
}

type AuthContextType = {
  user: User | undefined;
  signInWithGoogle: () => Promise<void>;
}

type AuthContextProviderProps = {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props: AuthContextProviderProps) {

  const [user, setUser] = useState<User>();

  useEffect(() => {
    //Se usuário já tiver logado anteriormente
    const unsubscribe = auth.onAuthStateChanged(user => {
      //Se o usuário tem informações dentro dele
      if (user) {
        const { displayName, photoURL, uid } = user;

        // Se não tiver nome ou foto retorna um erro
        if (!displayName || !photoURL) {
          throw new Error('Missing information from Google Account');
        }

        // Se tem nome e foto
        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL
        });
      }
    })

    return () => {
      unsubscribe();
    }
  }, []);

  async function signInWithGoogle() {
    // Autenticação com o Google
    const provider = new firebase.auth.GoogleAuthProvider();

    // Login vai abrir como um popup
    const result = await auth.signInWithPopup(provider);

    // Se a autenticação der certo
    if (result.user) {
      const { displayName, photoURL, uid } = result.user;

      // Se não tiver nome ou foto retorna um erro
      if (!displayName || !photoURL) {
        throw new Error('Missing information from Google Account');
      }

      // Se tem nome e foto
      setUser({
        id: uid,
        name: displayName,
        avatar: photoURL
      });
    }
  }
  return (
    <AuthContext.Provider value={{ user, signInWithGoogle }}>
      {props.children}
    </AuthContext.Provider>
  );
}