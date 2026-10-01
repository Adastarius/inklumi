import './NewPlace.css'
import { Plus } from 'lucide-react'
import { Link } from 'react-router-dom'

function NewPlaceButton() {
    return (
        <Link to="/orte/neu" className="new-place-button">
            <Plus size={18} strokeWidth={2.5} aria-hidden="true" />
            Neuen Ort eintragen
        </Link>
                
        
    )
}

export default NewPlaceButton