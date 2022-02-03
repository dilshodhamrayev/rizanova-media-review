import { useRouter } from 'next/router';
import React from 'react';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';

export default function AccountSaveNavbar() {
    const router = useRouter();
    const {t, i18n} = useTranslation();

    return (
        <nav className="favorite">
            <Link href="/account/save">
                <a className={router.pathname === "/account/save" ? 'active' : ''}>{t("Клипы")}</a>
            </Link>
            <Link href="/account/save/film">
                <a className={router.pathname === "/account/save/film" ? 'active' : ''}>{t("Фильмы")}</a>
            </Link>
            <Link href="/account/save/telenovella">
                <a className={router.pathname === "/account/save/telenovella" ? 'active' : ''}>{t("Теленовелла")}</a>
            </Link>
            <Link href="/account/save/serial">
                <a className={router.pathname === "/account/save/serial" ? 'active' : ''}>{t("Сериалы")}</a>
            </Link>
            <Link href="/account/save/humor">
                <a className={router.pathname === "/account/save/humor" ? 'active' : ''}>{t("Юмор")}</a>
            </Link>
            <Link href="/account/save/concert">
                <a className={router.pathname === "/account/save/concert" ? 'active' : ''}>{t("Концерты")}</a>
            </Link>
        </nav>
    );
}