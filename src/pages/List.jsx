import { useSelector } from "react-redux"
import Film from "./FilmsDetails"

export default function List() {

    const favList = useSelector((state)=> state.favory.titre)
    console.log(favList)
  return (
    <>
    <h1>Film favoris</h1>
    <ul>
    {favList.map(film => (
  <Film
    key={film.id}
    title={film.titre}
    poster={film.affiche} 
  />
))}
    </ul>
    </>
  )
}