import {useEffect, useRef, useState} from 'react';
import {AdvancedMarker, APIProvider, Map, useMap} from '@vis.gl/react-google-maps';
import type {Marker} from '@googlemaps/markerclusterer';
import {MarkerClusterer} from '@googlemaps/markerclusterer';
import LocationMarker, {type HazardType} from "./LocationMarker.tsx";
import type {NaturalEvent} from "../App.tsx";

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const mapId = import.meta.env.VITE_GOOGLE_MAP_ID ?? "b2ac75a838aee96a840a7c75"

const NATURAL_EVENT_WILDFIRE = "wildfires"
const NATURAL_EVENT_SEVERE_STORMS = "severeStorms"

interface EventMapProps {
    events: NaturalEvent[]
}

type EventMarker = { key: string, type: HazardType, location: google.maps.LatLngLiteral }

const EventMap = ({events}: EventMapProps) => {

    const markers: EventMarker[] = events.flatMap((ev, index) => {
        if (ev.categories[0].id === NATURAL_EVENT_WILDFIRE) {
            return {
                key: ev.id + "/" + ev.categories[0].id + "/" + index,
                type: "wildfire" as HazardType,
                location: {lat: ev.geometry[0].coordinates[1], lng: ev.geometry[0].coordinates[0]}
            }
        } else if (ev.categories[0].id === NATURAL_EVENT_SEVERE_STORMS) {
            return ev.geometry.map((coords, storm_index) => {
                return {
                    key: ev.id + "/" + ev.categories[0].id + "/" + storm_index + "/" + index,
                    type: "severe-storm" as HazardType,
                    location: {lat: coords.coordinates[1], lng: coords.coordinates[0]}
                }
            })
        }
        return null
    }).filter(ev => ev !== null)

    return (<div className="eventMap">
        <APIProvider apiKey={apiKey}
                     onLoad={() => console.log('Maps API has loaded.')}>
            <Map
                defaultZoom={6}
                defaultCenter={{lat: 42.3265, lng: -122.8756}}
                mapId={mapId}
            >
                <EventMarkers markers={markers}/>
            </Map>
        </APIProvider>
    </div>)
};

const EventMarkers = (props: { markers: EventMarker[] }) => {
    const map = useMap();
    const [markers, setMarkers] = useState<{ [key: string]: Marker }>({});
    const clusterer = useRef<MarkerClusterer | null>(null);

    useEffect(() => {
        if (!map) return;
        clusterer.current ??= new MarkerClusterer({map});
    }, [map]);

    useEffect(() => {
        clusterer.current?.clearMarkers();
        clusterer.current?.addMarkers(Object.values(markers));
    }, [markers]);

    const setMarkerRef = (marker: Marker | null, key: string) => {
        if (marker && markers[key]) return;
        if (!marker && !markers[key]) return;

        setMarkers(prev => {
            if (marker) {
                return {...prev, [key]: marker};
            } else {
                const newMarkers = {...prev};
                delete newMarkers[key];
                return newMarkers;
            }
        });
    };

    return (<>
            {props.markers.map((poi: EventMarker) => (<AdvancedMarker
                    key={poi.key}
                    position={poi.location}
                    ref={marker => setMarkerRef(marker, poi.key)}
                >
                    <LocationMarker type={poi.type}/>
                </AdvancedMarker>))}
        </>);
};

export default EventMap;