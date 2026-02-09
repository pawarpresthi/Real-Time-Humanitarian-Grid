'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet icons in Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icons
const createIcon = (color) => {
    return new L.DivIcon({
        className: 'custom-icon',
        html: `<div style="
      background-color: ${color};
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 0 10px rgba(0,0,0,0.5);
      ${color === '#ef4444' ? 'animation: pulse 1.5s infinite;' : ''}
    "></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12]
    });
};

const redIcon = createIcon('#ef4444'); // High urgency
const yellowIcon = createIcon('#fbbf24'); // Medium urgency
const greenIcon = createIcon('#10b981'); // Resource

// Component to handle map resizing and updates
function MapController({ center }) {
    const map = useMap();
    useEffect(() => {
        map.flyTo(center, map.getZoom());
    }, [center, map]);
    return null;
}

export default function Map({ requests, resources, onMarkerClick, center }) {
    // Default center: India (Lucknow)
    const defaultCenter = [26.8467, 80.9462];
    const displayCenter = center || defaultCenter;

    return (
        <MapContainer
            center={displayCenter}
            zoom={13}
            style={{ height: '100%', width: '100%', borderRadius: '1rem', overflow: 'hidden' }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Map Controller for dynamic updates */}
            <MapController center={displayCenter} />

            {/* Requests */}
            {requests.map((req) => (
                req.coords && (
                    <Marker
                        key={req.id}
                        position={[req.coords.lat, req.coords.lng]}
                        icon={req.urgency === 'High' ? redIcon : yellowIcon}
                        eventHandlers={{
                            click: () => onMarkerClick(req, false),
                        }}
                    >
                        <Popup>
                            <strong>{req.name}</strong><br />
                            Needs: {req.needs.join(', ')}<br />
                            Urgency: {req.urgency}
                        </Popup>
                    </Marker>
                )
            ))}

            {/* Resources */}
            {resources.map((res) => (
                res.coords && (
                    <Marker
                        key={res.id}
                        position={[res.coords.lat, res.coords.lng]}
                        icon={greenIcon}
                        eventHandlers={{
                            click: () => onMarkerClick(res, true),
                        }}
                    >
                        <Popup>
                            <strong>{res.organization}</strong><br />
                            Inventory: {res.inventory.join(', ')}
                        </Popup>
                    </Marker>
                )
            ))}

            <style jsx global>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
      `}</style>
        </MapContainer>
    );
}
