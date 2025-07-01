import home from '../../assets/svg/home.svg'
import film from '../../assets/svg/film-icon.svg'
import serie from '../../assets/svg/serie-icon.svg'
import news from '../../assets/svg/news-icon.svg'
import favori from '../../assets/svg/favori-icon.svg'
import search from '../../assets/svg/loupe.svg'
import User from '../user/user'
import {Link} from 'react-router-dom'
import { useState, useEffect } from 'react'
import Searchbar from '../searchbar/searchbar'



function Navbar(){
    const navbar = [
        {title : "Accueil", img : home, path : "/home"},
        // {title : "Films", img : film, path : "/films"},
        // {title : "Séries", img : serie, path : "/series"},
        {title : "Favoris", img : favori, path : "/liste#favori"}
    ]

    

    return(
        <nav>
            {navbar.map((item, index) =>{
                return(
                    <Link key={index} to={item.path} id={`nav-element-${index}`}>
                        <div>
                            <img src={item.img} alt={item.title}/>
                            <p>{item.title}</p>
                        </div>
                    </Link>
                )
            })

            }
            <Searchbar/>
            <User/>
            
        </nav>
    )
}

export default Navbar