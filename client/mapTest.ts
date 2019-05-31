import MapData from "./script/MapData";

export let initMap = ()=>{
  let cpnhgn = {lat: 55.6761, lng: 12.5683};
  let map = new google.maps.Map(
      document.getElementById('map'), {zoom: 6, center: cpnhgn});
    createMarkers(map, MapData);
}

// Given a created map and an array of coordinates, add markers to the map
let createMarkers = (map: google.maps.Map, data: {lat:number, lng:number}[])=>{
    data.forEach((location)=>{
        new google.maps.Marker({position: location, map:map});
    });
}

window["initMap"] = initMap;