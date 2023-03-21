import axios from 'axios';
import './css/SearchBar.css';

function SearchBar () {
  const handleChange = e => {
    console.log(e.target.value);
    axios.get(`/api/user/search/${e.target.value}`).then(response => {
      console.log(response.data);
    }).catch(err => {
        console.log(err)
    })
  }
  return (
    <div id="searchbarContainer">
    <form className="browser-default right" id="searchbarform">
      <input id="search-input" placeholder="Search for users" type="text" className="browser-default search-field" onChange={e => handleChange(e)}/>
    </form>
    </div>
  )
}

export default SearchBar
