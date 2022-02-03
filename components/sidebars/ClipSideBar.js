import React, { Fragment } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { Menu, Transition } from '@headlessui/react';

export default function ClipSideBar() {
    const router = useRouter();
    const {t, i18n} = useTranslation();

    const menus = [
        {
            name: t("Все"),
            isActive: router.pathname === "/clip",
            link: "/clip"
        },
        {
            name: t("Премьера"),
            isActive: router.pathname === "/clip/premiere",
            link: "/clip/premiere"
        },
        {
            name: t("Исполнители"),
            isActive: router.pathname === "/clip/singer",
            link: "/clip/singer"
        },
    ];

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
            </ul>

            <Menu as="div" className={"relative sidebar-mobile"}>
                <Menu.Button className="select-menu w-100 d-flex justify-content-between align-items-center">
                    <span>
                        {menus.find(menu => menu.isActive).name}
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
                    </Menu.Items>
                </Transition>
            </Menu>
        </>
    );
}