import React from 'react'

function TitleInput({title, setTitle} : {title : string, setTitle : React.Dispatch<React.SetStateAction<string>>}) {
  return (
    <div className="topic_form">
        <label htmlFor="title"> Topic Title </label>
        <input type="text" maxLength={60} value={title} onChange={(event) => setTitle(event.target.value)} 
        className={title.length >= 60 ? "title_error" : ""}/>
        {title.length >= 60 && <h6> Minimum 60 characters </h6>}
    </div>
  )
}

export default TitleInput