//beginning by creating a base map object
//setting the center as Los Angeles and inserting into 'map' id in index.html

var myMap = L.map("map", {
    center: [34.0522, -118.2437],
    zoom: 5
});

//insert boilerplate code to display map from mapbox
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: "pk.eyJ1IjoiY2hpYW15YzA5ODciLCJhIjoiY2swdzUxb3I2MGRiMzNpbnliN293OXBteiJ9.at8rk5Trv5oNH1dD2E9EAw"
  }).addTo(myMap);

  //create path for usgs json
  var usgsURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

  //call json and set colors for the levels of magnitude 
  d3.json(usgsURL, function(data) {
    function styleInfo(feature) {
        return {
          opacity: 1,
          fillOpacity: 1,
          fillColor: getColor(feature.properties.mag),
          color: "#ffa07a",
          radius: getRadius(feature.properties.mag),
          stroke: true,
          weight: 0.5
        };
      }
      // set different color from magnitude
        function getColor(magnitude) {
        switch (true) {
        case magnitude > 5:
          return "#8b0000";
        case magnitude > 4:
          return "#ff0000";
        case magnitude > 3:
          return "#b22222";
        case magnitude > 2:
          return "#dc143c";
        case magnitude > 1:
          return "#e99667A";
        default:
          return "#ff8072";
        }
      }
      // set radius from magnitude
        function getRadius(magnitude) {
        if (magnitude === 0) {
          return 1;
        }
    
        return magnitude * 5;
      }
        // GeoJSON layer
        L.geoJson(data, {
          // create cricles
          pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
          },
          // style for the circles
          style: styleInfo,
          // popup for each marker
          onEachFeature: function(feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
          }
        }).addTo(myMap);
      
        // create a legend
        var legend = L.control({
          position: "bottomright"
        });
      
        // added details for the legend
        legend.onAdd = function() {
          var div = L.DomUtil.create("div", "info legend");
      
          var grades = [0, 1, 2, 3, 4, 5];
          var colors = [
            "#98ee00",
            "#d4ee00",
            "#eecc00",
            "#ee9c00",
            "#ea822c",
            "#ea2c2c"
          ];
      
          // Loop
          for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
              "<i style='background: " + colors[i] + "'></i> " +
              grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
          }
          return div;
        };
      
        // lastly, add to the map
        legend.addTo(myMap);
  });
