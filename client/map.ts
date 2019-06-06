import MapPathData from "./script/MapPathData";
import Data from "./script/Data";

let blogPostJson;

let initMap = ()=>{
    let cpnhgn = {lat: 55.6761, lng: 12.5683};
    let map = new google.maps.Map(
      document.getElementById('map'), {zoom: 6, center: cpnhgn}
    );
    map.addListener("click", ()=>{centerMap(map, cpnhgn, 6)});
    map.addListener("click", ()=>{resetMarkerInfo()});

    fetch("/mapdata.json")
    .then((res)=>{
        return res.json();
    })
    .then((json)=>{
        createMarkers(map, json);
    });

    fetch("/posts.json")
    .then((res)=>{
        return res.json();
    })
    .then((json)=>{
        blogPostJson = json;
    });
    
}

// Given a created map and an array of coordinates, add markers to the map
let createMarkers = (map: google.maps.Map, data: {name: string, lat, lng, desc: string}[])=>{
    let count = 1;
    data.forEach((location)=>{
        location.lat = parseFloat(location.lat);
        location.lng = parseFloat(location.lng);

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
             markerInfo(marker, data);
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
let markerInfo = (marker: google.maps.Marker,data: {name: string, lat: string, lng: string, desc: string}[])=>{
    let info = data[parseInt(marker.getLabel() as unknown as string)-1];
    let targetDiv = document.getElementById("map-info-target");

    resetMarkerInfo();

    targetDiv.appendChild(elementCreator("h2",info.name));
    let gallery = document.createElement("ul");
    gallery.className = "gallery__master";
    Data.forEach((image)=>{
        if(image.city===info.name.toLowerCase()){
            let thumb = document.createElement("li");
            thumb.className = "gallery__thumb";
            let wrapper = document.createElement("div");
            wrapper.className = "gallery__thumb-img-wrap";
            let newImage = document.createElement("img");
            newImage.className="gallery__thumb-img";
            newImage.src = image.src;
            wrapper.appendChild(newImage);
            thumb.appendChild(wrapper);
            gallery.appendChild(thumb);
        }
    });

    if(gallery.childElementCount===0){
        gallery.appendChild(elementCreator("p", "No Images"));
    }
        
    targetDiv.appendChild(gallery);

    blogPostRenderer(targetDiv, info.name.toLowerCase());
    
}

let resetMarkerInfo = ()=>{
    let targetDiv = document.getElementById("map-info-target");
    
    while(targetDiv.firstChild){
        targetDiv.removeChild(targetDiv.firstChild);
    }
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
    if(text === null){return paragraph;}
    let pText = document.createTextNode(text);
    paragraph.appendChild(pText);
    return paragraph;
}

// Method for retrieving blog posts and posting to targetDiv
let blogPostRenderer = (targetDiv: HTMLElement, locationName: String)=>{
    
    let relevantPosts = [];
    blogPostJson.forEach((post)=>{
        post.refCities.split(";").forEach((city) => {
            if(city.toLowerCase() === locationName){relevantPosts.push(post)};
        });
    });

    if(relevantPosts.length === 0){
        targetDiv.appendChild(elementCreator("h2", "No Blog Posts"));
    }else{
        targetDiv.appendChild(elementCreator("h2", "Blog Posts"));
    }

    relevantPosts.forEach((post)=>{
        let postDiv = document.createElement("div");
        let header = document.createElement("div");
        header.className = "blog-header";
        let title = elementCreator("h3", post.title);
        title.className="blog-post-title";
        let postMeta = elementCreator("p", post.publishAt + " - " + post.location);
        header.appendChild(title);
        header.appendChild(postMeta);
        postDiv.appendChild(header);
        let bodyDiv = document.createElement("div");
        bodyDiv.innerHTML = post.body;
        postDiv.appendChild(bodyDiv);
        targetDiv.appendChild(postDiv);
        
    });
}

window["initMap"] = initMap;