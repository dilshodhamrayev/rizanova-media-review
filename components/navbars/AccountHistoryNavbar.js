import { useRouter } from 'next/router';
import React from 'react';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';

export default function AccountHistoryNavbar() {
    const router = useRouter();
    const {t, i18n} = useTranslation();

    return (
        <nav className="favorite">
            <Link href="/account/history">
                <a className={router.pathname === "/account/history" ? 'active' : ''}>{t("Фильмы")}</a>
            </Link>
            <Link href="/account/history/serial">
                <a className={router.pathname === "/account/history/serial" ? 'active' : ''}>{t("Сериалы")}</a>
            </Link>
        </nav>
    );
}