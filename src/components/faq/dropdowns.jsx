import { useState } from "react"
import arrow from '../../assets/svg/arrow.svg'
import '../faq/dropdowns.css'

const faqData = [
    {question: "Est-ce que je peux regarder les vidéos en hors ligne ?", text : "Oui, absolument ! Notre plateforme dispose d'une fonctionnalité de téléchargement qui vous permet de regarder votre contenu préférés sans connexion Internet. Il vous suffit de cliquer sur l’icône de téléchargement disponible sur les contenus éligibles."},
    {question: "Sur quels appareils puis-je regarder les contenus ?", text : "Vous pouvez regarder nos contenus sur tous vos appareils : smartphones, tablettes, ordinateurs portables ou de bureau. Notre plateforme est entièrement responsive, ce qui signifie qu’elle s’adapte automatiquement à la taille de votre écran pour vous offrir une expérience de visionnage optimale, où que vous soyez."},
    {question: "Quels types de contenus sont disponibles ?", text : "Notre plateforme propose une large variété de contenus pour tous les goûts, allant des films juqu'aux séries en passant par des documentaires et des contenus pour enfants."}
]



function DropDowns() {
    const [openStates, setOpenStates] = useState(Array(faqData.length).fill(false))

    const toggleDropdown = (index) => {
        setOpenStates(prev => {
            const newStates = [...prev]
            newStates[index] = !newStates[index]
            return newStates
        })
    }

    return (
        <>
        <div className="faq-group">
            {faqData.map((item, index) => {
                const isOpen = openStates[index]
                return (
                    <div key={index} className="dropdowns">
                        <div className={`dropdowns-content ${isOpen ? "open" : ""}`}>
                            <h3>{item.question}</h3>
                            <img src={arrow} alt="menu dépliant" onClick={() => toggleDropdown(index)} className={isOpen ? "img-open" : ""}/>
                        </div>
                        {isOpen && <p>{item.text}</p>}
                    </div>
                )
            })}
        </div>
        </>
    )
}

export default DropDowns