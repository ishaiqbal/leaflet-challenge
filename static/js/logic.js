
//MAPBOX API KEY 
var apiKey = "pk.eyJ1IjoiaXNoYWlxYmFsIiwiYSI6ImNrN21rZHl6OTAxYmMzbGs0M2ZtZXBodG0ifQ.BDjgoRuioDNjep_bN-R4dA";

var graymap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  id: "mapbox.streets",
  accessToken: apiKey
});


var map = L.map("mapid", {
  center: [
    40.7, -94.5
  ],
  zoom: 3
});


graymap.addTo(map);

// Ajax call 
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson", function(data) {


  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: EarthquakeColor(feature.properties.mag),
      radius: EarthquakeRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

  // color of the marker based on the magnitude of earthquake 
  function EarthquakeColor(magnitude) {
    if (magnitude < 1) {
      return "lightgreen"
    }
    else if (magnitude < 2) {
      return "yellowgreen"
    }
    else if (magnitude < 3) {
      return "gold"
    }
    else if (magnitude < 4) {
      return "orange"
    }
    else if (magnitude < 5) {
      return "orangered"
    }
    else {
      return "darkred"
    }
  }

  // radius of marker based on magnitude 
  function EarthquakeRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }

    return magnitude * 5;
  }

  L.geoJson(data, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: styleInfo,
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    }
  }).addTo(map);

  var legend = L.control({
    position: "bottomright"
  });

  //Legend Details
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");

    var grades = [0, 1, 2, 3, 4, 5];
    var colors = [
      "lightgreen",
      "yellowgreen",
      "gold",
      "orange",
      "orangered",
      "darkred"
    ];

    // Generating labels
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
        "<i style='background: " + colors[i] + "'></i> " +
        grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };

  legend.addTo(map);
});
