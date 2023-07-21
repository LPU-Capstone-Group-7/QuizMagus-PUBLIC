import useFirebaseAuth from "../components/AuthStateContext";
import LoadingPage from "../components/LoadingPage";
import DashboardPage from "../components/dashboard/DashboardPage";
import Navbar from "../components/Navbar";

export default function Home() {

  const {authUser, loading} = useFirebaseAuth()
    
  if(loading){ return <LoadingPage/>}

  if(authUser){ return <DashboardPage/>}

  return (
    <div>
      <title> Quiz Magus </title>
      <Navbar/>
        <main>
          <div className="right_main">
              <div className="model_icon"></div>
          </div>
          <div className="left_main">
              <h1> Quiz Magus </h1>
              <h2> A Game Based Web Application </h2>
          </div>
        </main>
    </div>
  )
  
}
