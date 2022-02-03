import { Fragment, useContext } from "react";
import { useTranslation } from "next-i18next";
import AccountLayout from "../../components/AccountLayout";
import { GlobalContext } from "../../components/context";
import AccountSidebar from "../../components/sidebars/AccountSidebar";
import { DARK_THEME, WHITE_THEME } from "../../reducers/themeReducer";
import { Menu, Transition } from '@headlessui/react';
import { useRouter } from "next/router";
import withSession from "../../utils/session";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function Setting() {
    const { t, i18n } = useTranslation();

    const globalContext = useContext(GlobalContext);

    const handleTheme = (theme) => {
        globalContext.changeTheme(theme);
    }

    const router = useRouter();

    return (
        <AccountLayout>
            <div className="container min-view ">
                <h1 className="big-header font-weight-400">{t("Профиль")}</h1>

                <div className="row">
                    <div className="col-md-4 col-lg-3">
                        <AccountSidebar />
                    </div>
                    <div className="col-md-8 col-lg-9">
                        <h1 className="title-1 mt-0">{t("Настройки")}</h1>

                        <div className="setting">
                            <div className="d-flex flex-wrap flex-sm-nowrap">
                                <div className="label d-flex align-items-end">
                                    {t("Тема")}:
                                </div>

                                <a role="button" className={"theme " + (globalContext.store.theme === WHITE_THEME ? 'active' : '')} onClick={() => {
                                    handleTheme(WHITE_THEME);
                                }}>
                                    <div className="image">
                                        <img src="/image/theme-light.jpg" />
                                    </div>
                                    <div className="title">Light</div>
                                </a>

                                <a role="button" className={"theme " + (globalContext.store.theme === DARK_THEME ? 'active' : '')} onClick={() => {
                                    handleTheme(DARK_THEME);
                                }}>
                                    <div className="image">
                                        <img src="/image/theme-dark.jpg" />
                                    </div>
                                    <div className="title">Dark</div>
                                </a>
                            </div>
                            <div className="d-flex flex-wrap flex-sm-nowrap mt-3 pt-3 mt-md-5 pt-lg-4 align-items-center">
                                <div className="label d-flex align-items-end mb-sm-0">
                                    {t("Язык")}:
                                </div>

                                <Menu as="div" className={"relative "}>
                                    <Menu.Button className="select-menu d-flex justify-content-between align-items-center">
                                        <span>
                                            {i18n.language == 'ru' ? 'Русский' : "O‘zbekcha"}
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
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button className={"w-100 " + (i18n.language == "ru" ? "active" : "")} onClick={() => {
                                                        globalContext.changeLang("ru");
                                                    }}>
                                                        {t("Русский")}
                                                    </button>
                                                )}
                                            </Menu.Item>
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button className={"w-100 " + (i18n.language == "uz" ? "active" : "")} onClick={() => {
                                                        globalContext.changeLang("uz");
                                                    }}>
                                                        {t("O‘zbekcha")}
                                                    </button>
                                                )}
                                            </Menu.Item>
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            </div>
                        </div>
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

    return {
        props: { user, ...(await serverSideTranslations(locale, ['common'])) },
    }
});