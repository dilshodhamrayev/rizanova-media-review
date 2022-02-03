import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { GlobalContext } from './context';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';

export default function AccountLayout({ children }) {
    const globalContext = useContext(GlobalContext);
    const router = useRouter();
    const {t} = useTranslation();

    // if (typeof window !== 'undefined' && globalContext.store.auth.isLoading) {
    //     return <div className={`rizanova-account`}>{children}</div>;
    // }

    // if (typeof window !== 'undefined' && !globalContext.store.auth.isAuth) {
    //     router.push("/");
    // }

    return (
        <div className={`rizanova-account`}>
            <Head>
                <title>{t("Профиль")}</title>
            </Head>
            {children}
        </div>
    )
}