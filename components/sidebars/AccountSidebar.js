import React, { Fragment, useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { GlobalContext } from '../context';
import { Menu, Transition } from '@headlessui/react';
import { SUBSCRIBE } from '../../config';

export default function AccountSidebar() {
    const globalContext = useContext(GlobalContext);

    const router = useRouter();
    const { t, i18n } = useTranslation();

    const menus = [
        {
            name: t("Аккаунт"),
            isActive: router.pathname === "/account",
            link: "/account"
        },
        {
            name: t("Моя музыка"),
            isActive: router.pathname === "/account/my-music",
            link: "/account/my-music"
        },
        {
            name: t("Избранные"),
            isActive: router.pathname.startsWith("/account/save"),
            link: "/account/save"
        },
        {
            name: t("Понравившиеся"),
            isActive: router.pathname.startsWith("/account/favorite"),
            link: "/account/favorite"
        },

    ];

    if (SUBSCRIBE) {
        menus.push(...[{
            name: t("Активные подписки"),
            isActive: router.pathname === "/account/active-subscription",
            link: "/account/active-subscription"
        },
        {
            name: t("Подписки"),
            isActive: router.pathname === "/account/subscription",
            link: "/account/subscription"
        },
        {
            name: t("Оплата"),
            isActive: router.pathname.startsWith("/account/payment"),
            link: "/account/payment"
        }]);
    }

    menus.push(...[{
        name: t("История просмотров"),
        isActive: router.pathname === "/account/history" || router.pathname === "/account/history/serial",
        link: "/account/history"
    },
    {
        name: t("Настройки"),
        isActive: router.pathname === "/account/setting",
        link: "/account/setting"
    }]);

    return (
        <>
            <ul className="sidebar">
                {menus.map((menu, index) => {
                    return (
                        <li key={index}>
                            <Link href={menu.link}>
                                <a className={menu.isActive ? "active" : ""}>{menu.name}</a>
                            </Link>
                        </li>
                    );
                })}
                <li className="mt-2">
                    <a role="button" className="btn-spec btn-spec-smaller" onClick={() => globalContext.logout()}>
                        <div className="d-flex align-items-center">
                            <svg className="me-2" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 18 18" >
                                <path d="M7.79 13.29C8.18 13.68 8.81 13.68 9.2 13.29L12.79 9.7C13.18 9.31 13.18 8.68 12.79 8.29L9.2 4.7C8.81 4.31 8.18 4.31 7.79 4.7C7.4 5.09 7.4 5.72 7.79 6.11L9.67 8H1C0.45 8 0 8.45 0 9C0 9.55 0.45 10 1 10H9.67L7.79 11.88C7.4 12.27 7.41 12.91 7.79 13.29ZM16 0H2C0.89 0 0 0.9 0 2V5C0 5.55 0.45 6 1 6C1.55 6 2 5.55 2 5V3C2 2.45 2.45 2 3 2H15C15.55 2 16 2.45 16 3V15C16 15.55 15.55 16 15 16H3C2.45 16 2 15.55 2 15V13C2 12.45 1.55 12 1 12C0.45 12 0 12.45 0 13V16C0 17.1 0.9 18 2 18H16C17.1 18 18 17.1 18 16V2C18 0.9 17.1 0 16 0Z" />
                            </svg>
                            <span>{t("Выйти")}</span>
                        </div>

                    </a>
                </li>
                <li>
                    <div className="passport">
                        <div className="d-flex align-items-center">
                            <div className="label">RizaNova ID:</div>
                            <div className="value id">{globalContext.store.auth.user?.id}</div>
                        </div>
                        {SUBSCRIBE && <div className="d-flex">
                            <div className="label">{t("Баланс")}:</div>
                            <div className="value">{Number.parseInt(globalContext.store.auth.user?.balance.toString())} {t("сум")}</div>
                        </div>}
                    </div>
                </li>
            </ul>

            <Menu as="div" className={"relative sidebar-mobile scale-anim"}>
                <Menu.Button className="select-menu w-100 d-flex justify-content-between align-items-center">
                    <span>
                        {menus.find(menu => menu.isActive)?.name}
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M8.12 9.28957L12 13.1696L15.88 9.28957C16.27 8.89957 16.9 8.89957 17.29 9.28957C17.68 9.67957 17.68 10.3096 17.29 10.6996L12.7 15.2896C12.31 15.6796 11.68 15.6796 11.29 15.2896L6.7 10.6996C6.31 10.3096 6.31 9.67957 6.7 9.28957C7.09 8.90957 7.73 8.89957 8.12 9.28957Z" fill="#4F4F4F" />
                    </svg>
                </Menu.Button>

                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items className="absolute left-0 mt-2 origin-top-right menu-content">
                        {menus.map((menu, index) => {
                            return (
                                <Menu.Item key={index}>
                                    {({ active }) => (
                                        <button className={"w-100 " + (menu.isActive ? "active" : "")} onClick={() => {
                                            router.push(menu.link);
                                        }}>
                                            {menu.name}
                                        </button>
                                    )}
                                </Menu.Item>
                            );
                        })}
                        <Menu.Item >
                            {({ active }) => (
                                <button className={"w-100"} onClick={() => {
                                    globalContext.logout();
                                }}>
                                    {t("Выйти")}
                                </button>
                            )}
                        </Menu.Item>
                    </Menu.Items>
                </Transition>
            </Menu>
        </>
    );
}