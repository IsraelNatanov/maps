import { Feature } from "ol";
import { Point } from "ol/geom";
import Fill from "ol/style/Fill";
import Icon from "ol/style/Icon";
import Stroke from "ol/style/Stroke";
import Style from "ol/style/Style";

// Create a style function that applies the different styles based on a property value
export const styleFunction = (feature: { get: (arg0: string) => string }) => {
  if (feature.get("typeStyle") == "value2") {
    return styleUnique;
  } else {
    console.log(feature);

    return styleRegular;
  }
};

// Create two different styles
const styleRegular = new Style({
  image: new Icon({
    src: "src/images/icons8-map-64.png",
    anchor: [0.5, 1],
  }),
  stroke: new Stroke({
    color: "black",
    width: 3,
  }),
  fill: new Fill({
    color: "rgba(0, 0, 255, 0.1)",
  }),
});
const styleUnique = new Style({
  image: new Icon({
    src: "src/images/placeholder.png",
    anchor: [0.5, 1],
  }),
});

// Create style fot LineSring
export const styleLineString = function (feature: any) {
  const geometry = feature.getGeometry();
  const styles = [
    // linestring
    new Style({
      stroke: new Stroke({
        color: "#ffcc33",
        width: 3,
      }),
    }),
  ];

  geometry.forEachSegment(function (start: any, end: any) {
    const dx = end[0] - start[0];
    const dy = end[1] - start[1];
    const rotation = Math.atan2(dy, dx);
    // arrows
    styles.push(
      new Style({
        // style icon arrows
        geometry: new Point(end),
        image: new Icon({
          src: "src/images/right-arrow.png",
          anchor: [0.75, 0.5],
          rotateWithView: true,
          rotation: -rotation,
        }),
      })
    );
  });

  return styles;
};
