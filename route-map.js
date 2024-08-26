let map;

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");

  map = new Map(document.getElementById("map"), {
    //location of Hong Kong
    center: { lat: 22.324480290225303, lng: 114.1626473445726 },
    zoom: 12,
  });
  const cycTrackLayer = new google.maps.KmlLayer({
    url: "https://www.td.gov.hk/datagovhk_tis/cycling-information/CYCTRACK.kmz",
    map: map,
  });
}

initMap();

