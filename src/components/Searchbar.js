import axios from "axios";
import { useState } from "react";
import History from "./History";

function Searchbar(){
    const [text, setText] = useState('');
    const [user, setUser] = useState('user1');
    const [results,setResults]=useState([]);
    const search=(e)=>{
        e.preventDefault();
        axios.post('http://localhost:8000/api/search',{text,user})
        .then(res=>{
            //console.log(res.data);
            setResults(res.data);
        })
    }
    return (
    <div>
        <div className="container my-4">
         <h2 className="my-2">Press the submit button to see the results.</h2>
         <form onSubmit={search}>
          <input type="text" className="form-control my-1" placeholder="Search..." onChange={(e)=>{setText(e.target.value)}}/>
          <select className="form-control my-1" value={user} onChange={(e)=>{setUser(e.target.value)}}>
            <option value="user1">User1</option>
            <option value="user2">User2</option>
            <option value="user3">User3</option>
          </select>
          <button type="submit" className="btn btn-primary">Search</button>
         </form>
         {
          results.length?
         <div>
          {results.map((item,index)=><div key={index}>{item}</div>)}
         </div>
          :"No results found"
         }
        </div>
       <hr></hr>
       <div>
        <History/>
       </div>
    </div>
    )
}

export default Searchbar;