import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';

const FullPizza = () => {
    const [pizza, setPizza] = React.useState();

    const { id } = useParams();
    const navigate = useNavigate();

    React.useEffect(() => {
        async function fetchPizza() {
          try {
            const { data } = await axios.get('https://639d8cce1ec9c6657baca8b6.mockapi.io/items/' + id);
            setPizza(data);
          } catch (error) {
            alert('Ошибка при получении пиццы!');
            navigate('/');
          }
        }
        fetchPizza();
    }, []);

    if (!pizza) {
        return <>Загрузка...</>;
      }

    return (
        <div className="container">
            <img src={pizza.imageUrl} alt=""/>
            <h2>{pizza.title}</h2>
            <h4>{pizza.price} ₽</h4>
        </div>
    )
}

export default FullPizza;