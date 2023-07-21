import React from 'react'

export default function TagsInput({tags, setTags}: {tags: string[], setTags:any}) {

    function handleKeyDown(e: any) {
        if (e.key !== 'Enter') return;
        const value: string = e.target.value;
        if (!value.trim()) return;
        setTags([...tags, value]);
        e.target.value = '';
    }
    
    function removeTag(index: any) {
        setTags(tags.filter((el: string, i: number) => i !== index));
    }

    return (
        <div className="tags-input-container">
            { tags.map((tag, index) => (
                <div className="tag-item" key={index}>
                <span className='text'> {tag} </span>
                <span className='close' onClick={() => removeTag(index)}> &times; </span>
            </div>
            ))}
            <input onKeyDown={handleKeyDown} type="text" className="tags-input" placeholder='Insert tag ' />
        </div>
    )
}