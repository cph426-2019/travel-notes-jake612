import * as React from "react";
import ReactDOM, {render} from "react-dom";

export let main = ()=>{
    ReactDOM.render(<Map/>, document.getElementById("map-target"));
    initMap();
};

export let initMap = ()=>{
    let copenhagen = {lat: 55.6761, lng: 12.5683};
    let map = new google.maps.Map(document.getElementById('map'), {zoom: 8, center: copenhagen});
    let cphgMarker = new google.maps.Marker({position: copenhagen, map: map});
    
};

export class Map extends React.Component{
    render(){
        return <div className="map-container">
            <div id="map"></div>
            <script async defer
            src="https://maps.googleapis.com/maps/api/js?key=AIzaSyC4nW4CJLqa4w9R9cSXeuzoqNSgD5rcwUo">
            </script>
        </div>;
        
    }
}

window.addEventListener('load', main);