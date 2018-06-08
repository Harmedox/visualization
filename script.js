
var markers = [];
var center;
var bounds;
var map;

initAutocomplete();

function initAutocomplete() {
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: -33.8688, lng: 151.2195},
          zoom: 6,
          mapTypeId: 'roadmap'
        });

        // Create the search box and link it to the UI element.
        var input = document.getElementById('pac-input');
        var searchBox = new google.maps.places.SearchBox(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        // Bias the SearchBox results towards current map's viewport.
        map.addListener('bounds_changed', function() {
          searchBox.setBounds(map.getBounds());
        });

        
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function() {
          var places = searchBox.getPlaces();

          if (places.length == 0) {
            return;
          }

          // Clear out the old markers.
          markers.forEach(function(marker) {
            marker.setMap(null);
          });
          markers = [];

          // For each place, get the icon, name and location.
          bounds = new google.maps.LatLngBounds();
          places.forEach(function(place) {
            if (!place.geometry) {
              console.log("Returned place contains no geometry");
              return;
            }
            var icon = {
              url: place.icon,
              size: new google.maps.Size(71, 71),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(17, 34),
              scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
              map: map,
              icon: icon,
              title: place.name,
              position: place.geometry.location
            }));

            center = map.getCenter();
            if (place.geometry.viewport) {
              // Only geocodes have viewport.
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
          });
          map.fitBounds(bounds);
        });
      }

function clearMarkers() {
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(null);
        }
        markers = [];
      }


function createMarker(map, point, content) {
  var marker = new google.maps.Marker({
    position: point,
    map: map
  });
  google.maps.event.addListener(marker, "click", function(evt) {
    infowindow.setContent(content + "<br>" + marker.getPosition().toUrlValue(6));
    infowindow.open(map, marker);
  });
  return marker;
}
function followers() {
        clearMarkers();
        var users = document.getElementById("noOfUsers");
        var noOfUsers = users.options[users.selectedIndex].value;
        
        var sw = bounds.getSouthWest();
        var ne = bounds.getNorthEast();
        
        //map.fitBounds(bounds)

        //var markers = [];
        for(var i = 0; i < noOfUsers; i++){
              var ptLat = Math.random() * (ne.lat() - sw.lat()) + sw.lat();
              var ptLng = Math.random() * (ne.lng() - sw.lng()) + sw.lng();
              var point = new google.maps.LatLng(ptLat, ptLng);
              //window.alert(point);
              //addMarker(point, 2);
              markers[i] = point;
        }
        
        //var infowindow = new google.maps.InfoWindow;

        for (var i = 0; i < markers.length; i++) { 
            //window.alert(markers[i]); 
            var marker = new google.maps.Marker({
                 position: markers[i],
                 map: map
            });

            marker.setMap(map);
        }
        //window.alert(markers.length);
       
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function leaders(){
  var gridP = document.getElementById("gridPercentage");
  var pOfLeaders = gridP.options[gridP.selectedIndex].value;
  var users = document.getElementById("noOfUsers");
  var noOfUsers = users.options[users.selectedIndex].value;

  //window.alert(gridP+','+users)
  var leaderCount = (pOfLeaders / 100) * noOfUsers;

  for (var i = 0; i < leaderCount; i++){
      var randNum = Math.ceil(getRandomArbitrary(0,noOfUsers-1));

      //window.alert(randNum);

      var marker = new google.maps.Marker({
            icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
            position: markers[randNum],
            map: map
        });

      marker.setMap(map);

  }

}


function addMarker(position, timeout){
  //window.alert(position);
  var marker = new google.maps.Marker({
          position: position,
          map: map
        });

  window.alert(marker+'');

  var infowindow = new google.maps.InfoWindow({
          content: '<p>Marker Location:' + marker.getPosition() + '</p>'
        });

        google.maps.event.addListener(marker, 'click', function() {
          infowindow.open(map, marker);
        });
}

google.maps.event.addDomListener(window, 'load', initialize);