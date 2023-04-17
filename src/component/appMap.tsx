import React, { useEffect, useState } from "react";
import "./maps.css";
import Map from "ol/Map";
import View from "ol/View";
import { get, fromLonLat, toLonLat } from "ol/proj";
import TileLayer from "ol/layer/Tile";
import Vector from "ol/layer/Vector";
import OSM from "ol/source/OSM";
import Vectors from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import FullScreen from "ol/control/FullScreen";
import Select from "ol/interaction/Select";
import "ol/ol.css";
import {Draw, Modify, Snap} from 'ol/interaction';
import axios from "axios";
import jgo from "../gho.json";
import fullJson from "../fullJson.json";
import Overlay from "ol/Overlay";
import { styleFunction, styleLineString } from "./function";
import CircularProgress from "@mui/material/CircularProgress";
import { Options } from "ol/interaction/Draw";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import SplitButton from "./splitButton";
import { Type } from "ol/geom/Geometry";
import SelectInteraction from "./selectInteraction";

const format = new GeoJSON({ featureProjection: "EPSG:3857" });

const featuresss = format.readFeatures(jgo);
const featureFullJson = format.readFeatures(fullJson);
type IProps = {
  use: boolean;
  setUse: React.Dispatch<React.SetStateAction<boolean>>;
};

const AppMap: React.FC = () => {
  const arrPoint: Number[] = [];
  const [viewSites, setViewSites] = useState(false);
  const [tooltip, setTooltip] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [valueType, setValueType] = useState<Options["type"] | String>();


  let map = new Map();

  const extent: any = get("EPSG:3857")!.getExtent().slice();
  extent[0] += extent[0];
  extent[2] += extent[2];

  const source = new Vectors();
  const sourceUse = new Vectors({ wrapX: false });
  let vectorUse = new Vector({
    source: sourceUse,
    style: {
      'fill-color': 'rgba(255, 255, 255, 0.2)',
      'stroke-color': '#ffcc33',
      'stroke-width': 2,
      'circle-radius': 7,
      'circle-fill-color': '#ffcc33',
    },
  });
  const sourcee = new Vectors();

  const vector = new Vector({
    source: source,
    style: styleLineString,
  });
  let mapSource = new Vectors();


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


  let vectorLayer = new Vector();

  // const queryRefrechLayer = () => {
  //   useQuery("refrechLayer", refreachLayer, {
  //     enabled: false,
  //   });
  // };

const modify = new Modify({source: sourceUse});
  useEffect(() => {
    map = new Map({
      target: "map-container",
      view: new View({
        center: fromLonLat([34.84517762144668, 32.167921158434325]),
        zoom: 16,
        extent
      }),
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vector,
        vectorUse,
    
      ],
    });



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



    map!.addOverlay(overlay);

    const fullscreen = new FullScreen();
    map!.addControl(fullscreen);

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
    map.addInteraction(modify);
   
      console.log(map.getLayers().getArray()[1])
 

    // drawUse!.on('drawstart', function(e) {
    //   map.getLayers().getArray()[1]
    // });

    // map.on("pointermove", handleMouseMove);
  }, []);
  const typeSelect: HTMLElement | null = document.getElementById("type");

  let draw: Draw | null = null;
  let drawUse : Draw | null = null; 
  let snap : Snap | null = null; 
  // global so we can remove it later
  function addInteractionUse(e: string) {
    
    if (e !== "None") {
      console.log(e);

      drawUse = new Draw({
        source: sourceUse,
        type: e as Type,
      });
    
      map!.removeOverlay(overlay!);
      map.addInteraction(drawUse);
      snap = new Snap({source: sourceUse});
      map.addInteraction(snap);
      drawUse!.on('drawend', function(event) {
        var polygonFeature = event.feature;
        vectorLayer.getSource()?.addFeature(polygonFeature);
        polygonFeatures.push(polygonFeature);
      });
    } else {
      map!.addOverlay(overlay!);
    }

   
  
  }
  var polygonFeatures = [];


  /**
   * Handle change event.
   */

  const selectTypeValue = (e: string) => {
    map.removeInteraction(drawUse!);
    map.removeInteraction(snap!);
    addInteractionUse(e);


  };


  const undoClick = () => {
  
    drawUse!.on('drawend', function(event) {
      var polygonFeature = event.feature;
      vectorUse.getSource()!.addFeature(polygonFeature);
      polygonFeatures.push(polygonFeature);
    });
      console.log(map.getLayers().getArray()[2])
    console.log(map,"map");
    console.log(drawUse,"drawUse");
    map.removeInteraction(drawUse!);
    map!.addOverlay(overlay!);
    console.log(map,"map");
    console.log(map,"drawUse");

  
    

  };


  
  const selectLineString = async () => {
    let layers = map!.getInteractions().getArray().length;
    if (layers == 9) {
      console.log(map);
      map!.removeOverlay(overlay!);

      const addInteraction = async () => {
        draw! = new Draw({
          source: source,
          type: "LineString",
        });
      };
      addInteraction();

      map!.addInteraction(draw!);
    } else {
      vector.getSource()!.clear(true);
      map!.removeInteraction(draw!);

      // map!.removeLayer(vector);
      map!.addOverlay(overlay!);
    }
  };

  const playEvent = (index: number) => {
    if (index == 0) {
      map!.removeLayer(berlin);
      map!.removeLayer(fuul);
    }
    if (index == 1) {
      map!.addLayer(berlin);
      map!.removeLayer(fuul);
    }
    if (index == 2) {
      map!.addLayer(fuul);
      map!.removeLayer(berlin);
    }
  };

  const sourceberlin = new Vectors({
    features: featuresss,
  });
  const featFullJson = new Vectors({
    features: featureFullJson,
  });
  let berlin = new Vector({
    source: sourceberlin,
    style: styleFunction,
  });
  let fuul = new Vector({
    source: featFullJson,
    style: styleFunction,
  });



  return (
    <div className="map">
      <div
        style={{ height: "77vh", width: "100%" }}
        id="map-container"
        className="map-container"
      />

      <div id="tooltip" className="tooltip"></div>

  

      <div className="navButton">
        <Stack direction="row" justifyContent={"center"} spacing={2}>

          <SelectInteraction selectTypeValue={selectTypeValue} undoClick={undoClick}/>
         
          {loading ? (
            <CircularProgress />
          ) : (
            <Button
              variant="outlined"
              sx={{
                backgroundColor: "white",
                "&:hover": {
                  backgroundColor: "white",
                },
              }}
              onClick={() => {
                const layers = map!.getLayers().getArray();
                if (layers.includes(vectorLayer)) {
                  console.log(layers);
                  map!.removeLayer(vectorLayer);
                } else {
                  setLoading(true);

                  mapSource = new Vectors({
                    format: new GeoJSON(),
                    // url:"http://localhost:9000/geojson"
                    loader: vectorLoader!,
                  });
                  vectorLayer = new Vector({
                    source: mapSource,
                    style: styleFunction,

                    // title: 'b_layer',
                  });
                  map!.addLayer(vectorLayer);
                  setLoading(false);

                 
                }
              }}
            >
              הצג/מחק אתרים
            </Button>
          )}
          <Button
            variant="outlined"
            sx={{
              backgroundColor: "white",
              "&:hover": {
                backgroundColor: "white",
              },
            }}
            onClick={selectLineString}
          >
            בחר/מחק מרחק
          </Button>

          <SplitButton playEvent={playEvent} />
        </Stack>
      </div>
    </div>
  );
};
export default AppMap;
