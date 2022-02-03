import { useRouter } from 'next/router';
import React from 'react';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';

export default function AccountFavoriteNavbar() {
    const router = useRouter();
    const {t, i18n} = useTranslation();

    return (
        <nav className="favorite">
            <Link href="/account/favorite">
                <a className={router.pathname === "/account/favorite" ? 'active' : ''}>{t("Клипы")}</a>
            </Link>
            <Link href="/account/favorite/album">
                <a className={router.pathname === "/account/favorite/album" ? 'active' : ''}>{t("Альбомы")}</a>
            </Link>
            <Link href="/account/favorite/film">
                <a className={router.pathname === "/account/favorite/film" ? 'active' : ''}>{t("Фильмы")}</a>
            </Link>
            <Link href="/account/favorite/telenovella">
                <a className={router.pathname === "/account/favorite/telenovella" ? 'active' : ''}>{t("Теленовелла")}</a>
            </Link>
            <Link href="/account/favorite/serial">
                <a className={router.pathname === "/account/favorite/serial" ? 'active' : ''}>{t("Сериалы")}</a>
            </Link>
            <Link href="/account/favorite/humor">
                <a className={router.pathname === "/account/favorite/humor" ? 'active' : ''}>{t("Юмор")}</a>
            </Link>
            <Link href="/account/favorite/concert">
                <a className={router.pathname === "/account/favorite/concert" ? 'active' : ''}>{t("Концерты")}</a>
            </Link>
        </nav>
    );
}