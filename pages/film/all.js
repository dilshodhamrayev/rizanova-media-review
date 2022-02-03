import { useRouter } from 'next/router';
import React, { Fragment, useContext } from 'react';
import useSWR from 'swr';
import { get } from '../../utils/request';
import Head from 'next/head';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import FilmItem from '../../components/items/FilmItem';
import Pagination from '../../components/Pagination';
import withSession from '../../utils/session';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Menu, Transition } from '@headlessui/react';
import { useState } from 'react';
import Empty from '../../components/Empty';

export default function AllFilm(props) {
    const router = useRouter();

    const { t, i18n } = useTranslation();

    const { page = 1, sort = "newest" } = router.query;

    const [year, setYear] = useState("");

    const { data: { pagination, models, max_year, min_year } } = useSWR(`film/index?page=${page}&limit=16&sort=${sort}&year=${year}`, get, { initialData: props.data });

    const title = t("Все фильмы");
    const description = t("Все узбекские фильмы на сайте RizaNova. Онлайн-кинотеатр узбекских фильмов в хорошем качестве только на сайте RizaNova.");
    const keywords = t("премьеры последние новые узбекских фильм фильмов актеры актрисы режиссеры узбеккино онлайн жанры");

    return <div>
        <Head>
            <title>{title}</title>
            <meta property="og:title" content={title} />
            <meta name="description" content={description} />
            <meta property="og:description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta property="og:image" content="https://rizanova.uz/image/logo.png" />
        </Head>

        <div className="container min-view inner-page">
            <ul className="breadcrumbs">
                <li><Link href="/"><a>{t("Главная")}</a></Link></li>
                <li><span>/</span></li>
                <li><Link href="/film"><a>{t("Фильмы")}</a></Link></li>
                <li><span>/</span></li>
                <li><p>{t("Все фильмы")}</p></li>
            </ul>

            <div className="d-flex justify-content-between">
                <h1 className="big-header d-flex align-items-center">{t("Все фильмы")}</h1>

                <div className="sort d-inline-block">
                    <div className="sort-panel">
                        <a role="button" className={"me-2 " + (sort === "newest" ? "active" : "")} onClick={() => {
                            router.push({
                                pathname: router.pathname,
                                query: {
                                    sort: 'newest'
                                }
                            })
                        }}>{t("Новые")}</a>
                        <a role="button" className={sort === "popular" ? "active" : ""} onClick={() => {
                            router.push({
                                pathname: router.pathname,
                                query: {
                                    sort: 'popular'
                                }
                            })
                        }}>{t("Популярные")}</a>
                        <Menu as="div" className={"relative "}>
                            <Menu.Button className="select-menu w-100 py-md-2 py-1 px-2 px-md-3 mt-1 d-flex justify-content-between align-items-center">
                                <span>
                                    {!year ? t("Все года") : year}
                                </span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M8.12 9.28957L12 13.1696L15.88 9.28957C16.27 8.89957 16.9 8.89957 17.29 9.28957C17.68 9.67957 17.68 10.3096 17.29 10.6996L12.7 15.2896C12.31 15.6796 11.68 15.6796 11.29 15.2896L6.7 10.6996C6.31 10.3096 6.31 9.67957 6.7 9.28957C7.09 8.90957 7.73 8.89957 8.12 9.28957Z" fill="#4F4F4F" />
                                </svg>
                            </Menu.Button>

                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items className="absolute left-0 mt-2 origin-top-right menu-content">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button className={"w-100 " + (!year ? 'active' : '')} onClick={() => {
                                                setYear("");
                                            }}>
                                                {t("Все года")}
                                            </button>
                                        )}
                                    </Menu.Item>
                                    {[...Array(max_year - min_year + 1).keys()].map((i) => i + Number.parseInt(min_year)).reverse().map(y => {
                                        return (
                                            <Menu.Item key={year}>
                                                {({ active }) => (
                                                    <button className={"w-100 " + (year == y ? 'active' : '')} onClick={() => {
                                                        setYear(y);
                                                    }}>
                                                        {y}
                                                    </button>
                                                )}
                                            </Menu.Item>
                                        )
                                    })}
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    </div>
                </div>
            </div>

            {models.length === 0 && <Empty text={t("Здесь пока пусто.")} />}
            
            <div className="row">
                {models.map((film, index) => {
                    return (
                        <div className="col-6 col-md-4 col-lg-3 mb-4" key={index}>
                            <FilmItem model={film} hidePremiere className="px-0" />
                        </div>
                    );
                })}
            </div>

            <Pagination pageCount={pagination.pageCount || 0} totalCount={pagination.totalCount || 0} initialPage={page - 1} />

        </div>
    </div >;
}

export const getServerSideProps = withSession(async function ({ req, res, query: { page = 1, sort = "newest" }, locale }) {
    const user = req.session.get('user') || null;

    let params = {};

    if (user) {
        params = {
            "headers": {
                "Authorization": "Bearer " + user.token
            }
        };
    }

    try {
        let data = await get(`film/index?page=${page}&limit=16&sort=${sort}`, params);

        return {
            props: {
                ...(await serverSideTranslations(locale, ['common'])),
                data,
                user
            }
        };
    } catch (ex) {
        return {
            props: {
                ...(await serverSideTranslations(locale, ['common'])),
                data: {
                    models: [],
                    pagination
                },
                user
            }
        };
    }
});