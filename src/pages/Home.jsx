import React from "react";

import Categories from '../components/Categories';
import Sort from '../components/Sort';
import PizzaBlock from '../components/PizzaBlock';
import { Skeleton } from '../components/PizzaBlock/Skeleton';

export const Home = () => {
    const [items, setItems] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        fetch('https://639d8cce1ec9c6657baca8b6.mockapi.io/items')
        .then((res) => {
            return res.json();
        })
        .then((arr) => {
            setItems(arr);
            setIsLoading(false);
        });
        window.scrollTo(0, 0);
    }, []);

    return (
    <div className="container">
        <div className="content__top">
            <Categories />
            <Sort />
        </div>
        <h2 className="content__title">Bce пиццы</h2>
        <div className="content__items">
            {isLoading
            ? [...new Array(6)].map((_, index) => <Skeleton key={index} />)
            : items.map((obj) => <PizzaBlock key={obj.id} {...obj} />)}
        </div>
    </div>
    )
}