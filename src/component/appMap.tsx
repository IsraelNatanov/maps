import React, { useEffect, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import { get, fromLonLat } from "ol/proj";
import TileLayer from "ol/layer/Tile";
import Vector from "ol/layer/Vector";
import Point from "ol/geom/Point";
import OSM from "ol/source/OSM";
import Vectors from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import FullScreen from "ol/control/FullScreen";
import Select from "ol/interaction/Select";
import "ol/ol.css";
import { toLonLat } from "ol/proj";
import Draw from "ol/interaction/Draw";
import "./maps.css";
import axios from "axios";
import jgo from "../gho.json";
import dffg from "../dffg.json";
import Overlay from "ol/Overlay";
import MapBrowserEvent from "ol/MapBrowserEvent";
import Feature from "ol/Feature";
import { styleFunction, styleLineString } from "./function";
import SearchBtn from "./searchBtn";
import ButtonHeader from "./buttonHeader";
import { useQuery } from "react-query";
import Style from "ol/style/Style";
import Icon from "ol/style/Icon";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import SplitButton from "./splitButton";

const format = new GeoJSON({ featureProjection: "EPSG:3857" });

const featuresss = format.readFeatures(jgo);
type IProps = {
  use: boolean;
  setUse: React.Dispatch<React.SetStateAction<boolean>>;
};

const AppMap: React.FC = () => {
  const arrPoint: Number[] = [];
  const [viewSites, setViewSites] = useState(false);
  const [vieLineString, SetViewLineString] = useState(false);
  let [themMap, setThemMap]= useState(false)
  // let [map,setMap] = useState<null|Map>()
  let map = new Map()

  const extent: any = get("EPSG:3857")!.getExtent().slice();
  extent[0] += extent[0];
  extent[2] += extent[2];

  const source = new Vectors();
  const sourcee = new Vectors();

  const vector = new Vector({
    source: source,
    style: styleLineString,
  });
  let mapSource = new Vectors()

 
  // let map: Map | null = null;
  function vectorLoader() {
    axios
      .get("http://localhost:9000/geojson")
      .then((res) => {
        console.log(res.data);
        const features = format.readFeatures(res.data);
        mapSource.addFeatures(features);
      })
      .catch((error) => console.log(error));
  }

  let overlay: Overlay | null = null;

  // let map = new Map();
  let vectorLayer = new Vector()

  // const queryRefrechLayer = () => {
  //   useQuery("refrechLayer", refreachLayer, {
  //     enabled: false,
  //   });
  // };
  useEffect(() => {
 
    map = new Map({
      target: "map-container",
      view: new View({
        center: fromLonLat([34.84517762144668, 32.167921158434325]),
        zoom: 16,
      }),
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
         vector,
        // vectorLayer,
        // berlin
      ],
    });


    // const marker = new Vector({
    //   source: new Vectors({
    //     features,
    //   }),

    //   style: styleMarker,
    // });


    const tooltip: HTMLElement | null = document.getElementById("tooltip");
    const positioning = "bottom-left";

    overlay = new Overlay({
      element: tooltip!,
      offset: [10, 0],
      positioning: positioning,
    });

    map.on("click", function (event: any) {
      let point = map!.getCoordinateFromPixel(event.pixel);
      let lonLat = toLonLat(point);
      arrPoint.push(lonLat[0]);
      arrPoint.push(lonLat[1]);
      console.log(arrPoint[0], 0);
      console.log(arrPoint[1], 1);
      console.log(arrPoint[arrPoint.length - 2], 3);
      console.log(arrPoint[arrPoint.length - 1], 4);
    });

    // map.addLayer(vectorLayer)
    // map.addLayer(marker);

    map!.addOverlay(overlay);
    // setMap(map)

    const fullscreen = new FullScreen();
    map!.addControl(fullscreen);
    // setMap(map)

    function displayTooltip(evt: any) {
      const pixel = evt.pixel;

      const feature = map!.forEachFeatureAtPixel(
        pixel,
        function (feature: any) {
          return feature;
        }
      );
      tooltip!.style.display = feature ? "" : "none";
      if (feature) {
        overlay!.setPosition(evt.coordinate);

        tooltip!.innerHTML = feature.get("name");
      }
    }

    map.on("pointermove", displayTooltip);
  }, []);
  let draw: Draw | null = null;
  const clickButten = async () => {
    map!.removeOverlay(overlay!);

    const addInteraction = async () => {
      draw! = new Draw({
        source: source,
        type: "LineString",
      });
    };
    addInteraction();

    map!.addInteraction(draw!);
    const layers = map!.getLayers().getArray().length;
   
      console.log(layers);
      
    
  };
  const notClickButten = () => {
    // vector.getSource().clear(true);

    map!.removeInteraction(draw!);

    // map!.removeLayer(vector);
    map!.addOverlay(overlay!);
  };
  const sourceberlin = new Vectors({
    features: featuresss,
  });
  let berlin = new Vector({
    source: sourceberlin,
    style: styleFunction,
  });
  function clickViewSites() {
    // map?.addLayer(berlin);
    mapSource = new Vectors({
      format: new GeoJSON(),
      // url:"http://localhost:9000/geojson"
      loader: vectorLoader,
    });
    vectorLayer = new Vector({
      source: mapSource,
      style: styleFunction,
      // title: 'b_layer',
    });
    map!.addLayer(vectorLayer)
    // setViewSites(true);
    console.log("yes");
    const layers = map!.getLayers().getArray();
    if (layers.length > 0) {
      console.log(1);}

    
    setThemMap(true)
    // setMap(map)
  };
const newStyle = new Style({
  image: new Icon({
    src: "src/images/icon8-map-64.png",
    anchor: [0.5, 1],
  }),

})
  function removeMapLaye(){
  //  vectorLayer!.setStyle(newStyle)
    map!.removeLayer(vectorLayer)
    

    map!.getLayers().forEach((layer) => {
      console.log("eee");
      // map!.removeLayer(layer);
    });

    // setViewSites(false);
    // window.location.reload()
  };
  const ifViewLineString = async () => {
    if (!vieLineString) {
      await selectLineString();
      SetViewLineString(true);
      
    } else {
      await closeLineString();
      SetViewLineString(false);

    }
  };
  const selectLineString = async () => {
    map?.removeOverlay(overlay!);

    const addInteraction = () => {
      draw! = new Draw({
        source: source,
        type: "LineString",
      });
      console.log("dfdg");
    };
    addInteraction();

    map?.addInteraction(draw!);
  };
  const closeLineString = async () => {
  
    // vector.getSource().clear(true);

    map!.removeInteraction(draw!);

    // map!.removeLayer(vector);
    map!.addOverlay(overlay!);
  };
  
  function nameButton (){
    setViewSites(!viewSites)
    if (viewSites) {
      setViewSites(!viewSites)
      return 'מחק אתרים'
    }
    else{
      setViewSites(!viewSites)
     return 'הצג אתרים'
    }
  }

  return (
    <div className="map">
      <div
        style={{ height: "77vh", width: "100%" }}
        id="map-container"
        className="map-container"
      />
      <div id="tooltip" className="tooltip"></div>
      {/* <button style={{ width: "60px", height: "30px" }} onClick={clickButten}>
        אישור
      </button>
      <button
        style={{ width: "60px", height: "30px" }}
        onClick={notClickButten}
      >
        ביטול
      </button> */}

      <div className="searchEvent">
        
        
  
      <Stack direction="row" justifyContent={"center"} spacing={2}>
        
      <Button
        variant="outlined"
        sx={{ backgroundColor: "white", '&:hover': {
          backgroundColor: 'white',
        }, }}
        onClick={()=> {
          const layers = map!.getLayers().getArray();
   if (layers.length > 2) {
  
  

    console.log(layers)
    map!.removeLayer(vectorLayer)
    
          
    }
    else{
      
      mapSource = new Vectors({
        format: new GeoJSON(),
        // url:"http://localhost:9000/geojson"
        loader: vectorLoader!,
      });
      vectorLayer = new Vector({
    
        
        source: mapSource,
        style: styleFunction,
        
        // title: 'b_layer',
      })
    map!.addLayer(vectorLayer)
   
    // setViewSites('מחק אתרים')
    }

    } }

      >
      הצג אתרים
      </Button>
      <Button
        variant="outlined"
        sx={{ backgroundColor: "white", '&:hover': {
          backgroundColor: 'white',
        }, }}
        onClick={clickButten}
      >
      בחר מרחק
      </Button>


      <SplitButton />
    </Stack>
    </div>


    </div>
  );
};
export default AppMap;
