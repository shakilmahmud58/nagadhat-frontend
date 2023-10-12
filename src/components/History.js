import axios from "axios";
import { useEffect, useState } from "react";

function History(){
    const [keywords,setKeywords] = useState([]);
    const [texts, setTexts] = useState([]);
    const [cng, setCng] = useState(false);
    const [allhistory, setAllHistory] = useState([]);
    const [filteredhistory, setFilteredhistory] = useState([]);
    const [user1,setUser1]= useState(false);
    const [user2,setUser2]= useState(false);
    const [user3,setUser3]= useState(false);
    const [users, setUsers]= useState([user1, user2, user3]);
    const [yesterday,setYesterday]= useState(false);
    const [week,setWeek]= useState(false);
    const [month,setMonth]= useState(false);
    const [startdate,setStartdate]= useState('');
    const [enddate,setEnddate]= useState('');
    const changekeyword = (index)=>{
      keywords[index].value=!keywords[index].value;
      setCng(!cng);
      console.log(keywords);
    }
    //loading keywords that are searched by users

    useEffect(()=>{
        axios.get('http://localhost:8000/api/keyword')
        .then(res=>{
          setTexts(res.data)
         let keys = res.data.map((item,index)=>{
            return { 
              name: item.text,
              value:false
            }
          })
          setKeywords(keys);
         // console.log(keys);
        })
    },[])
    
    //loading the history of the given date, if starting or ending date is not given it will return all history
   
    useEffect(()=>{
      axios.post('http://localhost:8000/api/show',{startdate,enddate})
      .then(res=>{
          //console.log(res.data);
          setAllHistory(res.data);
          setFilteredhistory(res.data);
      })
    },[startdate,enddate])

    //filtering the history according to user and keyword that are selected

    useEffect(()=>{
      let new_filtered_array=[];
      let new_keyword_array = [];

      if(!user1 && !user2 && !user3)
      {
        new_filtered_array=allhistory;
      }
      else
      {
        users.map((item,index)=>{
           if(item)
           {
            const newarray= allhistory.filter(item=>{
              return item.user == 'user'+(index+1);
            })
            new_filtered_array= new_filtered_array.concat(newarray)
            //console.log(newarray)
           }
        })
      }
      let count =0;
      {
        keywords.map((item,index)=>{
        if(item.value){
          const newarray = new_filtered_array.filter((result)=>{
            return result.text==item.name
          })
          new_keyword_array=new_keyword_array.concat(newarray);
        }
        else
        {
          count++;
        }
        if(keywords.length==count)
        {
          //console.log('ok');
          new_keyword_array=new_filtered_array;
        }
      }
      
        )
      }
      setFilteredhistory(new_keyword_array);
    },[user1, user2, user3,cng,yesterday])

    return (
        <div className="container">
          <div className="row my-4">
          <div className="col-3 border border-1 p-3">
          <div>
            <h5>All Keywords</h5>
            {texts.map((item,index)=>
                  <div key={index} className=" my-1">
                        <input className="form-check-input" type="checkbox" id={item.text} name={item.text} value={item.text} onChange={()=>{changekeyword(index)}}/>
                        <label htmlFor={item.text}>{item.text}({item.count})</label>
                  </div>
            )}
          </div>
          <div>
              <h5>All Users</h5>
              <div className=" my-1">
                <input className="form-check-input" type="checkbox" id="user1" name="user1" value="user1" checked={user1} onChange={()=>{setUser1(!user1); setUsers([!user1, user2,user3])}}/>
                 <label htmlFor="user1">User 1</label>
              </div>
              <div className=" my-1">
                 <input className="form-check-input" type="checkbox" id="user2" name="user2" value="user2" checked={user2} onChange={()=>{setUser2(!user2);setUsers([user1, !user2,user3])}}/>
                 <label htmlFor="user2">User 2</label>
              </div>
              <div className=" my-1">
                 <input className="form-check-input" type="checkbox" id="user3" name="user3" value="user3" checked={user3} onChange={()=>{setUser3(!user3);setUsers([user1, user2, !user3])}}/>
                 <label htmlFor="user3">User 3</label>
              </div>
          </div>
          <div>
              <div className="my-1">
                 <label htmlFor="start_date">Starting Date</label>
                 <input type="date" id="start_date" name="start_date" value={startdate} onChange={(e)=>{setStartdate(e.target.value)}}/>
              </div>
              <div className="my-1">
                 <label htmlFor="end_date">Ending Date</label>
                 <input type="date" id="end_date" name="end_date" value={enddate} onChange={(e)=>{setEnddate(e.target.value)}}/>
              </div>
              <div>If starting or ending date is not given it will return all history</div>
          </div>
          </div>
           <div className="col-6">
            <div className="container">
              <div className="row border-bottom my-1">
                <div className="col fw-bolder">Text</div>
                <div className="col fw-bolder">User</div>
                <div className="col fw-bolder">Results</div>
                <div className="col fw-bolder">Date</div>
              </div>
              { filteredhistory.map(item=>
                 <div className="row border-bottom" key={item.id}>
                 <div className="col">{item.text}</div>
                 <div className="col">{item.user}</div>
                 <div className="col">
                  {item.results.length?
                     item.results.map((result,index)=>
                     <span key={index}>{result} </span>):"no results"
                  }
                 </div>
                 <div className="col">
                  {new Date(item.created_at).getDate()}/{new Date(item.created_at).getMonth()}/{new Date(item.created_at).getFullYear()}
                  </div>
               </div>)
              }
           </div>
           </div>
        </div>
     </div>
    )
}
export default History;