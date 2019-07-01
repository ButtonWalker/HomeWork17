// Store API link
var link = "static/dataset/all_month.geojson"

function markerSize(mag) {
  return mag * 25000;
}

function markerColor(mag) {
  if (mag <= 1) {
      return "#fed976";
  } else if (mag <= 2) {
      return "#feb24c";
  } else if (mag <= 3) {
      return "#fd8d3c";
  } else if (mag <= 4) {
      return "#fc4e2a";
  } else if (mag <= 5) {
      return "#e31a1c";
  } else {
      return "#b10026";
  };
}

// Perform a GET request to the query URL
d3.json(link, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  var earthquakes = L.geoJSON(earthquakeData, {
  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
 onEachFeature : function (feature, layer) {

    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "<p> Magnitude: " +  feature.properties.mag + "</p>")
    },     pointToLayer: function (feature, latlng) {
      return new L.circle(latlng,
        {radius: markerSize(feature.properties.mag),
        fillColor: markerColor(feature.properties.mag),
        fillOpacity: .8,
        stroke: false,
    })
  }
  });
    


  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define map layers
  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 30,
    id: "mapbox.dark",
    accessToken: API_KEY
  });


var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
  maxZoom: 30,
  id: "mapbox.light",
  accessToken: API_KEY
});


  // Define a baseMaps object
  var baseMaps = {
    "Dark Map": darkmap,       
    "Light Map": lightmap
  };

  // Create overlay object 
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the darkmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [31.57853542647338,-99.580078125],
    zoom: 3,
    layers: [darkmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function () {
  
      var div = L.DomUtil.create('div', 'info legend'),
          magnitudes = [0, 1, 2, 3, 4, 5];
  
      for (var i = 0; i < magnitudes.length; i++) {
          div.innerHTML +=
              '<i style="background:' + markerColor(magnitudes[i] + 1) + '"></i> ' + 
      + magnitudes[i] + (magnitudes[i + 1] ? ' - ' + magnitudes[i + 1] + '<br>' : ' + ');
      }
  
      return div;
  };
  
  legend.addTo(myMap);

}
