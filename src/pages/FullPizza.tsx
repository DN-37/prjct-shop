import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import { Link } from 'react-router-dom';

const FullPizza: React.FC = () => {
  const [pizza, setPizza] = React.useState<{
    imageUrl: string;
    title: string;
    price: number;
  }>();

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
  }, [id, navigate]);

  if (!pizza) {
    return <>Загрузка...</>;
  }

  return (
    <div className="container">
      <Link to="/">
        <button className="button button--outline button--add">
          <span>Назад</span>
        </button>
      </Link>
      <br />
      <div style={{ textAlign: "center" }}>
        <img src={pizza.imageUrl} alt="" />
        <h2>Пицца: {pizza.title}</h2>
        <h3>Стоимость от: {pizza.price} ₽</h3>
      </div>
    </div >
  )
}

export default FullPizza;