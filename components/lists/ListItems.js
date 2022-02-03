import Link from 'next/link';
import React from 'react';
import { useTranslation } from 'next-i18next';
import Slider from 'react-slick';
import ClipItem from '../items/ClipItem';
import Pagination from '../Pagination';

export default function ListItems({ models, pagination, page, link = "clip", title, pathname, showPagination = true }) {
    const {t, i18n} = useTranslation();

    if (models.length === 0) return <></>;

    return (
        <>
            <h2 className="title-2 mt-3 mt-md-3 mt-lg-5 pt-1">{title}</h2>
            <div className="row border-radius-4 padding-0 ">
                {models.map((model, index) => {
                    return (
                        <div className="col-lg-3 col-md-4 col-6 mb-4" key={index}>
                            <ClipItem model={model} link={link} hidePremiere className="px-0" />
                        </div>
                    );
                })}
            </div>

            {showPagination && <Pagination pathname={pathname} pageCount={pagination.pageCount || 0} totalCount={pagination.totalCount || 0} initialPage={page - 1} />}
        </>
    );
}