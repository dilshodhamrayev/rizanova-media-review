import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { useTranslation } from 'next-i18next';
import useSWR from 'swr';
import AccountLayout from '../../../components/AccountLayout';
import Empty from '../../../components/Empty';
import FilmItem from '../../../components/items/FilmItem';
import AccountFavoriteNavbar from '../../../components/navbars/AccountFavoriteNavbar';
import AccountSaveNavbar from '../../../components/navbars/AccountSaveNavbar';
import Pagination from '../../../components/Pagination';
import AccountSidebar from '../../../components/sidebars/AccountSidebar';
import { get } from '../../../utils/request';
import withSession from '../../../utils/session';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function Telenovella(props) {
    const { t, i18n } = useTranslation();

    const router = useRouter();

    const { page = 1 } = router.query;

    const { data } = useSWR(`account/telenovella?page=${page}&type=save`, get, { initialData: props.data });

    return (
        <AccountLayout>
            <div className="container min-view inner-page">
                <h1 className="big-header font-weight-400">{t("Профиль")}</h1>

                <div className="row">
                    <div className="col-md-3">
                        <AccountSidebar />
                    </div>
                    <div className="col-md-9">
                        <AccountSaveNavbar />

                        {data.models.length === 0 && <Empty text={t("Здесь пока пусто, Вы ещё не добавили видео в плейлист \"смотреть позже\".")} />}
                        <div className="row border-radius-4 padding-0 ">

                            {data.models.map((model, index) => {
                                return (
                                    <div className="col-lg-4 col-md-6 col-6 mb-4" key={index}>
                                        <FilmItem model={model} hidePremiere className="px-0" link="telenovella" />
                                    </div>
                                );
                            })}
                        </div>

                        <Pagination pageCount={data.pagination.pageCount || 0} totalCount={data.pagination.totalCount || 0} initialPage={page - 1} />
                    </div>
                </div>
            </div>
        </AccountLayout>
    )
}

export const getServerSideProps = withSession(async function ({ req, res, query: { page = 1 }, locale }) {
    const user = req.session.get('user') || null;

    if (!user) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        }
    }

    try {

        let params = {};

        if (user) {
            params = {
                "headers": {
                    "Authorization": "Bearer " + user.token
                }
            };
        }

        let data = await get(`account/telenovella?page=${page}&type=save`, params);

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
                    singers: [],
                    pagination: {},
                    user
                },
            }
        };
    }
});