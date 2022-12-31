import React from "react";
import Categories from '../components/Categories';
import Sort, { list } from '../components/Sort';
import PizzaBlock from '../components/PizzaBlock';
import { Skeleton } from '../components/PizzaBlock/Skeleton';
import Pagination from "../components/Pagination";

import { useSelector, useDispatch } from 'react-redux'
import { selectFilter, setCategoryId, setCurrentPage, setFilters } from "../redux/slices/filterSlice";
import { fetchPizzas, selectPizzas } from "../redux/slices/pizzaSlice";


import qs from 'qs';
import { useNavigate, Link } from "react-router-dom";


export const Home = () => {
    const { sortType, categoryId, currentPage, searchValue } = useSelector(selectFilter);

    const { items, status } = useSelector(selectPizzas)

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isSearch = React.useRef(false);
    const isMounted = React.useRef(false);


    const changeCategoryId = (id) => {
        dispatch(setCategoryId(id))
    }

    const changeNumber = (num) => {
        dispatch(setCurrentPage(num))
    }

    const getPizzas = async () => {

        const sortBy = sortType.sort.replace('-', '');
        const order = sortType.sort.includes('-') ? 'asc' : 'desc';
        const category = categoryId > 0 ? `${categoryId}` : '';

        dispatch(fetchPizzas({
            sortBy,
            order,
            category,
            searchValue,
            currentPage,
        }))

        window.scrollTo(0, 0);
    }

    React.useEffect(() => {
        if (isMounted.current) {
            const queryString = qs.stringify({
                sort: sortType.sort,
                categoryId,
                currentPage,
            });

            navigate(`?${queryString}`)
        }
        isMounted.current = true;
    }, [categoryId, sortType, currentPage, navigate])

    React.useEffect(() => {
        if (window.location.search) {
            const params = qs.parse(window.location.search.substring(1));

            const sortType = list.find(obj => obj.sort === params.sort);

            dispatch(setFilters({
                ...params,
                sortType,
            }))
            isSearch.current = true;
        }
    }, [])

    React.useEffect(() => {
        
        if(!isSearch.current) {
            getPizzas()
        }

        isSearch.current = false
    }, [categoryId, sortType, searchValue, currentPage]);

    const pizzas = items.map((obj) => <Link to={`/pizza/${obj.id}`}><PizzaBlock key={obj.id} {...obj} /></Link>);
    const skeletons = [...new Array(6)].map((_, index) => <Skeleton key={index} />);

    return (
    <div className="container">
        <div className="content__top">
            <Categories value={categoryId} onClickCategory={(id) => changeCategoryId(id)} />
            <Sort />
        </div>
        <h2 className="content__title">Bce пиццы</h2>
        {
            status === 'error' ? (
            <div className="content__error-info">
                <h2>Произошла ошибка <span>😕</span></h2>
                <p>
                    Вероятней всего, не удалось получить список пицц.
                    <br />
                    Попробуйте повторить попытку позже.
                </p>
                <br />
            </div> 
            ) : (
            <div className="content__items">
                {status === 'loading' ? skeletons : pizzas}
            </div> )
        }
        
        <Pagination onChangePage={changeNumber}/>
    </div>
    )
}