import React, { useContext, useState } from 'react';
import Head from 'next/head';
import AccountLayout from '../../components/AccountLayout';
import AccountSidebar from '../../components/sidebars/AccountSidebar';
import { useTranslation } from 'next-i18next';
import { GlobalContext } from '../../components/context';
import withSession from '../../utils/session';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import PasswordModal from '../../components/modals/PasswordModal';
import { SUBSCRIBE } from '../../config';

export default function Index({ user }) {

    const { t, i18n } = useTranslation();
    const globalContext = useContext(GlobalContext);

    const [isPasswordModalOpen, setIsPasswodModalOpen] = useState(false);

    return <AccountLayout>
        <div>
            <div className="container min-view">
                <h1 className="big-header font-weight-400">{t("Профиль")}</h1>

                <div className="row">
                    <div className="col-lg-3 col-md-4">
                        <AccountSidebar />
                    </div>
                    <div className="col-lg-9 col-md-8 d-flexjustify-content-center">
                        <div className="profile w-100">
                            <div className="row justify-content-center">
                                <div className="col-xl-10 col-lg-10">
                                    <div className="row">
                                        <div className="col-md-3 d-flex flex-wrap align-items-center">
                                            <div className="first-letter w-100">
                                                {globalContext.store.auth.user?.full_name[0]?.toUpperCase()}
                                            </div>
                                        </div>
                                        <div className="col-md-9 d-flex align-items-center">
                                            <div className="detail">
                                                <div className="d-flex">
                                                    <div className="label">{t("Имя")}:</div>
                                                    <div className="value">{globalContext.store.auth.user?.full_name}</div>
                                                </div>
                                                <div className="d-flex">
                                                    <div className="label">{t("Логин")}:</div>
                                                    <div className="value">{globalContext.store.auth.user?.username}</div>
                                                </div>
                                                {globalContext.store.auth.user?.email && globalContext.store.auth.user?.username != globalContext.store.auth.user?.email && <div className="d-flex">
                                                    <div className="label">{t("Почта")}:</div>
                                                    <div className="value">{globalContext.store.auth.user?.email}</div>
                                                </div>}
                                                <div className="d-flex">
                                                    <div className="label">{t("Дата регистрации")}:</div>
                                                    <div className="value">{globalContext.store.auth.user?.created_at}</div>
                                                </div>
                                                <div className="d-flex">
                                                    <div className="label">RizaNova ID:</div>
                                                    <div className="value">{globalContext.store.auth.user?.id}</div>
                                                </div>
                                                {SUBSCRIBE && <div className="d-flex">
                                                    <div className="label">{t("Баланс")}:</div>
                                                    <div className="value">{Number.parseInt(globalContext.store.auth.user?.balance.toString())} {t("сум")}</div>
                                                </div>}
                                                <div className="d-flex">
                                                    <div className="label">
                                                        <a role="button" className='theme-thing' onClick={() => {
                                                            setIsPasswodModalOpen(true);
                                                        }}>{t("Сменить пароль")}</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <PasswordModal isOpen={isPasswordModalOpen} setIsOpen={setIsPasswodModalOpen} />
        </div>
    </AccountLayout>;
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

    return {
        props: { user, ...(await serverSideTranslations(locale, ['common'])) },
    }
});