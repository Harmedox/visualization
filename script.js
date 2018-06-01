document.addEventListener('DOMContentLoaded', function () {
  if (document.querySelectorAll('#map').length > 0)
  {
    if (document.querySelector('html').lang)
      lang = document.querySelector('html').lang;
    else
      lang = 'en';

    var js_file = document.createElement('script');
    js_file.type = 'text/javascript';
    js_file.src = 'https://maps.googleapis.com/maps/api/js?callback=initMap&signed_in=true&language=' + lang;
    document.getElementsByTagName('head')[0].appendChild(js_file);
  }

});

var centerPoint = {lat: 52.507, lng: 13.405};

var gridFollowers = [
        {lat: 52.511, lng: 13.447},
        {lat: 52.549, lng: 13.422},
        {lat: 52.497, lng: 13.396},
        {lat: 52.517, lng: 13.394}
      ];

var gridLeaders = [
        {lat: 52.497, lng: 13.396}
];


var markers = [];
var map;
var noOfUsers;
var gridPer;

function initMap() {
        var map = new google.maps.Map(document.getElementById('map'), {
          center: centerPoint,
          zoom: 13
        });

        var input = document.getElementById('pac-input');

        var autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.bindTo('bounds', map);

        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        var infowindow = new google.maps.InfoWindow();
        var infowindowContent = document.getElementById('infowindow-content');
        infowindow.setContent(infowindowContent);
        var marker = new google.maps.Marker({
          map: map
        });
        marker.addListener('click', function() {
          infowindow.open(map, marker);
        });

        autocomplete.addListener('place_changed', function() {
          infowindow.close();
          var place = autocomplete.getPlace();
          if (!place.geometry) {
            return;
          }

          if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
          } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);
          }

          // Set the position of the marker using the place ID and location.
          marker.setPlace({
            placeId: place.place_id,
            location: place.geometry.location
          });
          marker.setVisible(true);

          infowindowContent.children['place-name'].textContent = place.name;
          infowindowContent.children['place-id'].textContent = place.place_id;
          infowindowContent.children['place-address'].textContent =
              place.formatted_address;
          infowindow.open(map, marker);
        });
      }

function followers() {
        var users = document.getElementById("noOfUsers");
        window.alert(users);
        noOfUsers = users.options[users.selectedIndex].value;

        clearMarkers();
        populateUsers(noOfUsers);
        for (var i = 0; i < gridFollowers.length; i++) {
          addMarkerForFollower(gridFollowers[i], i * 200);
        }
}

function populateUsers(noOfUsers){
    for (var i=0; i<noOfUsers; i++) {
        gridFollowers.push();
    }
}

function randomGeo(center, radius) {
    var y0 = center.lat;
    var x0 = center.lng;
    var rd = radius / 111300; //about 111300 meters in one degree

    var u = Math.random();
    var v = Math.random();

    var w = rd * Math.sqrt(u);
    var t = 2 * Math.PI * v;
    var x = w * Math.cos(t);
    var y = w * Math.sin(t);

    //Adjust the x-coordinate for the shrinking of the east-west distances
    var xp = x / Math.cos(y0);

    var newlat = y + y0;
    var newlon = x + x0;
    //var newlon2 = xp + x0;

    return {
        lat: newlat,
        lng: newlon       
    };
}

function leaders() {
        //clearMarkers();
        for (var i = 0; i < gridLeaders.length; i++) {
          addMarkerForLeader(gridLeaders[i], i * 200);
        }
        var users = document.getElementById("noOfUsers");
        noOfUsers = users.options[users.selectedIndex].value;
        var gPercent = document.getElementById("gridPercentage");
        gridPer = gPercent.options[gPercent.selectedIndex].value;
        window.alert(JSON.stringify(randomGeo(map.center,10)));
}

function addMarkerForFollower(position, timeout) {
        window.setTimeout(function() {

          markers.push(new google.maps.Marker({
            icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
            position: position,
            map: map,
            animation: google.maps.Animation.DROP
          }));
        }, timeout);
      }

function addMarkerForLeader(position, timeout) {
        window.setTimeout(function() {

          markers.push(new google.maps.Marker({
            icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
            position: position,
            map: map,
            animation: google.maps.Animation.DROP
          }));
        }, timeout);
      }

function clearMarkers() {
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(null);
        }
        markers = [];
      }

