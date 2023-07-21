import Navbar from '../Navbar';
import { useState, useEffect } from 'react'
import { DocumentSnapshot, collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../../src/firebase/firebaseConfig";
import UserTable from "./UserTable";
import SearchInput from '../question bank/SearchInput';


export default function DashboardPage() {

  const [gameData, setGameData]= useState<any[]>([]); //Storing Data from the Firebase
  const [searchInput, setSearchInput] = useState<string>('')
  const [username, setUsername] = useState<string>('');


  useEffect(() => {
    if(!auth.currentUser) return

    //GET USER'S GAME DATA LIST DOCUMENT REFERENCE
    const userGameDataRef = collection(db, "userId", auth.currentUser.uid, "customizedGameDataSnippet");

    console.log(auth.currentUser.uid)
    //CREATE UNSUB LISTENER
    const unsubscribe = onSnapshot(userGameDataRef, (QuerySnapshot) => {
      const gameDataFromFirestore:any = [];
      QuerySnapshot.forEach((doc) => {
        gameDataFromFirestore.push(doc.data());
        });
        setGameData(gameDataFromFirestore);
    });

    return () => unsubscribe()
},[])

useEffect(() => {
  if (!auth.currentUser) return;

  const userDocRef = doc(db, 'userId', auth.currentUser.uid);
  const fetchData = async () => {
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      const userData = docSnap.data();
      setUsername(userData.username); // Set the username from the document data
      console.log('Document data:', userData);
    } else {
      console.log('No such document');
    }
  };

  fetchData();
}, []);


  return (
    <div>
        <title> Quiz Magus - Dashboard </title>
        <Navbar />
        <div className = "dashboard_main">
          <div className = "dashboard_content">
              <div className="welcome_icon"></div>
              <div className="welcome_text">
              <h1>Welcome, {username}</h1>
                <h2> Education Revolution Awaits with Limitless Possibilities! </h2>
              </div>
          </div>

          <div className="dashboard_search">
            <SearchInput searchInput={searchInput} setSearchInput={setSearchInput} />
          </div>

          <div className="data_content">
          <UserTable gameData = {gameData} searchInput = {searchInput}/>
          </div>
      </div>    
    </div>
  )
}