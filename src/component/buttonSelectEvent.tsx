import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField/TextField';
import React from 'react'

interface Iprops{
    playEvent: (index:number) => void;
    removEvent: ()=>void;
    dataFullFeatures: [];
}
export default function ButtonSelectEvent(props:Iprops) {
  return (
   <Autocomplete 
    
        disablePortal
        id='combo-box-demo'
        options={props.dataFullFeatures!}
        sx={{width:150, backgroundColor: 'white', color: 'blue'}}
        onChange={(event,value)=>{
            if(value == null){
                props.removEvent()
            }
            else{
                props.playEvent(value!["id"])
            }
        }}
        renderInput={(params) => <TextField {...params} placeholder="בחר אירוע"  color='primary'/>}  

   />


  )
}
