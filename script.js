
var markers = [];
var followerMarkers = [];
var infrastructures = [];
var leaderMarkers = [];
var leaderPositions = [];
var followerPositions = [];
var infrastructurePositions = [];
var infrastructureMarkers = [];
var center;
var bounds;
var map;
var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
var isGrid = true;
initAutocomplete();

function initAutocomplete() {
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 0, lng: 0},
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

function clearFollowers() {
        for (var i = 0; i < followerMarkers.length; i++) {
          followerMarkers[i].setMap(null);
          followerMarkers[i] = 0;
        }
        followerMarkers.length = 0;

        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(null);
          //markers[i] = 0;
        }
        markers.length = 0;
      
      }

function followers() {
        clearMarkerPosition(markers,null);
        clearMarkerPosition(followerMarkers,followerPositions);
        clearMarkerPosition(leaderMarkers,leaderPositions);
              
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
              followerPositions[i] = point;

              var marker = new google.maps.Marker({
                //icon: 'https://github.com/scottdejonge/map-icons/blob/master/src/icons/male.svg',
                //icon: iconBase + 'man.png',
                icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
                animation: google.maps.Animation.DROP,
                position: point,
                //label: 'F',
                map: map,
                title: 'Grid Follower'
                });
                followerMarkers[i] = marker;
           marker.setMap(map);
        }
        
        //var infowindow = new google.maps.InfoWindow;
       
}

function formGrid(){
  //window.alert(infrastructures.length);
  window.alert(haversineDistance(bounds.getNorthEast(),bounds.getSouthWest()));
  if(isGrid){

      isGrid = false;
      
      var randNum = Math.ceil(getRandomArbitrary(1,10));

      var north = bounds.getNorthEast().lat();
      var south = bounds.getSouthWest().lat();
      var east = bounds.getNorthEast().lng();
      var west = bounds.getSouthWest().lng();
      for (var i = 0; i < randNum; i++){
        var nNorth = north - ((i / randNum) * (north - south));
        //north = nNorth ;
        var nSouth = south  - ((south - north ) * (randNum - 1 - i) / randNum);
        //south = nSouth;
        var nEast = east ;

        var nWest = west ;

        var rectangle = new google.maps.Rectangle({
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            map: map,
            bounds: {
              north: nNorth,
              south: nSouth,
              east: nEast,
              west: nWest
            }
            //bounds: bounds
          });
      }
      /*width = 0;
      height = 0;
      while (height <= south){
        var randNum = Math.ceil(getRandomArbitrary(1,10));

        var nNorth = north - ((randNum/10) * (north - south));
        //north = nNorth ;
        var nSouth = south  - ((south - north ) * (randNum - 1 - i) / randNum);
        //south = nSouth;
        var nEast = east ;

        var nWest = west ;

        var rectangle = new google.maps.Rectangle({
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            map: map,
            bounds: {
              north: nNorth,
              south: nSouth,
              east: nEast,
              west: nWest
            }
            //bounds: bounds
          });

      }*/
    } 
}
function haversineDistance(pos1, pos2){
    function toRad(x) {
    return x * Math.PI / 180;
    }

    var lat2 = pos2.lat(); 
    var lon2 = pos2.lng(); 
    var lat1 = pos1.lat(); 
    var lon1 = pos1.lng(); 

    var R = 6371; // km 
    
    var x1 = lat2-lat1;
    var dLat = toRad(x1);  
    var x2 = lon2-lon1;
    var dLon = toRad(x2);  
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
                    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
                    Math.sin(dLon/2) * Math.sin(dLon/2);  
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; 

    return d;
}
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function leaders(){
  clearMarkerPosition(leaderMarkers,leaderPositions);
  var gridP = document.getElementById("gridPercentage");
  var pOfLeaders = gridP.options[gridP.selectedIndex].value;
  var users = document.getElementById("noOfUsers");
  var noOfUsers = users.options[users.selectedIndex].value;

  //window.alert(gridP+','+users)
  var leaderCount = (pOfLeaders / 100) * noOfUsers;

  for (var i = 0; i < leaderCount; i++){
      var randNum = Math.ceil(getRandomArbitrary(0,noOfUsers-1));
      //leaderIndex.push(randNum);
      //window.alert(randNum);
      leaderPositions.push(followerPositions[randNum]);

      var marker = new google.maps.Marker({
            icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
            position: followerPositions[randNum],
            //animation: google.maps.Animation.DROP,
            map: map,
            title: 'Grid Leader'
        });
        
      leaderMarkers.push(marker);
      marker.setMap(map);

  }

}

function clearMarkerPosition(nMarkers, nPositions){
  for (var i = 0; i < nMarkers.length; i++){
    nMarkers[i].setMap(null);
  }
  nMarkers = [];
  nPositions = [];
}

function infrastructure(){
      clearMarkerPosition(infrastructureMarkers, infrastructurePositions);
      var users = document.getElementById("noOfUsers");
      var noOfUsers = users.options[users.selectedIndex].value;

      var maxCoverage = 2 //km
      var minCoverage = 3 //km

      var sw = bounds.getSouthWest();
      var ne = bounds.getNorthEast();

      for(var i = 1; i < noOfUsers/5; i++){
          var randNum = Math.ceil(getRandomArbitrary(0,noOfUsers));
          if (randNum%2==0){
              var ptLat = Math.random() * (ne.lat() - sw.lat()) + sw.lat();
              var ptLng = Math.random() * (ne.lng() - sw.lng()) + sw.lng();
              var point = new google.maps.LatLng(ptLat, ptLng);
              infrastructurePositions.push(point);
              //window.alert(point);
              //addMarker(point, 2);
              var marker = new google.maps.Marker({
                icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                position: point,
                animation: google.maps.Animation.DROP,
                map: map,
                title: 'Base station'
              });

              infrastructureMarkers.push(marker);
              marker.setMap(map);
          }
              
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