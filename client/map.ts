import MapData from "./script/MapData";
import MapPathData from "./script/MapPathData"

let initMap = ()=>{
    let cpnhgn = {lat: 55.6761, lng: 12.5683};
    let map = new google.maps.Map(
      document.getElementById('map'), {zoom: 6, center: cpnhgn}
    );
    map.addListener("click", ()=>{centerMap(map, cpnhgn, 6)});
    
    createMarkers(map, MapData);
    createPathline(map, MapPathData);
}

// Given a created map and an array of coordinates, add markers to the map
let createMarkers = (map: google.maps.Map, data: {name: string, lat:number, lng:number,  desc: string}[])=>{
    let count = 1;
    data.forEach((location)=>{
        let marker = new google.maps.Marker({position: location, label: count.toString(), map:map});
        let infoWindow = new google.maps.InfoWindow({
            content: "<h2>"+ location.name + "</h2>"+"<p>" + location.desc + "</p>" 
        });
        marker.addListener("click", ()=>{
            infoWindow.open(map, marker);
        });
        map.addListener("click", ()=>{
            infoWindow.close();
        });
        marker.addListener("click", ()=>{
             markerInfo(marker);
             centerMapOnMarker(map, marker, 9);
        });
        count+=1;
    });
}

// Creating the travel path
let createPathline = (map: google.maps.Map, data: {lat:number, lng:number}[])=>{
    let travelPath = new google.maps.Polyline({
        path: data,
        strokeWeight: 5
    });
    travelPath.setMap(map);
}

// Gets the info from the marker and displays under map
let markerInfo = (marker: google.maps.Marker)=>{
    let info = MapData[parseInt(marker.getLabel() as unknown as string)-1];
    let targetDiv = document.getElementById("map-info-target");

    while(targetDiv.firstChild){
        targetDiv.removeChild(targetDiv.firstChild);
    }

    targetDiv.appendChild(elementCreator("h2",info.name));
}

// Centers the map on a given marker
let centerMapOnMarker = (map: google.maps.Map, marker: google.maps.Marker, zoomVal: number)=>{
    map.setCenter(marker.getPosition());
    map.setZoom(zoomVal);
}

let centerMap = (map: google.maps.Map, center: {lat: number, lng: number}, zoomVal: number)=>{
    map.setCenter(center);
    map.setZoom(zoomVal);
}

// Simple function for creating paragraphs
let elementCreator = (type: string, text: string):HTMLElement =>{
    let paragraph = document.createElement(type);
    let pText = document.createTextNode(text);
    paragraph.appendChild(pText);
    return paragraph;
}


window["initMap"] = initMap;