import { createUserWithEmailAndPassword} from 'firebase/auth'
import { auth, db, userRef } from '../../src/firebase/firebaseConfig'
import {getDocs, query, where, limit, doc, setDoc } from 'firebase/firestore'
import { useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { Spinner } from 'react-bootstrap';
import LoadingPage from '../../components/LoadingPage';
import { useAuth } from '../../components/AuthStateContext';

export default function RegisterPage() {

  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const{authUser, loading} = useAuth()

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [usernameError, setUsernameError] = useState<boolean>(false)
  const [emailError, setEmailError] = useState<boolean>(false)
  const [passwordError, setPasswordError] = useState<boolean>(false)

  const [usernameErrorMessage, setUsernameErrorMessage] = useState('')
  const [emailErrorMessage, setEmailErrorMessage] = useState('')

  const regex = /^[A-Za-z0-9_-]*$/
  const emailFormat = /\S+@\S+\.\S+/;
  
  const registerUsername = (id: string, username : string, email : string) => setDoc(doc(db, 'userId', id), {username: username.toLowerCase(), email : email.toLowerCase()})

  async function signUp( event: any){
    event.preventDefault();

      setIsLoading(true)
      setUsernameError(await usernameIsInvalid(username))     //VALIDATES USERNAME && PASSWORD && EMAIL
      setPasswordError(password.length < 6)
      if(!emailFormat.test(email)){setEmailErrorMessage('Invalid Email'); setEmailError(true)}

      createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
          // Signed in 
          const user = userCredential.user;
          registerUsername(auth.currentUser?.uid ?? '', username, email)
          router.push('/login')

          toast.success("Sign-up Successful")
          setIsLoading(false)        
      }).catch((error) =>{
          setIsLoading(false)
          if(error.code === 'auth/email-already-in-use'){ setEmailErrorMessage('email already in use'); setEmailError(true); return}
        })
  }

  async function usernameIsInvalid(username : string){

    if(username.length < 5 || username.length > 20){setUsernameErrorMessage("username must be between 5 to 20 characters"); return true} 
    if(!regex.test(username)){setUsernameErrorMessage("Letters, numbers, dashes, and underscores only"); return true}

    const q = query(userRef, where("username", "==", username.toLowerCase()), limit(1)) //CHECK IF USERNAME ALREADY EXIST BY QUERYING DATABASE
    const querySnapshot = await getDocs(q);
    if(querySnapshot.size > 0){setUsernameErrorMessage("username already taken"); return true}

    return false;
  }

  if(loading){return <LoadingPage/>}
  if(authUser){ router.push('/'); return <LoadingPage/>}

  return (
    <>
    <title> Quiz Magus - Sign Up </title>
    <Navbar/>
      <div className = "login_form">
        <div className = "login_container">
          <form onSubmit={signUp}>
            <h1>REGISTER</h1>
            <section>
              <input type="text" placeholder="Username" onChange={(event: any) => {setUsername(event.target.value)}}/>
            </section>
            {usernameError &&<p>{usernameErrorMessage}</p>}
            <section>
              <input type="text" placeholder="E-mail" onChange={(event: any) => {setEmail(event.target.value)}}/>
            </section>
            {emailError &&<p>{emailErrorMessage}</p>}
            <section>
              <input type="password" placeholder="Password" onChange={(event: any) => {setPassword(event.target.value)}}/>
            </section>
            {passwordError &&<p>password should atleast be 6 characters</p>}

            <button disabled= {isLoading} type = "submit">
              {isLoading? <Spinner animation="border" size ="sm" variant="quizard-violet" /> : "Sign up"}
            </button>
            <div className="login_container_text">
              <h2> Already have an account? <Link href="/login"> Sign in </Link></h2>
            </div>
          </form>
        </div>

      </div>
    </>
    
  )
}