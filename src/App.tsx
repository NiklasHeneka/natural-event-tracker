import { useState, useEffect} from "react";
import Loader from "./components/Loader.tsx"
import EventMap from "./components/Map.jsx";

export type NaturalEvent = {
    id: string
    categories: { id: string; title: string }[]
    geometry: { coordinates: number[] }[]
};

function App() {
    const [events, setEvents] = useState<NaturalEvent[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchEvents = async () => {
            const response = await fetch("https://eonet.gsfc.nasa.gov/api/v3/events?status=open&category=wildfires,severeStorms")
            const data = await response.json()
            setEvents(data.events)
            setLoading(false)
        };

        fetchEvents()
    }, []);

    return (
        <div>
            { !loading ? <EventMap events={events} /> : <Loader /> }
        </div>
    )
}

export default App