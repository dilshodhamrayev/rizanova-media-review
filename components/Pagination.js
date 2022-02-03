import { useRouter } from 'next/router';
import React from 'react';
import ReactPaginate from 'react-paginate';

export default function Pagination({ pageCount, defaultPageSize, pageParam, totalCount, link, initialPage, query = {}, pathname }) {
    const router = useRouter();

    if (pageCount < 2) return <></>;

    return (
        <ReactPaginate
            previousLabel={
                <svg width="9" height="14" viewBox="0 0 9 14" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.67453 1.57844L7.48786 0.398439L0.89453 6.99844L7.49453 13.5984L8.67453 12.4184L3.25453 6.99844L8.67453 1.57844Z" />
                </svg>
            }
            nextLabel={
                <svg width="9" height="14" viewBox="0 0 9 14" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.825467 12.4216L2.01214 13.6016L8.60547 7.00156L2.00547 0.401562L0.825467 1.58156L6.24547 7.00156L0.825467 12.4216Z" />
                </svg>
            }
            breakLabel={'...'}
            breakClassName={'page-item'}
            breakLinkClassName={'page-link'}
            pageCount={pageCount}
            marginPagesDisplayed={1}
            pageRangeDisplayed={3}
            onPageChange={(p) => {
                router.push({
                    pathname: pathname ? pathname : router.pathname,
                    query: {
                        page: p.selected + 1,
                        ...query
                    }
                })
            }}
            containerClassName={'pagination'}
            hrefBuilder={(page) => {
                let link = "";

                for (const param in query) {
                    if (query[param])
                        link += ("&" + param + "=" + query[param]);
                }

                return `${pathname ? pathname : router.pathname}?page=${page}${link}`
            }}
            activeClassName={'active'}
            pageClassName={"page-item"}
            pageLinkClassName={"page-link"}
            previousClassName={"page-item"}
            nextClassName={"page-item"}
            previousLinkClassName={"page-link"}
            nextLinkClassName={"page-link"}
            forcePage={parseInt(initialPage)}
        />
    );
}