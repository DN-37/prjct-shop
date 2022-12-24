import React from "react";
import Categories from '../components/Categories';
import Sort, { list } from '../components/Sort';
import PizzaBlock from '../components/PizzaBlock';
import { Skeleton } from '../components/PizzaBlock/Skeleton';
import Pagination from "../components/Pagination";

import { useSelector, useDispatch } from 'react-redux'
import { setCategoryId, setCurrentPage, setFilters } from "../redux/slices/filterSlice";

import axios from "axios";

import qs from 'qs';
import { useNavigate } from "react-router-dom";


export const Home = () => {
    const { sortType, categoryId, currentPage, searchValue } = useSelector((state) => state.filter)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isSearch = React.useRef(false);
    const isMounted = React.useRef(false);

    const [items, setItems] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);

    const changeCategoryId = (id) => {
        dispatch(setCategoryId(id))
    }

    const changeNumber = (num) => {
        dispatch(setCurrentPage(num))
    }

    const fetchPizzas = async () => {
        setIsLoading(true);

        const sortBy = sortType.sort.replace('-', '');
        const order = sortType.sort.includes('-') ? 'asc' : 'desc';
        const category = categoryId > 0 ? `${categoryId}` : '';
        const search = searchValue ? `${searchValue}` : '';

        {/*await axios.get(`https://639d8cce1ec9c6657baca8b6.mockapi.io/items?page=${currentPage}&limit=4&category=${category}&sortBy=${sortBy}&order=${order}&search=${search}`)
        .then(res => {
            setItems(res.data);
            setIsLoading(false);
        .catch((err) => {
            setIsLoading(false);
        });
        });*/}


        try {
            const res = await axios.get(`https://639d8cce1ec9c6657baca8b6.mockapi.io/items?page=${currentPage}&limit=4&category=${category}&sortBy=${sortBy}&order=${order}&search=${search}`);
            setItems(res.data);
        } catch (error) {
            console.log('ERROR', error);
        } finally {
            setIsLoading(false);
        }

        
    }

    React.useEffect(() => {
        if (isMounted.current) {
            const queryString = qs.stringify({
                sort: sortType.sort,
                categoryId,
                currentPage,
                searchValue,
            });

            navigate(`?${queryString}`)
        }
        isMounted.current = true;
    }, [categoryId, sortType, currentPage, searchValue, navigate])

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
        window.scrollTo(0, 0);

        if(!isSearch.current) {
            fetchPizzas()
        }

        isSearch.current = false
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
        <Pagination onChangePage={changeNumber}/>
    </div>
    )
}