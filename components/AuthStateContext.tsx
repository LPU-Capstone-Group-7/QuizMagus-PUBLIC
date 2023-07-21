import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../src/firebase/firebaseConfig';


export const authUserContext = createContext({ //CREATED AUTH CONTEXT THAT HOLDS LOADING AND AUTH USER
    authUser: null as any,
    loading: true
});

const formatAuthUser = (user : any) => ({ 
    uid: user.uid,
    email: user.email
  });

export function AuthUserProvider({children} : any){ //CONTEXT PROVIDER FOR USE CONTEXT HOOK THAT PASSES THE GLOBAL CONTEXT VARIABLES
    const authStatus = useFirebaseAuth()
    return <authUserContext.Provider value ={authStatus}>{children}</authUserContext.Provider>
}

export const useAuth = () => useContext(authUserContext) //CUSTOM HOOK FOR AUTH STATE

export default function useFirebaseAuth() { 
    
    const [authUser, setAuthUser] = useState(null);
    const [loading, setLoading] = useState(true);
  
    const authStateChanged = async (authState : any) => { //EVENT HANDLER THAT CHANGES AUTH STATUS WHEN USER TRIES TO LOGIN OR LOGOUT
      if (!authState) {
        setAuthUser(null)
        setLoading(false)
        return;
      }
  
      setLoading(true)
      var formattedUser : any = formatAuthUser(authState);
      setAuthUser(formattedUser);    
      setLoading(false);
    };
  
    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged(authStateChanged); //CALLS THE EVENT HANDLER WHEN FIREBASE NOTIFIES US THAT THE AUTH STATUS HAS CHANGED
      return () => unsubscribe();
    }, []);

  return{
    authUser,
    loading
  }
}
