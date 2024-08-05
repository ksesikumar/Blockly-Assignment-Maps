import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import bikeIconUrl from './images/R.png'; 

// Configure Leaflet bike icon
const bikeIcon = L.icon({
    iconUrl: bikeIconUrl,
    iconSize: [32, 32], 
    iconAnchor: [16, 32], 
    popupAnchor: [0, -32], 
});

const MapComponent = () => {
    const [vehiclePosition, setVehiclePosition] = useState([0, 0]);
    const [route, setRoute] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:6540/api/vehicle');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setVehiclePosition([data.currentPosition.lat, data.currentPosition.lng]);
                setRoute(data.route.map(point => [point.lat, point.lng]));
            } catch (error) {
                console.error('Fetch error:', error);
            }
        };

        fetchData();

        const interval = setInterval(fetchData, 2000); // Update every 2 seconds

        return () => clearInterval(interval);
    }, []);

    // Style for the route
    const routeStyle = {
        color: 'blue',       
        weight: 5,          
        opacity: 0.7,        
    };

    return (
        <MapContainer center={vehiclePosition} zoom={13} style={{ height: '400px', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={vehiclePosition} icon={bikeIcon} />
            <Polyline positions={route} pathOptions={routeStyle} />
        </MapContainer>
    );
};

export default MapComponent;