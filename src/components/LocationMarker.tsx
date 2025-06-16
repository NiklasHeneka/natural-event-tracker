import { Icon } from '@iconify/react'
import fireIcon from '@iconify/icons-mdi/fire'
import stormIcon from '@iconify/icons-mdi/weather-storm'

export type HazardType = "wildfire" | "severe-storm"

interface LocationMarkerProps {
    type: HazardType,
}

export default function LocationMarker({type}: Readonly<LocationMarkerProps>) {
    return (
        <div className="location-marker">
            { type === "wildfire"
                ? <Icon icon={fireIcon} className="fire-icon"></Icon>
                : <Icon icon={stormIcon} className="storm-icon"></Icon> }
        </div>
    )
}