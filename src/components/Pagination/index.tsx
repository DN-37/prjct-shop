import React from "react";
import ReactPaginate from 'react-paginate';

import styles from './Pagination.module.scss';

type PaginationProps = {
    currentPage: number;
    onChangePage: any;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, onChangePage }) => {
    return (
        <div>
            <ReactPaginate
                className={styles.root}
                breakLabel="..."
                previousLabel="<"
                nextLabel=">"
                onPageChange={e => onChangePage(e.selected + 1)}
                pageRangeDisplayed={4}
                pageCount={3}
                forcePage={currentPage - 1}
            />
        </div>
    )
}

export default Pagination;