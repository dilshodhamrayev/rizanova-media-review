import { useRouter } from 'next/router';
import React from 'react';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';

export default function AccountPaymentNavbar() {
    const router = useRouter();
    const {t, i18n} = useTranslation();

    return (
        <nav className="favorite">
            <Link href="/account/payment/card">
                <a className={router.pathname === "/account/payment/card" ? 'active' : ''}>{t("Карта")}</a>
            </Link>
            <Link href="/account/payment">
                <a className={router.pathname === "/account/payment" ? 'active' : ''}>{t("Пополнение баланса")}</a>
            </Link>
        </nav>
    );
}