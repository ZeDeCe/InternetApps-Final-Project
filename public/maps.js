let map, 
    infoWindow,
    geocoder;

let branches;

let result_element_id = "map-click-result";

async function setBranches() {
  try {
      const response = await fetch('/about/branches');
      branches = await response.json();
    }  catch (error) {
      console.error('Error fetching dictionary:', error);
    }

    
  for (var i=0; i<branches.length; i++){
    addPoint(branches[i].location, 
            createPointContent(branches[i]));
  }

} 

async function createUserMark(location){
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  const userTag = document.createElement("div");

  userTag.className = "maps-user-tag";
  userTag.textContent = "You";

  const marker = new AdvancedMarkerElement({
    map,
    position: location,
    content: userTag,
    zIndex: 1
  });

  return;
}

function CenterCurrentLocation(){
  infoWindow = new google.maps.InfoWindow();
  geocoder = new google.maps.Geocoder();

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        map.setCenter(pos);
        createUserMark(pos);
      },
      () => {
        handleLocationError(true, infoWindow, map.getCenter());
      },
    );
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 11,
    disableDefaultUI: true,
    zoomControl: true,
    scaleControl: true,
    mapId: "4504f8b37365c3d0",
  });
  
  CenterCurrentLocation();
  await setBranches();  

}

function setBranchBlock(content) {
  let element = document.getElementById(result_element_id);
  element.innerHTML = content.innerHTML;
}

function addPoint(location, content) {
  const marker = new google.maps.marker.AdvancedMarkerElement({
    map,
    position:location
  });

  marker.addListener("click", () => {
    setBranchBlock(content);
  });

}

function createPointContent(branch) {
  var content = document.createElement("div");

  content.innerHTML = `
  <div class="row">
  <h2>${branch.name}</h2>
</div>
<div class="row">
  <h4>
      <b>Call US</b>
  </h4>
  <h5>
      ${branch.phone}
  </h5>
</div>

<div class="row">
  <h4>
      <b>Address</b>
  </h4>
  <h5>
      ${branch.location.address} 
  </h5>
</div>        
  `

  return content;
}

function AddressToLocation(address) {

  const request = { address: address };

  return geocoder.geocode(request).then((result) => {
      const { results } = result;
      
      const response = JSON.parse(JSON.stringify(results, null, 2));
      const location = {
        lat: response[0]['geometry']['location']['lat'],
        lng: response[0]['geometry']['location']['lng']
        }
      

      return location;
    })
    .catch((e) => {
      alert("Geocode was not successful for the following reason: " + e);
    });
}

window.initMap = initMap;

export {
    initMap,
    result_element_id
}

