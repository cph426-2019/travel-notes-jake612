import * as React from "react";
import ReactDOM, {render} from "react-dom";

let main = ()=>{
    ReactDOM.render(<Map/>, document.getElementById("map-target"));
};

let initMap = (maps)=>{
    

    let map = new maps.Map(document.getElementById('map'), {zoom: 4, center: uluru});
    
    
};

class Map extends React.Component{
    render(){
        return <div className="map-container">
            <h1 className="page-header">My Map</h1>
            <div id="map"></div>
        </div>;
        
    }
}

window.addEventListener('load', main);