import { Spinner } from "react-bootstrap"

export default function LoadingPage() {

  return (
    <div>
      <div className = "loadingPage">
        <h2>Loading...</h2>
        <Spinner animation="border" variant="quizard-violet" />
      </div>
    </div>
    
  )
}