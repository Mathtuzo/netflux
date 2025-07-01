import { useNavigate } from 'react-router-dom'
import '../abonnements/subs.css'


function Subscribe(){

    const navigate = useNavigate()

    const subsData = [
        {price : "4,99€", text : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Id eius sint nisi consectetur temporibus perspiciatis repellat, eveniet veritatis possimus voluptates!"},
        {price : "14,99€", text : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Id eius sint nisi consectetur temporibus perspiciatis repellat, eveniet veritatis possimus voluptates!"},
        {price : "19,99€", text : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Id eius sint nisi consectetur temporibus perspiciatis repellat, eveniet veritatis possimus voluptates!"}
    ]

    const handleSubmit = ()=>{
        navigate('/signin')
    }

    return(
        <div id='sub-group'>
            {subsData.map((item, index)=>{
                return(
                    <div className="sub-cards" key={index}>
                    <h3>{item.price}</h3>
                    <p>{item.text}</p>
                    <button className="sub-btn" onClick={handleSubmit}>Je m'abonne</button>
                </div>
                )
            })}
        </div>

    )
}

export default Subscribe