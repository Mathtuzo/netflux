import { useState, useEffect, useRef } from 'react'
import search from '../../assets/svg/search.svg'
import '../searchbar/searchbar.css'
import { useNavigate } from 'react-router-dom'

function Searchbar() {
    const [isActive, setIsActive] = useState(false)
    const navigate = useNavigate()
    const searchRef = useRef(null)

    const handleClick = () => {
        setIsActive(prev => !prev)
        navigate("/search")
    }

    
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsActive(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    return (
        <div ref={searchRef} className={`search${isActive ? '-on' : ''}`}>
            <img id="search-img" src={search} alt="barre de recherche" onClick={handleClick}/>
            <input type="search" className={`${isActive ? "input-active" : ""}`} id="search-input" placeholder="Rechercher"/>
        </div>
    )
}

export default Searchbar