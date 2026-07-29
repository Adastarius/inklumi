import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import PlaceInfo from './PlaceInfo'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import './MapView.css'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
})

//Beobachtet, wann der Kartencontainer eine feste Höhe/Breite bekommt
//da er hidden ist beim Laden der Seite und meldet es Leaflet, damit
//die Kachelgröße neu berechnet werden kann
function InvalidateSizeOnShow() {
    const map = useMap()

    useEffect(() => {
        const resizeObserver = new ResizeObserver(() => {
            map.invalidateSize()
        })
        resizeObserver.observe(map.getContainer())
        return () => resizeObserver.disconnect()
    }, [map])
    return null
}

function MapView({ places }) {
    const [selectedId, setSelectedId] = useState(null)
    const selectedPlace = places.find((p) => p.id === selectedId)

    return (
        <div className="map-layout">
            <div className="map-container-wrapper">
                <MapContainer center={[52.52, 13.40]} zoom={13} style={{ height: '600px' }}>
                    <InvalidateSizeOnShow />
                    <TileLayer
                        url="https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://stadiamaps.com" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
                    />
                    {places.map((place) => (
                        <Marker
                            key={place.id}
                            position={[place.latitude, place.longitude]}
                            eventHandlers={{ click: () => setSelectedId(place.id) }}
                            alt={place.name}
                        />
                    ))}
                </MapContainer>
            </div>

            {/* with aria-live screenreader recognizes changes without moving focus */}
            <aside aria-live="polite" className={`map-sidepanel ${selectedPlace ? 'is-visible' : ''}`}>
                {selectedPlace ? (
                    <PlaceInfo place={selectedPlace} onClose={() => setSelectedId(null)}/>
                ) : (
                    <p>Wähle einen Ort auf der Karte, um mehr Informationen zu bekommen.</p>
                )}
            </aside>
        </div>
    )
}

export default MapView