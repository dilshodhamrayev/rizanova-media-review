import React, { useContext } from 'react';
import { useTranslation } from 'next-i18next';
import useSWR from 'swr';
import Empty from '../../components/Empty';
import AccountSidebar from '../../components/sidebars/AccountSidebar';
import { get, post } from '../../utils/request';
import withSession from '../../utils/session';
import Link from 'next/link';
import AccountLayout from '../../components/AccountLayout';
import { GlobalContext } from '../../components/context';
import moment from 'moment';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Switch from "react-switch";
import { toast } from 'react-toastify';

export default function ActiveSubscription(props) {
    const globalContext = useContext(GlobalContext);

    const { t, i18n } = useTranslation();

    let { data: models, mutate } = useSWR(`subscription/active`, get, { initialData: props.models });

    return (
        <AccountLayout>
            <div className="container min-view">
                <h1 className="big-header font-weight-400">{t("Профиль")}</h1>

                <div className="row">
                    <div className="col-md-4 col-lg-3">
                        <AccountSidebar />
                    </div>
                    <div className="col-md-8 col-lg-9">
                        <h1 className="title-1 mt-0">{t("Активные подписки")}</h1>

                        {models.length === 0 && (<Empty text={t("Подписок пока нет")} />)}

                        {models.length > 0 && <div className='overlow-x-auto w-100'>
                            <table className="table w-100">
                                <thead>
                                    <tr>
                                        <th>{t("Подписка")}</th>
                                        <th>{t("Дата оформления")}</th>
                                        <th>{t("До")}</th>
                                        <th>{t("Статус")}</th>
                                        <th>{t("Автопродление")}</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {models.map((model, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>
                                                    <Link href={`/subscription/${model.id}`}>
                                                        <a>
                                                            {model.name}
                                                        </a>
                                                    </Link>
                                                </td>
                                                <td>
                                                    {moment(model.created_at, "YYYY-MM-DD H:m:s").format("DD.MM.YYYY / HH:mm")}
                                                </td>
                                                <td>
                                                    {moment(model.expiry_date, "YYYY-MM-DD H:m:s").format("DD.MM.YYYY / HH:mm")}
                                                </td>
                                                <td>
                                                    {model.status == 1 ? (
                                                        <span className="text-success">{t("Активен")}</span>
                                                    ) : (
                                                        <span className="text-danger">{t("Не активен")}</span>
                                                    )}
                                                </td>
                                                <td>
                                                    {model.status == 1 && (
                                                        <Switch id="switch-theme" checkedIcon={false} uncheckedIcon={false} onColor="#EF225D" offColor="#E0E0E0" onChange={async (e) => {
                                                            let res = await get(`subscription/handle-active?id=${model.real_id}&action=${e ? 1 : 0}`);
                                                            if (res.status == "success") {
                                                                if (res.value == 1) {
                                                                    toast.success(t("Автопродление включено"), { toastId: "activate-subscription", updateId: "activate-subscription" });
                                                                } else {
                                                                    toast.success(t("Автопродление отключено"), { toastId: "activate-subscription", updateId: "activate-subscription" });
                                                                }
                                                            }
                                                            mutate();
                                                        }} checked={model.renew == 1} />
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>}
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

        let models = await get(`subscription/active`, params);

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