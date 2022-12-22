import React from "react";

import Categories from '../components/Categories';
import Sort from '../components/Sort';
import PizzaBlock from '../components/PizzaBlock';
import { Skeleton } from '../components/PizzaBlock/Skeleton';
import Pagination from "../components/Pagination";
import { SearchContext } from "../App";

import { useSelector, useDispatch } from 'react-redux'
import { setCategoryId } from "../redux/slices/filterSlice";

export const Home = () => {
    const { sortType, categoryId } = useSelector((state) => state.filter)
    const dispatch = useDispatch()

    const changeCategoryId = (id) => {
        dispatch(setCategoryId(id))
    }

    const {searchValue} = React.useContext(SearchContext)
    const [items, setItems] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [currentPage, setCurrentPage] = React.useState(1);

    React.useEffect(() => {
        setIsLoading(true);

        const sortBy = sortType.sort.replace('-', '');
        const order = sortType.sort.includes('-') ? 'asc' : 'desc';
        const category = categoryId > 0 ? `category=${categoryId}` : '';
        const search = searchValue ? `${searchValue}` : '';

        fetch(
            `https://639d8cce1ec9c6657baca8b6.mockapi.io/items?page=${currentPage}&limit=4&${category}&sortBy=${sortBy}&order=${order}&search=${search}`,
        )
        .then((res) => {
            return res.json();
        })
        .then((arr) => {
            setItems(arr);
            setIsLoading(false);
        });
        window.scrollTo(0, 0);
    }, [categoryId, sortType, searchValue, currentPage]);

    const pizzas = items.map((obj) => <PizzaBlock key={obj.id} {...obj} />);
    const skeletons = [...new Array(6)].map((_, index) => <Skeleton key={index} />);


    return (
    <div className="container">
        <div className="content__top">
            <Categories value={categoryId} onClickCategory={(id) => changeCategoryId(id)} />
            <Sort />
        </div>
        <h2 className="content__title">Bce пиццы</h2>
        <div className="content__items">
            {isLoading ? skeletons : pizzas}
        </div>
        <Pagination onChangePage={(num) => setCurrentPage(num)}/>
    </div>
    )
}