import { useEffect, useState } from 'react'
import { Dropdown } from 'react-bootstrap'
import { containsSubstring } from '../../src/utils'
import SearchInput from './SearchInput'

export default function SearchTagInput({searchTagInput, setSearchTagInput, tagList} : {searchTagInput : string[], setSearchTagInput : any, tagList : string[]}) {

  const [isDropdownSelected, setIsDropdownSelected] = useState<boolean>(false)
  const [searchInput, setSearchInput] = useState<string>('')

  return (
    <Dropdown className = "mb-3" autoClose="outside" onToggle = {(nextShow, meta) => setIsDropdownSelected(nextShow)} >
      <Dropdown.Toggle className = {`questionBank_searchTagButton noCaret ${isDropdownSelected && "quaternary-toggle"}`} id="dropdown-basic">
        <p className = "h3-text font-semibold">Filters</p>
        <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M17.919 8.18H6.079c-.96 0-1.44 1.16-.76 1.84l5.18 5.18c.83.83 2.18.83 3.01 0l1.97-1.97 3.21-3.21c.67-.68.19-1.84-.77-1.84z"
            fill="#6D1CFF"
          />
        </svg>        
      </Dropdown.Toggle>

      <Dropdown.Menu className = "questionBank_dropdown_menu ">
      <SearchInput searchInput={searchInput} setSearchInput={setSearchInput} />
          {tagList.map((tagItem : string, index) =>
              containsSubstring(tagItem, searchInput) && <FilterDropdownItem tagItem = {tagItem} searchTagInput = {searchTagInput} setSearchTagInput = {setSearchTagInput} key = {index}/>
          )}
        
      </Dropdown.Menu>
    </Dropdown>
  )
}

export function FilterDropdownItem ({tagItem, searchTagInput, setSearchTagInput}: {tagItem : string, searchTagInput : string[], setSearchTagInput : any}){

  const [isChecked, setIsChecked] = useState<boolean>(searchTagInput.includes(tagItem))

  useEffect(() => {
    isChecked? !searchTagInput.includes(tagItem) && setSearchTagInput([...searchTagInput, tagItem]) : setSearchTagInput(searchTagInput.filter(value => value !== tagItem));
  },[isChecked])

  return(
    <Dropdown.Item key = {tagItem} 
      onClick ={() => {setIsChecked(prevState => !prevState)}} 
      className = {`hover-secondary color_secondary questionBank_dropdown_item text-xs ${searchTagInput.includes(tagItem) && "questionBank_dropdown_item_selected"}`}
    >
      <CustomCheckBox isChecked = {isChecked}/> {tagItem}
    </Dropdown.Item>
  )
}


export function CustomCheckBox({isChecked} : {isChecked : boolean}) {
  if(isChecked)
  return (
    <svg width={20} height={21} fill="none" xmlns="http://www.w3.org/2000/svg">
      <mask id="prefix__a" fill="#fff">
        <path d="M2 6.5a4 4 0 014-4h8a4 4 0 014 4v8a4 4 0 01-4 4H6a4 4 0 01-4-4v-8z" />
      </mask>
      <path d="M2 6.5a4 4 0 014-4h8a4 4 0 014 4v8a4 4 0 01-4 4H6a4 4 0 01-4-4v-8z" fill="#6D1CFF"/>
      <path
        d="M9.159 14.303c.349 0 .612-.134.79-.401l3.863-5.82c.064-.095.111-.189.142-.28A.883.883 0 0014 7.528a.778.778 0 00-.251-.594.845.845 0 00-.61-.238.848.848 0 00-.428.1.987.987 0 00-.326.335l-3.243 5.092-1.623-1.946a.837.837 0 00-.661-.305.841.841 0 00-.615.238.804.804 0 00-.243.599c0 .108.017.212.05.31a.958.958 0 00.197.296l2.155 2.54c.198.232.45.347.757.347z"
        fill="#fff"
      />
      <path
        d="M1 6.5a5 5 0 015-5h8a5 5 0 015 5h-2a3 3 0 00-3-3H6a3 3 0 00-3 3H1zm18 9a5 5 0 01-5 5H6a5 5 0 01-5-5l2-1c0 1.105 1.343 2 3 2h8c1.657 0 3-.895 3-2l2 1zm-13 5a5 5 0 01-5-5v-9a5 5 0 015-5v2a3 3 0 00-3 3v8c0 1.105 1.343 2 3 2v4zm8-19a5 5 0 015 5v9a5 5 0 01-5 5v-4c1.657 0 3-.895 3-2v-8a3 3 0 00-3-3v-2z"
        fill="#41168F"
        mask="url(#prefix__a)"
      />
    </svg>
  );

  return(
    <svg width={20} height={21} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M1 6.5a5 5 0 015-5h8a5 5 0 015 5h-2a3 3 0 00-3-3H6a3 3 0 00-3 3H1zm18 9a5 5 0 01-5 5H6a5 5 0 01-5-5l2-1c0 1.105 1.343 2 3 2h8c1.657 0 3-.895 3-2l2 1zm-13 5a5 5 0 01-5-5v-9a5 5 0 015-5v2a3 3 0 00-3 3v8c0 1.105 1.343 2 3 2v4zm8-19a5 5 0 015 5v9a5 5 0 01-5 5v-4c1.657 0 3-.895 3-2v-8a3 3 0 00-3-3v-2z"
      fill="#6D1CFF"
      mask="url(#prefix__path-1-inside-1_120_109)"
    />
  </svg>
  )
}
