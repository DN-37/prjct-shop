import React from "react";
import Categories from '../components/Categories';
import Sort, { list } from '../components/Sort';
import PizzaBlock from '../components/PizzaBlock';
import { Skeleton } from '../components/PizzaBlock/Skeleton';
import Pagination from "../components/Pagination";

import { useSelector } from 'react-redux'
import { selectFilter, setCategoryId, setCurrentPage, setFilters } from "../redux/slices/filterSlice";
import { fetchPizzas, selectPizzas } from "../redux/slices/pizzaSlice";


import qs from 'qs';
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch } from "../redux/store";
import { SearchPizzaParams } from "../redux/slices/pizzaSlice";


export const Home: React.FC = () => {
    const { sortType, categoryId, currentPage, searchValue } = useSelector(selectFilter);

    const { items, status } = useSelector(selectPizzas)

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const isSearch = React.useRef(false);
    const isMounted = React.useRef(false);


    const changeCategoryId = (id: number) => {
        dispatch(setCategoryId(id))
    }

    const changeNumber = (num: number) => {
        dispatch(setCurrentPage(num))
    }

    const getPizzas = async () => {

        const sortBy = sortType.sort.replace('-', '');
        const order = sortType.sort.includes('-') ? 'asc' : 'desc';
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
            const params = qs.parse(window.location.search.substring(1)) as unknown as SearchPizzaParams;

            const sortType = list.find(obj => obj.sort === params.sortBy);
            

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
            <Sort />
        </div>
        <h2 className="content__title">Bce ??????????</h2>
        {
            status === 'error' ? (
            <div className="content__error-info">
                <h2>?????????????????? ???????????? <span>????</span></h2>
                <p>
                    ?????????????????? ??????????, ???? ?????????????? ???????????????? ???????????? ????????.
                    <br />
                    ???????????????????? ?????????????????? ?????????????? ??????????.
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