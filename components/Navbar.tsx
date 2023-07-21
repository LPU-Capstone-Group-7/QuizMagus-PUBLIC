import Link from "next/link"
import { signOut } from "firebase/auth"
import { useRouter } from "next/router"
import { toast } from "react-toastify"
import { auth } from "../src/firebase/firebaseConfig"
import { Button } from "react-bootstrap"

function Navbar({ onClickEvent }: any) {
  const router = useRouter()

  async function logout(event: any) {
    event.preventDefault()
    toast.success("Logout Successful")
    router.push("/")
    signOut(auth)
  }

  return (
    <header>
      <div className="header_brand">
        <h1> Quiz Magus </h1>
      </div>
      <div className="header_buttons">
        <ul>
          {auth.currentUser ? (
            <>
              <li>
                <Link onClick={() => onClickEvent && onClickEvent()} href="/"> 
                Home 
                </Link>
              </li>
              <li>
                <Link onClick={() => onClickEvent && onClickEvent()} href="/"> 
                Create a game 
                </Link>
                <ul>
                  <li>
                    <Link onClick={() => onClickEvent && onClickEvent()} href="/create/triviaGame">
                    Trivia Game 
                    </Link>
                  </li>
                  <li>
                  <Link onClick={() => onClickEvent && onClickEvent()} href="/create/wordSearchGame">
                    Word Search
                    </Link>
                  </li>
                  <li>
                  <Link onClick={() => onClickEvent && onClickEvent()} href="/create/crossWordGame">
                    Crossword
                    </Link>
                  </li>
                </ul>
              </li>
              <li>
                <Link onClick={() => onClickEvent && onClickEvent()} href="/questionBank/">
                Question Bank 
                </Link>
              </li>
              <li> 
                <Link onClick={() => onClickEvent && onClickEvent()} href="/classList/">
                  Class List
                </Link>
              </li>

              <Button onClick={logout} id="logout">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-box-arrow-in-right" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0v-2z"/>
              <path fill-rule="evenodd" d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
              </svg>
              </Button>
            </>
          ) : (
            <>
              <li>
                <Link onClick={() => onClickEvent && onClickEvent()} href="/">
                  Home
                </Link>
              </li>
              <li>
                <Link onClick={() => onClickEvent && onClickEvent()} href="/login">
                  Login
                </Link>
              </li>
              <li>
                <Link
                  onClick={() => onClickEvent && onClickEvent()}
                  href="/register"
                >
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </header>
  )
}

export default Navbar