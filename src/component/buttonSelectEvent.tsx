// import React, { useEffect, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField/TextField";
import axios from "axios";
import { Feature } from "ol";
import React, { useState } from 'react';
import { Features } from "../store/features/typeOfSlice";
import { useAppSelector } from "../store/hooks";

// const [dataFullFeatures, setDataFullFeatures] =  React.useState([]);

interface Iprops {
  playEvent: (index: number, data:Features) => void;
  removEvent: () => void;
 
}
export default function ButtonSelectEvent(props: Iprops) {

    const featuresOfStore = useAppSelector((state) => state.feature.features);
    console.log(featuresOfStore);
//   const getApi = async () => {
//     const res = await axios.get("http://localhost:9000/fullFeatures");
//     console.log(res.data);
//     setDataFullFeatures(res.data);
//   };

//   React.useEffect(() => {
//     getApi();
//   }, []);

  return (
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={featuresOfStore}
      sx={{ width: 150, backgroundColor: "white", color: "blue" }}
      onChange={async (event, value) => {
        if (value == null) {
          props.removEvent();
        } else { 
            const data = featuresOfStore[value.id-1]
          props.playEvent(value.id,  data);
        }
      }}
      renderInput={(params) => (
        <TextField {...params} placeholder="בחר אירוע" color="primary" />
      )}
    />
  );
}
