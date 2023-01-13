import React from "react";
import Categories from '../components/Categories';
import SortPopup, { list } from '../components/Sort';
import PizzaBlock from '../components/PizzaBlock';
import { Skeleton } from '../components/PizzaBlock/Skeleton';
import Pagination from "../components/Pagination";

import { useSelector } from 'react-redux'
import { setCategoryId, setCurrentPage, setFilters } from "../redux/filter/slice";

import { selectFilter } from "../redux/filter/selectors";
import { selectPizzaData } from "../redux/pizza/selectors";

import { fetchPizzas } from "../redux/pizza/asyncActions";


import qs from 'qs';
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../redux/store";
import { SearchPizzaParams } from "../redux/pizza/types";


export const Home: React.FC = () => {
    const { sortType, categoryId, currentPage, searchValue } = useSelector(selectFilter);

    const { items, status } = useSelector(selectPizzaData);

    const dispatch = useAppDispatch();  
    const navigate = useNavigate();
    const isSearch = React.useRef(false);
    const isMounted = React.useRef(false);


    const changeCategoryId = React.useCallback((id: number) => {
        dispatch(setCategoryId(id));
    }, []);

    const changeNumber = (num: number) => {
        dispatch(setCurrentPage(num))
    }

    const getPizzas = async () => {

        const sortBy = sortType.sortProperty.replace('-', '');
        const order = sortType.sortProperty.includes('-') ? 'asc' : 'desc';
        const category = categoryId > 0 ? `${categoryId}` : '';
        const search = searchValue;

        dispatch(
            fetchPizzas({
            sortBy,
            order,
            category,
            search,
            currentPage: String(currentPage),
        }))

        window.scrollTo(0, 0);
    }

    React.useEffect(() => {
        if (isMounted.current) {
            const queryString = qs.stringify({
                sort: sortType.sortProperty,
                categoryId,
                currentPage,
            });

            navigate(`?${queryString}`)
        }
        isMounted.current = true;
    }, [categoryId, sortType, currentPage, navigate])

    React.useEffect(() => {
        if (window.location.search) {
            const params = qs.parse(window.location.search.substring(1)) as unknown as SearchPizzaParams;

            const sortType = list.find(obj => obj.sortProperty === params.sortBy);
            

            dispatch(setFilters({
                searchValue: params.search,
                categoryId: Number(params.category),
                currentPage: Number(params.currentPage),
                sortType: sortType || list[0],
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

    const pizzas = items.map((obj: any) => <PizzaBlock key={obj.id} {...obj} />);
    const skeletons = [...new Array(6)].map((_, index) => <Skeleton key={index} />);

    return (
    <div className="container">
        <div className="content__top">
            <Categories value={categoryId} onClickCategory={(id: any) => changeCategoryId(id)} />
            <SortPopup value={sortType} />
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
        
        <Pagination currentPage={currentPage} onChangePage={changeNumber}/>
    </div>
    )
}