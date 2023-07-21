import React, { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { deleteDoc, doc, getDoc, getDocs, limit, query, setDoc, updateDoc, where } from 'firebase/firestore';
import {db, auth, userRef} from '../../src/firebase/firebaseConfig'
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar'
import Link from 'next/link';
import { toast } from 'react-toastify';
import { Spinner } from 'react-bootstrap';
import { useAuth } from '../../components/AuthStateContext';
import LoadingPage from '../../components/LoadingPage';
import SubmitButton from '../../components/SubmitButton';

export default function LoginPage(ip : any) {
  const router = useRouter()
  const ipAddress : string = ip.ip;
  const{authUser, loading} = useAuth()
  const [userId, setUserId] = useState<string>()
  const [password, setPassword] = useState<string>()
  const [error, setError] = useState<boolean>(false)
  const[isLoading, setIsLoading] = useState<boolean>(false)
  const [currentAttempts, setCurrentAttempts] = useState<number>(0)
  const [tooManyAttempts, setTooMannyAttempts] = useState<boolean>(false)
  const maximumAttempts = 3;
  const bannedDays = 7;

  async function submitHandler(){ //CHECKS IF USER IP ADDRESS IS IN BANNED LIST OR 
    
    setIsLoading(true)
    const docRef = doc(db, "bannedIp", ipAddress);
    const docSnap = await getDoc(docRef);

    if(docSnap.exists() && docSnap.data().unbanDate.toDate() > new Date()){ setTooMannyAttempts(true); setIsLoading(false)}
    else{ docSnap.exists()? deleteDoc(docRef).then(login).then(() => setIsLoading(false)) : login() } 
  }

  async function login() { //TRY TO LOGIN
      if(currentAttempts >= maximumAttempts){
        setTooMannyAttempts(true)
  
        const unsubscribeToListener = async() => await setDoc(doc(db, "bannedIp", ipAddress), {
          unbanDate : new Date(new Date().setDate(new Date().getDate() + bannedDays))
        });
        
        return unsubscribeToListener()
      }

      if(!tooManyAttempts && userId !== undefined && userId !== '' && password !== undefined && password !== '')
      {
        GetUserEmail(userId)//GET EMAIL OF USER AND SET IT AS AN ID
        .then((email : string) => {
          if(email !== '' && email.includes('@')) {
            signInWithEmailAndPassword(auth, email, password) //IF EMAIL EXISTS TRY TO LOGIN
            .then(() => { //REDIRECTS USER TO DASHSBOARD
              RecordLogin(email)
              .then(() => {
                toast.success("Login Successful")
                setIsLoading(false)
                router.push('/')
              })
            })
            .catch(() => {
              setIsLoading(false)
              setCurrentAttempts(value => value + 1)
              setError(true)
            })
          }
          else {
            setIsLoading(false)
            setCurrentAttempts(value => value + 1)
            setError(true)
          }
        })
      }
  }

  async function RecordLogin(userId : string){ //UPDATES LAST LOGIN OF USER
      var q : any;
      var docId = '';
      userId.includes('@') ? q = query(userRef, where("email", "==", userId), limit(1)) : query(userRef, where("username", "==", userId), limit(1))
  
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => { docId = doc.id });
  
      const docRef = doc(db, 'userId', docId)
      updateDoc( docRef, {
          lastActivity: new Date()
      })
      .then(() => {
          console.log("Updated Document")
      })
  }
  
  async function GetUserEmail(userId : any){ //GET EMAIL OF USER
      if(userId.includes('@')) { return userId;}
  
      var email = ''
      const q = query(userRef, where("username", "==", userId), limit(1))
  
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => { email = doc.data().email});
  
      return email
  }

  if(loading){return <LoadingPage/>}
  if(authUser){ router.push('/'); return <LoadingPage/>}

  return (
    <>
      <title> Quiz Magus - Login </title>
      <Navbar/>
      <div className='login_form'>
        <div className = 'login_container'>
          <form onSubmit={submitHandler}>
              <h1>LOGIN</h1>
              {tooManyAttempts && <p>Too Many Attempts. Please Try Again Later </p>}
              <section>
                  <input required type ="name" placeholder='Email or Username' onChange={(event : any) => {setUserId(event.target.value.toLowerCase())}}/>
              </section>
              <section>
                  <input required type ="password" placeholder='Password' onChange={(event : any) => {setPassword(event.target.value)}}/>
                  {error && <p> Invalid Username or Password</p>}
              </section>

              {/* SUBMIT BUTTON */}
              <SubmitButton isLoading={isLoading} handleSubmit={submitHandler} name={"Login"} />

              <div className="login_container_text2">
                <h2> Don&apos;t have an account? <Link href="/register"> Sign up </Link></h2>
              </div>
          </form>
        </div>

        
      </div>
    </>
  )
}

export async function getServerSideProps({ req } : any) {
  const ip = req.headers["x-real-ip"] || req.connection.remoteAddress
  return {
    props: {
      ip,
    },
  }
}
