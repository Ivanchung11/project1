let map;

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");

  map = new Map(document.getElementById("map"), {
    //location of Hong Kong
    center: { lat: 22.324480290225303, lng: 114.1626473445726 },
    zoom: 12,
  });
  const ctaLayer = new google.maps.KmlLayer({
    url: "./CYCTRACK.kmz",
    map: map,
  });
}

initMap();

