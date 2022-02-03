import { useRouter } from 'next/router';
import React from 'react';
import { useTranslation } from 'next-i18next';
import useSWR from 'swr';
import AccountLayout from '../../components/AccountLayout';
import Empty from '../../components/Empty';
import AdvancedChartItem from '../../components/items/AdvancedChartItem';
import AccountFavoriteNavbar from '../../components/navbars/AccountFavoriteNavbar';
import Pagination from '../../components/Pagination';
import AccountSidebar from '../../components/sidebars/AccountSidebar';
import { get } from '../../utils/request';
import withSession from '../../utils/session';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function Music(props) {
    const { t, i18n } = useTranslation();

    const router = useRouter();

    const { page = 1 } = router.query;

    const { data, mutate } = useSWR(`account/music?page=${page}`, get, { initialData: props.data });

    return (
        <AccountLayout>
            <div className="container min-view">
                <h1 className="big-header font-weight-400">{t("Профиль")}</h1>

                <div className="row">
                    <div className="col-md-3">
                        <AccountSidebar />
                    </div>
                    <div className="col-md-9">
                        {data.models.length === 0 && <Empty text={t("Здесь пока пусто, Вы ещё не отметили трек как понравившиеся.")} />}

                        {data.models.length > 0 && <ul className="chart-list w-100">
                            <li className="advanced  chart-header">
                                <div className="d-flex justify-content-between">
                                    <div className={"number flex-wrap align-items-center align-content-center"}>

                                    </div>
                                    <div className="d-flex flex-grow-1 align-items-center details">
                                        <div className="simulate-img me-2"></div>
                                        <div className="info align-items-center">
                                            <div className="artist-name d-block">
                                                <a className="composition-name">{t("Название")}</a>
                                            </div>
                                            <div className="artists hide-on-991">
                                                <a className="composition-name">{t("Исполнитель")}</a>
                                            </div>

                                        </div>

                                    </div>
                                    <div className="d-flex align-items-center tools ">

                                    </div>
                                    <div className="d-flex align-items-center justify-content-center time-box">
                                        <span className="time">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                                <path d="M8.94609 0C4.18637 0 0.332031 3.864 0.332031 8.625C0.332031 13.386 4.18637 17.25 8.94609 17.25C13.7144 17.25 17.5774 13.386 17.5774 8.625C17.5774 3.864 13.7144 0 8.94609 0ZM8.95472 15.525C5.14349 15.525 2.05657 12.4373 2.05657 8.625C2.05657 4.81275 5.14349 1.725 8.95472 1.725C12.7659 1.725 15.8529 4.81275 15.8529 8.625C15.8529 12.4373 12.7659 15.525 8.95472 15.525ZM8.76502 4.3125H8.71328C8.36837 4.3125 8.09245 4.5885 8.09245 4.9335V9.0045C8.09245 9.30637 8.24766 9.591 8.51496 9.74625L12.0934 11.8939C12.3865 12.0664 12.7659 11.9801 12.9384 11.6869C13.1195 11.3936 13.0246 11.0055 12.7228 10.833L9.38585 8.84925V4.9335C9.38585 4.5885 9.10993 4.3125 8.76502 4.3125Z" fill="#4F4F4F" />
                                            </svg>
                                        </span>
                                    </div>

                                </div>
                            </li>
                            {data.models.map((model, index) => {
                                return (
                                    <AdvancedChartItem order={index + 1} key={index} model={model} models={data.models} hideTire  mutate={mutate}/>
                                );
                            })}
                        </ul>}

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

        let data = await get(`account/music?page=${page}`, params);

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