async function initMap() {
    const { Map } = await google.maps.importLibrary("maps");
  
    map = new Map(document.getElementById("map"), {
      center: { lat: 22.32574171900254, lng: 114.16718211578858 },
      zoom: 11,
    });
  }
  
  initMap();