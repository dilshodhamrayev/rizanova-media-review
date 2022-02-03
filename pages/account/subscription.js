import Head from 'next/head';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'next-i18next';
import useSWR from 'swr';
import Empty from '../../components/Empty';
import AccountSidebar from '../../components/sidebars/AccountSidebar';
import { get, post } from '../../utils/request';
import withSession from '../../utils/session';
import Link from 'next/link';
import AccountLayout from '../../components/AccountLayout';
import { GlobalContext } from '../../components/context';
import TariffButton from '../../components/buttons/TariffButton';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function Subscription(props) {
    const globalContext = useContext(GlobalContext);

    const { t, i18n } = useTranslation();

    let { data: models, mutate } = useSWR(`subscription/index`, get, { initialData: props.models });

    return (
        <AccountLayout>
            <div className="container min-view">
                <h1 className="big-header font-weight-400">{t("Профиль")}</h1>

                <div className="row">
                    <div className="col-md-4 col-lg-3">
                        <AccountSidebar />
                    </div>
                    <div className="col-md-8 col-lg-9">
                        <h1 className="title-1 mt-0">{t("Подписки")}</h1>

                        {models.length === 0 && (<Empty text={t("Подписок пока нет")} />)}

                        {models.map((model, index) => {
                            return (
                                <div className="subscription" style={{ backgroundImage: `url(${model.image_path})` }} key={index}>
                                    <div className="position-relative">
                                        <Link href={`/subscription/${model.id}`}>
                                            <a href="">
                                                <h3 className="title-1 m-0">{t("Подписка")} {model.name}</h3>
                                            </a>
                                        </Link>
                                        <p className="sub-title my-3">{model['subtitle_' + i18n.language]}</p>

                                        <ul className="ul-type-1">
                                            {model['description_' + i18n.language]?.split("\n").map((feature, i) => {
                                                return (
                                                    <li key={i}>{feature}</li>
                                                );
                                            })}
                                        </ul>

                                        <div className="mt-md-5 mt-3">
                                            <TariffButton model={model} mutate={mutate} />

                                            <Link href={`/subscription/${model.id}`}>
                                                <a className="btn-outline border-radius-4 mb-3">{t("Подробнее")}</a>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </AccountLayout>
    );
}

export const getServerSideProps = withSession(async function ({ req, res, locale }) {
    const user = req.session.get('user');

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

        let models = await get(`subscription/index`, params);

        return {
            props: {
                ...(await serverSideTranslations(locale, ['common'])),
                models,
                user
            }
        };
    } catch (ex) {
        return {
            props: {
                ...(await serverSideTranslations(locale, ['common'])),
                models: [],
                user
            },
        };
    };
});