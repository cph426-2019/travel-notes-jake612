import * as React from "react";
import ReactDOM, {render} from "react-dom";
import {Map, InfoWindow, Marker, GoogleApiWrapper} from "google-maps-react";

let main = ()=>{
    ReactDOM.render(<Map/>, document.getElementById("map-target"));
};

/*const fetchGoogleMaps = require("fetch-google-maps");

fetchGoogleMaps({
    apiKey: 'AIzaSyARu5U5H_Lj7aULeCKgpr7EIYHP59zeOx0',
    language: 'en',
    libraries: ['geometry']
}).then(( Maps ) => {
    const map = new Maps.Map(document.getElementById('map-target'), {
        zoom: 8,
        center: new Maps.LatLng(-34.397, 150.644)
    });
});*/

let initMap = ()=>{
    let copenhagen = {lat: 55.6761, lng: 12.5683};
    let map = new google.maps.Map(document.getElementById('map'), {zoom: 8, center: copenhagen});
    let cphgMarker = new google.maps.Marker({position: copenhagen, map: map});
    
};
class Map extends React.Component{
   
    render(){
        return <div className="map-container" >
            <div id="map"></div>
            <script async defer
            src="https://maps.googleapis.com/maps/api/js?key=AIzaSyC4nW4CJLqa4w9R9cSXeuzoqNSgD5rcwUo&callback=initMap">
            </script>
        </div>;
        
    }
   
}

window.addEventListener('load', main);


