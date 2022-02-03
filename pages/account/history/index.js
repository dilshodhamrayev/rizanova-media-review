import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { useTranslation } from 'next-i18next';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import AccountLayout from '../../../components/AccountLayout';
import Empty from '../../../components/Empty';
import FilmItem from '../../../components/items/FilmItem';
import AccountHistoryNavbar from '../../../components/navbars/AccountHistoryNavbar';
import Pagination from '../../../components/Pagination';
import AccountSidebar from '../../../components/sidebars/AccountSidebar';
import { get } from '../../../utils/request';
import withSession from '../../../utils/session';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function Film(props) {
    const { t, i18n } = useTranslation();

    const router = useRouter();

    const { page = 1 } = router.query;

    const { data, mutate } = useSWR(`account/history?type=film&page=${page}`, get, { initialData: props.data });

    const clearHistory = async () => {
        let res = await get('account/clear-history?type=film');

        if (res.status == "success") {
            toast.success(t("История успешно очищена"));
            mutate();
        }
    }

    return (
        <AccountLayout>
            <div className="container min-view inner-page">
                <h1 className="big-header font-weight-400">{t("Профиль")}</h1>

                <div className="row">
                    <div className="col-md-3">
                        <AccountSidebar />
                    </div>
                    <div className="col-md-9">
                        <AccountHistoryNavbar />
                        {data.models.length === 0 && <Empty text={t("Здесь пока пусто, Вы ещё не смотрели видео.")} />}
                        <div className="row border-radius-4 padding-0 ">

                            {data.models.map((model, index) => {
                                return (
                                    <div className="col-lg-4 col-md-6 col-6 mb-4" key={index}>
                                        <FilmItem model={model} hidePremiere className="px-0" />
                                    </div>
                                );
                            })}
                        </div>

                        <Pagination pageCount={data.pagination.pageCount || 0} totalCount={data.pagination.totalCount || 0} initialPage={page - 1} />

                        {data.models.length > 0 && (
                            <div className="text-end mt-4">
                                <a role="button" className="clear-history d-inline-flex align-items-center" onClick={clearHistory}>
                                    <svg className="me-2" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14">
                                        <path d="M13.3002 0.709971C12.9102 0.319971 12.2802 0.319971 11.8902 0.709971L7.00022 5.58997L2.11022 0.699971C1.72022 0.309971 1.09021 0.309971 0.700215 0.699971C0.310215 1.08997 0.310215 1.71997 0.700215 2.10997L5.59022 6.99997L0.700215 11.89C0.310215 12.28 0.310215 12.91 0.700215 13.3C1.09021 13.69 1.72022 13.69 2.11022 13.3L7.00022 8.40997L11.8902 13.3C12.2802 13.69 12.9102 13.69 13.3002 13.3C13.6902 12.91 13.6902 12.28 13.3002 11.89L8.41021 6.99997L13.3002 2.10997C13.6802 1.72997 13.6802 1.08997 13.3002 0.709971Z" fill="#131313" />
                                    </svg>
                                    {t("Очистить всю историю")}
                                </a>
                            </div>
                        )}

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

        let data = await get(`account/history?type=film&page=${page}`, params);

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