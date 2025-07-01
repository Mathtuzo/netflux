import {Link, useLocation, Navigate } from "react-router-dom";
import Favori from "../liste/favori";
import Downloads from "../liste/downloads";
import '../liste/liste.css'

const PageData = [
    { title: "Favori", path: "#favori", composant: <Favori /> },
    { title: "Téléchargements", path: "#download", composant: <Downloads /> }
];

function Liste() {
    const location = useLocation();

    const activePage = PageData.find(
        (item) => location.pathname === '/liste' && location.hash === item.path
    );
    

    return (
        <div id="liste-group">
            <h1>Ma Liste</h1>
            <div id="liste-page">
                <div id="liste-nav">
                    {PageData.map((i, index) => {
                        const isActive = location.pathname === '/liste' && location.hash === i.path
                        return(
                            <Link to={`/liste${i.path}`} key={index} className={isActive ? "link-on" : ""}>{i.title}</Link>
                        )
                    } 
                    )}
                </div>

                <div id="liste-content">
                    {activePage ? (activePage.composant) : ""}
                </div>
            </div>
        </div>
    );
}

export default Liste;