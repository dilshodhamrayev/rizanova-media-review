import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { useTranslation } from "next-i18next";
import { toast } from "react-toastify";
import useSWR from "swr";
import FilmItem from "../../../components/items/FilmItem";
import Pagination from "../../../components/Pagination";
import { get } from "../../../utils/request";
import withSession from "../../../utils/session";
import Link from 'next/link';
import Image from 'next/image';
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function Search(props) {
    const router = useRouter();
    const { t, i18n } = useTranslation();

    const { page = 1, query } = router.query;

    const [value, setValue] = useState(query);

    const { data: singers } = useSWR(`person/index?q=${encodeURIComponent(query)}&page=${page}`, get, { initialData: props.singers });

    const title = t("Поиск исполнителей по сайту RizaNova");
    const description = t("Поиск узбекских треков, альбомов, фильмов, клипов, сериалов, концертов и юморов на сайте RizaNova.");
    const keywords = t("узбекские фильм фильмы сериал сериалы клип клипы музыка музыки трек треки альбом альбомы концерт концерты исполнители актер актеры актриса режиссер сценарист фото фотография постер");

    return (
        <div className="search-page">
            <Head>
                <title>{title}</title>
                <meta property="og:title" content={title} />
                <meta name="description" content={description} />
                <meta property="og:description" content={description} />
                <meta name="keywords" content={keywords} />
            </Head>

            <div className="container min-view inner-page">
                <ul className="breadcrumbs">
                    <li><Link href="/"><a>{t("Главная")}</a></Link></li>
                    <li><span>/</span></li>
                    <li><Link href={`/search/${encodeURIComponent(query)}`}><a>{t("Поиск по сайту")}</a></Link></li>
                    <li><span>/</span></li>
                    <li><p>{t("Поиск исполнителей")}</p></li>
                </ul>

                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className={'search-form w-100'}>
                            <form onSubmit={(e) => {
                                e.preventDefault();

                                if (value.length > 1) {
                                    router.push(`/search/singer/${encodeURIComponent(value)}`);
                                } else {
                                    toast.info(t("Пожалуйста, введите не менее 2 букв для поиска"), { toastId: 1 });
                                }
                            }} className='h-100 d-flex'>
                                <input type="text" placeholder={t("Поиск")} value={value} onChange={(e) => {
                                    setValue(e.target.value);
                                }} />
                                <button>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M15.5 13.9999H14.71L14.43 13.7299C15.63 12.3299 16.25 10.4199 15.91 8.38989C15.44 5.60989 13.12 3.38989 10.32 3.04989C6.09001 2.52989 2.53002 6.08989 3.05002 10.3199C3.39002 13.1199 5.61002 15.4399 8.39002 15.9099C10.42 16.2499 12.33 15.6299 13.73 14.4299L14 14.7099V15.4999L18.25 19.7499C18.66 20.1599 19.33 20.1599 19.74 19.7499C20.15 19.3399 20.15 18.6699 19.74 18.2599L15.5 13.9999ZM9.50002 13.9999C7.01002 13.9999 5.00002 11.9899 5.00002 9.49989C5.00002 7.00989 7.01002 4.99989 9.50002 4.99989C11.99 4.99989 14 7.00989 14 9.49989C14 11.9899 11.99 13.9999 9.50002 13.9999Z" fill="#828282" />
                                    </svg>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                <h1 className="title-2 mt-0">{t("Персоны по запросу")} <span className="font-weight-400">«{query}»</span></h1>
                {singers.models.length == 0 && <h1 className="title-2 mt-0 text-center">{t("Ничего не найдено")}</h1>}

                <div className="row">
                    {singers.models.map((model, index) => {
                        return (
                            <div className="col-6 col-md-4 col-lg-3 mb-4" key={index}>
                                <div className="music-item singer-item" key={index}>
                                    <Link href={`/person/` + model.id}>
                                        <a>
                                            <div className="image rounded-circle singer-image">
                                                <Image src={model.image_path} className="w-100" alt={model.name} width={256} height={256} layout="responsive" unoptimized loading='lazy' />
                                            </div>
                                        </a>
                                    </Link>
                                    <div className="title text-center">
                                        <Link href={`/person/` + model.id}>
                                            <a>{model.name}</a>
                                        </Link>
                                    </div>

                                </div>
                            </div>
                        );
                    })}
                </div>

                <Pagination pageCount={singers.pagination.pageCount || 0} totalCount={singers.pagination.totalCount || 0} initialPage={page - 1} pathname={`/search/person/${encodeURIComponent(query)}`} />
            </div>
        </div>
    );
}

export const getServerSideProps = withSession(async function ({ req, res, query: { query, page = 1 }, locale }) {
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
        let [singers] = await Promise.all([
            get(`person/index?q=${encodeURIComponent(query)}&page=${page}`, params),
        ]);

        return {
            props: {
                ...(await serverSideTranslations(locale, ['common'])),
                singers,
                user
            }
        };
    } catch (ex) {
        return {
            props: {
                ...(await serverSideTranslations(locale, ['common'])),
                singers: [],
                user
            }
        };
    }
});