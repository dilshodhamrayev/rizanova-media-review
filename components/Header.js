import React, { useContext, useState, Fragment } from 'react';
import { DARK_THEME, WHITE_THEME } from '../reducers/themeReducer';
import { GlobalContext } from './context';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import LoginModal from './modals/LoginModal';
import RegisterModal from './modals/RegisterModal';
import Switch from "react-switch";
import { Menu, Transition } from '@headlessui/react';
import { useRouter } from 'next/router';
import SearchForm from './forms/SearchForm';
import useUser from '../utils/useUser';
import ActiveLink from './ActiveLink';
import { SUBSCRIBE } from '../config';

export default function Header() {
    const globalContext = useContext(GlobalContext);

    const { user, mutate } = useUser();

    const router = useRouter();

    const { t, i18n } = useTranslation();

    const handleTheme = (e) => {
        globalContext.changeTheme(e === true ? DARK_THEME : WHITE_THEME);
    }

    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);

    const handleShowLogin = () => setIsLoginOpen(true);

    const showRegister = () => {
        setIsLoginOpen(false);
        setIsRegisterOpen(true);
    }

    const showLogin = () => {
        setIsLoginOpen(true);
        setIsRegisterOpen(false);
    }

    return (
        <header className={"main " + (isSearchOpen ? 'search-open' : '')}>
            <nav className="navbar">
                <div className="container">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="logo d-flex align-items-center">
                            <Link href="/">
                                <a>
                                    <svg width="165" height="40" viewBox="0 0 165 40" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd"
                                            d="M0 12.5014V37.9964C0 39.6265 1.84542 40.5719 3.16841 39.6196L28.3416 21.4997C32.5071 18.0766 34.2419 8.18974 27.3721 2.81221C23.8917 0.0878355 19.1481 1.63831e-05 14.7283 1.03918e-05L6.19337 0C4.67246 0 3.08157 0.0994002 1.87687 1.02778C0.942838 1.74757 0.132437 2.81182 0.132437 4.19002C0.132437 5.73443 0.0874077 7.94027 0.0491217 9.81577C0.0274693 10.8764 0.00797371 11.8315 0 12.5014ZM8.93848 35.285V16.074C8.93848 14.8522 9.13915 13.6131 9.83511 12.609C11.3145 10.4745 14.1715 8.12957 18.3415 9.16306C24.7647 11.1462 21.3214 16.2748 20.7254 16.9586C20.6876 17.002 20.6453 17.0527 20.5979 17.1097C19.8964 17.9516 18.0637 20.1509 12.9778 19.8307V32.413L8.93848 35.285Z"
                                            fill="#EF225D" />
                                        <ellipse cx="27.0555" cy="34.0122" rx="4.47059" ry="4.64915" fill="#EF225D" />
                                        <path className="riza"
                                            d="M62.08 31.5789H57.3498L52.164 22.8421H48.0995V31.5789H44V8.17544H54.2664C56.5556 8.17544 58.401 8.8538 59.8025 10.2105C61.2041 11.5673 61.9048 13.3333 61.9048 15.5088C61.9048 17.4737 61.3676 19.0526 60.2931 20.2456C59.2185 21.4152 57.9104 22.1287 56.3687 22.386L62.08 31.5789ZM53.7058 19.2281C54.8737 19.2281 55.8314 18.8889 56.5789 18.2105C57.3264 17.5322 57.7002 16.6316 57.7002 15.5088C57.7002 14.386 57.3264 13.4854 56.5789 12.807C55.8314 12.1287 54.8737 11.7895 53.7058 11.7895H48.0995V19.2281H53.7058Z"
                                            fill="white" />
                                        <path className="riza"
                                            d="M66.3761 12.5614C65.7688 12.5614 65.2315 12.3392 64.7643 11.8947C64.3205 11.4503 64.0986 10.9123 64.0986 10.2807C64.0986 9.64912 64.3205 9.11111 64.7643 8.66667C65.2315 8.22222 65.7688 8 66.3761 8C67.0068 8 67.5441 8.22222 67.9879 8.66667C68.4317 9.11111 68.6537 9.64912 68.6537 10.2807C68.6537 10.9123 68.4317 11.4503 67.9879 11.8947C67.5441 12.3392 67.0068 12.5614 66.3761 12.5614ZM68.2332 31.5789H64.5541V14.6316H68.2332V31.5789Z"
                                            fill="white" />
                                        <path className="riza"
                                            d="M84.3122 31.5789H70.8923V28.807L79 18L70.8923 17.8596V14.6316H84.172V17.3333L75.7277 28.386H84.3122V31.5789Z"
                                            fill="white" />
                                        <path className="riza"
                                            d="M101 31.5789H97.3209V29.7544C96.0128 31.2515 94.1908 32 91.8549 32C90.3131 32 88.9466 31.5088 87.7553 30.5263C86.564 29.5205 85.9683 28.1404 85.9683 26.386C85.9683 24.5848 86.5523 23.2164 87.7203 22.2807C88.9116 21.345 90.2898 20.8772 91.8549 20.8772C94.2609 20.8772 96.0829 21.6023 97.3209 23.0526V20.5263C97.3209 19.5439 96.9589 18.7719 96.2347 18.2105C95.5106 17.6491 94.5529 17.3684 93.3615 17.3684C91.4694 17.3684 89.7992 18.0819 88.351 19.5088L86.8443 16.9474C88.7598 15.1228 91.1307 14.2105 93.9572 14.2105C96.0362 14.2105 97.7297 14.7018 99.0378 15.6842C100.346 16.6667 101 18.2222 101 20.3509V31.5789ZM93.2915 29.4737C95.1368 29.4737 96.48 28.8889 97.3209 27.7193V25.1579C96.48 23.9883 95.1368 23.4035 93.2915 23.4035C92.2403 23.4035 91.376 23.6842 90.6986 24.2456C90.0212 24.807 89.6825 25.5439 89.6825 26.4561C89.6825 27.3684 90.0212 28.1053 90.6986 28.6667C91.376 29.2047 92.2403 29.4737 93.2915 29.4737Z"
                                            fill="white" />
                                        <path className="nova"
                                            d="M120.763 31.6289H119.782L105.981 12.6082V31.6289H105V11H105.981L119.782 29.8351V11H120.763V31.6289Z"
                                            fill="white" />
                                        <path className="nova"
                                            d="M131.04 32C128.995 32 127.329 31.2577 126.041 29.7732C124.774 28.268 124.14 26.3918 124.14 24.1443C124.14 21.9175 124.774 20.0619 126.041 18.5773C127.329 17.0722 128.995 16.3196 131.04 16.3196C133.105 16.3196 134.771 17.0619 136.039 18.5464C137.306 20.0309 137.94 21.8969 137.94 24.1443C137.94 26.3918 137.306 28.268 136.039 29.7732C134.771 31.2577 133.105 32 131.04 32ZM131.04 31.1649C132.859 31.1649 134.291 30.4845 135.333 29.1237C136.396 27.7423 136.928 26.0825 136.928 24.1443C136.928 22.2268 136.396 20.5876 135.333 19.2268C134.291 17.8454 132.859 17.1546 131.04 17.1546C129.241 17.1546 127.81 17.8454 126.746 19.2268C125.683 20.5876 125.152 22.2268 125.152 24.1443C125.152 26.0825 125.683 27.7423 126.746 29.1237C127.81 30.4845 129.241 31.1649 131.04 31.1649Z"
                                            fill="white" />
                                        <path className="nova"
                                            d="M146.373 31.6289H145.3L138.952 16.6907H140.025L145.852 30.5464L151.648 16.6907H152.721L146.373 31.6289Z"
                                            fill="white" />
                                        <path className="nova"
                                            d="M165 31.6289H164.08V29.8041C162.751 31.268 161.044 32 158.959 32C157.568 32 156.352 31.5567 155.309 30.6701C154.287 29.7629 153.776 28.5464 153.776 27.0206C153.776 25.4948 154.287 24.2887 155.309 23.4021C156.331 22.4948 157.548 22.0412 158.959 22.0412C161.044 22.0412 162.751 22.7732 164.08 24.2371V20.866C164.08 19.7113 163.681 18.8041 162.884 18.1443C162.087 17.4845 161.095 17.1546 159.909 17.1546C158.028 17.1546 156.444 17.9381 155.156 19.5052L154.45 18.8866C155.207 18 156.004 17.3505 156.843 16.9381C157.681 16.5258 158.703 16.3196 159.909 16.3196C161.422 16.3196 162.649 16.7113 163.589 17.4948C164.53 18.2577 165 19.3711 165 20.8351V31.6289ZM159.204 31.1649C161.31 31.1649 162.935 30.4021 164.08 28.8763V25.1649C162.935 23.6392 161.31 22.8763 159.204 22.8763C157.875 22.8763 156.802 23.2783 155.984 24.0825C155.186 24.866 154.788 25.8454 154.788 27.0206C154.788 28.1959 155.186 29.1856 155.984 29.9897C156.802 30.7732 157.875 31.1649 159.204 31.1649Z"
                                            fill="white" />
                                    </svg>
                                </a>
                            </Link>
                        </div>

                        <div className={"menu d-flex align-items-center hide-on-767"}>

                            <ul className="nav">
                                <li className="hide-on-767">
                                    <ActiveLink href="/" exact>
                                        <a>{t("Главная")}</a>
                                    </ActiveLink>
                                </li>
                                {/* <li className="hide-on-767">
                                    <ActiveLink href="/premiere">
                                        <a>{t("Премьера")}</a>
                                    </ActiveLink>
                                </li> */}
                                <li className="hide-on-767">
                                    <ActiveLink href="/music">
                                        <a>{t("Музыка")}</a>
                                    </ActiveLink>
                                </li>
                                <li className="hide-on-767">
                                    <ActiveLink href="/clip">
                                        <a>{t("Клипы")}</a>
                                    </ActiveLink>
                                </li>
                                <li className="hide-on-767">
                                    <ActiveLink href="/film">
                                        <a>{t("Фильмы")}</a>
                                    </ActiveLink>
                                </li>
                                <li className="hide-on-991">
                                    <ActiveLink href="/concert">
                                        <a>{t("Концерты")}</a>
                                    </ActiveLink>
                                </li>
                                <li className="hide-on-1200">
                                    <ActiveLink href="/serial">
                                        <a>{t("Сериалы")}</a>
                                    </ActiveLink>
                                </li>
                                <li className="hide-on-1200">
                                    <ActiveLink href="/humor">
                                        <a>{t("Юмор")}</a>
                                    </ActiveLink>
                                </li>
                                <li className="hide-on-1200">
                                    <ActiveLink href="/telenovella">
                                        <a>{t("Теленовелла")}</a>
                                    </ActiveLink>
                                </li>
                            </ul>
                        </div>


                        <div className="hambergur">
                            <Menu as="div" className="relative">
                                <Menu.Button className="hambergur-toggler">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M4 18H20C20.55 18 21 17.55 21 17C21 16.45 20.55 16 20 16H4C3.45 16 3 16.45 3 17C3 17.55 3.45 18 4 18ZM4 13H20C20.55 13 21 12.55 21 12C21 11.45 20.55 11 20 11H4C3.45 11 3 11.45 3 12C3 12.55 3.45 13 4 13ZM3 7C3 7.55 3.45 8 4 8H20C20.55 8 21 7.55 21 7C21 6.45 20.55 6 20 6H4C3.45 6 3 6.45 3 7Z"
                                            fill="white" />
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
                                    <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right">
                                        <ul className="hambergur-menu my-0">
                                            <li>
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <button className="w-100" onClick={() => router.push("/")}>
                                                            {t("Главная")}
                                                        </button>
                                                    )}
                                                </Menu.Item>
                                            </li>
                                            {/* <li>
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <button className="w-100" onClick={() => router.push("/premiere")}>{t("Премьера")}</button>
                                                    )}
                                                </Menu.Item>
                                            </li> */}
                                            <li>
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <button className="w-100" onClick={() => router.push("/music")}>{t("Музыка")}</button>
                                                    )}
                                                </Menu.Item>
                                            </li>
                                            <li>
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <button className="w-100" onClick={() => router.push("/clip")}>{t("Клипы")}</button>
                                                    )}
                                                </Menu.Item>
                                            </li>
                                            <li>
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <button className="w-100" onClick={() => router.push("/film")}>{t("Фильмы")}</button>
                                                    )}
                                                </Menu.Item>
                                            </li>
                                            <li>
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <button className="w-100" onClick={() => router.push("/concert")}>{t("Концерты")}</button>
                                                    )}
                                                </Menu.Item>
                                            </li>
                                            <li>
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <button className="w-100" onClick={() => router.push("/serial")}>{t("Сериалы")}</button>
                                                    )}
                                                </Menu.Item>
                                            </li>
                                            <li>
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <button className="w-100" onClick={() => router.push("/humor")}>{t("Юмор")}</button>
                                                    )}
                                                </Menu.Item>
                                            </li>
                                            <li>
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <button className="w-100" onClick={() => router.push("/telenovella")}>{t("Теленовелла")}</button>
                                                    )}
                                                </Menu.Item>
                                            </li>
                                            <li>
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <button className="w-100" onClick={() => router.push("/music/singer")}>{t("Исполнители")}</button>
                                                    )}
                                                </Menu.Item>
                                            </li>
                                        </ul>
                                    </Menu.Items>
                                </Transition>
                            </Menu>
                        </div>
                        <div className="line"></div>
                        <div className="navbar-tools d-flex align-items-center justify-content-between">
                            <SearchForm isSearchOpen={isSearchOpen} setIsSearchOpen={setIsSearchOpen} />
                            <a role="button" onClick={() => setIsSearchOpen(!isSearchOpen)}>
                                {isSearchOpen ? (
                                    <svg className="search-form-closer" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                        <path className="search-form-closer" d="M13.3 0.709971C12.91 0.319971 12.28 0.319971 11.89 0.709971L6.99997 5.58997L2.10997 0.699971C1.71997 0.309971 1.08997 0.309971 0.699971 0.699971C0.309971 1.08997 0.309971 1.71997 0.699971 2.10997L5.58997 6.99997L0.699971 11.89C0.309971 12.28 0.309971 12.91 0.699971 13.3C1.08997 13.69 1.71997 13.69 2.10997 13.3L6.99997 8.40997L11.89 13.3C12.28 13.69 12.91 13.69 13.3 13.3C13.69 12.91 13.69 12.28 13.3 11.89L8.40997 6.99997L13.3 2.10997C13.68 1.72997 13.68 1.08997 13.3 0.709971Z" fill="#fff" />
                                    </svg>
                                ) : (
                                    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M12.5 10.9999H11.71L11.43 10.7299C12.63 9.32989 13.25 7.41989 12.91 5.38989C12.44 2.60989 10.12 0.389893 7.32 0.0498932C3.09 -0.470107 -0.47 3.08989 0.05 7.31989C0.39 10.1199 2.61 12.4399 5.39 12.9099C7.42 13.2499 9.33 12.6299 10.73 11.4299L11 11.7099V12.4999L15.25 16.7499C15.66 17.1599 16.33 17.1599 16.74 16.7499C17.15 16.3399 17.15 15.6699 16.74 15.2599L12.5 10.9999ZM6.5 10.9999C4.01 10.9999 2 8.98989 2 6.49989C2 4.00989 4.01 1.99989 6.5 1.99989C8.99 1.99989 11 4.00989 11 6.49989C11 8.98989 8.99 10.9999 6.5 10.9999Z"
                                            fill="white" />
                                    </svg>
                                )}

                            </a>
                            <Menu as="div" className={"relative"}>
                                <Menu.Button className="select-lang d-flex align-items-center">
                                    {i18n.language == 'ru' ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" className="lang"><g fillRule="nonzero" fill="none"><path fill="#FFF" d="M0 4h24v8H0z" /><path fill="#D52B1E" d="M0 12h24v8H0z" /><path fill="#0039A6" d="M0 9.333h24v5.333H0z" /></g></svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" className="lang"><g fillRule="nonzero" fill="none">
                                            <path fill="#1EB53A" d="M0 4h24v15H0z" /><path fill="#0099B5" d="M0 4h24v8H0z" /><path fill="#FFF" d="M0 9h24v5H0z" />
                                            <g transform="translate(1 5)"><circle fill="#FFF" cx="2.36" cy="1.92" r="1.44" />
                                                <circle fill="#0099B5" cx="2.84" cy="1.92" r="1.44" /></g></g>
                                        </svg>
                                    )}

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
                                    <Menu.Items className="absolute right-0 mt-2 origin-top-left lang-content">
                                        {i18n.language == 'ru' ? (
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button className="w-100 d-flex align-items-center justify-content-center" onClick={() => {
                                                        globalContext.changeLang("uz");
                                                    }}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" className="lang"><g fillRule="nonzero" fill="none">
                                                            <path fill="#1EB53A" d="M0 4h24v15H0z" /><path fill="#0099B5" d="M0 4h24v8H0z" /><path fill="#FFF" d="M0 9h24v5H0z" />
                                                            <g transform="translate(1 5)"><circle fill="#FFF" cx="2.36" cy="1.92" r="1.44" />
                                                                <circle fill="#0099B5" cx="2.84" cy="1.92" r="1.44" /></g></g>
                                                        </svg>
                                                    </button>
                                                )}
                                            </Menu.Item>
                                        ) : (
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button className="w-100 d-flex align-items-center justify-content-center" onClick={() => {
                                                        globalContext.changeLang("ru");
                                                    }}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" className="lang"><g fillRule="nonzero" fill="none"><path fill="#FFF" d="M0 4h24v8H0z" /><path fill="#D52B1E" d="M0 12h24v8H0z" /><path fill="#0039A6" d="M0 9.333h24v5.333H0z" /></g></svg>
                                                    </button>
                                                )}
                                            </Menu.Item>
                                        )}

                                    </Menu.Items>
                                </Transition>
                            </Menu>
                            {user ? <>
                                <Link href="/account/my-music">
                                    <a>
                                        {router.asPath.startsWith("/account/my-music") ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="18" viewBox="0 0 22 18" fill="none">
                                                <path d="M12.3497 17.1299C11.5897 17.8199 10.4197 17.8199 9.65967 17.1199L9.54967 17.0199C4.29967 12.2699 0.869665 9.15992 0.999665 5.27992C1.05966 3.57992 1.92966 1.94992 3.33966 0.989922C5.97966 -0.810078 9.23967 0.0299218 10.9997 2.08992C12.7597 0.0299218 16.0197 -0.820078 18.6597 0.989922C20.0697 1.94992 20.9397 3.57992 20.9997 5.27992C21.1397 9.15992 17.6997 12.2699 12.4497 17.0399L12.3497 17.1299Z" fill="#EF225D" />
                                            </svg>
                                        ) : (
                                            <svg width="22" height="18" viewBox="0 0 22 18" fill="none"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M18.66 0.989922C16.02 -0.810078 12.76 0.0299218 11 2.08992C9.24 0.0299218 5.98 -0.820078 3.34 0.989922C1.94 1.94992 1.06 3.56992 1 5.27992C0.86 9.15992 4.3 12.2699 9.55 17.0399L9.65 17.1299C10.41 17.8199 11.58 17.8199 12.34 17.1199L12.45 17.0199C17.7 12.2599 21.13 9.14992 21 5.26992C20.94 3.56992 20.06 1.94992 18.66 0.989922ZM11.1 15.5499L11 15.6499L10.9 15.5499C6.14 11.2399 3 8.38992 3 5.49992C3 3.49992 4.5 1.99992 6.5 1.99992C8.04 1.99992 9.54 2.98992 10.07 4.35992H11.94C12.46 2.98992 13.96 1.99992 15.5 1.99992C17.5 1.99992 19 3.49992 19 5.49992C19 8.38992 15.86 11.2399 11.1 15.5499Z"
                                                    fill="white" />
                                            </svg>
                                        )}

                                    </a>
                                </Link>
                                {user?.tariffs.length > 0 && (
                                    <Link href="/account/active-subscription">
                                        <a className="tariff-btn">
                                            {t("Премиум")}
                                        </a>
                                    </Link>
                                )}

                                <Menu as="div" className={"relative " + (user?.tariffs.length > 0 ? 'ms-2' : 'ms-3')}>
                                    <Menu.Button className="profile-btn">
                                        {user?.full_name[0]?.toUpperCase()}
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
                                        <Menu.Items className="absolute right-0 mt-2 origin-top-right">
                                            <div className="profile-menu" >
                                                <div className="header">
                                                    <p className="whitespace-nowrap my-0">{user?.full_name}</p>
                                                </div>

                                                <ul>
                                                    <li>
                                                        <Menu.Item>
                                                            {({ active }) => (
                                                                <button className="w-100" onClick={() => router.push("/account")}>
                                                                    {t("Аккаунт")}
                                                                </button>
                                                            )}
                                                        </Menu.Item>
                                                    </li>
                                                    <li>
                                                        <Menu.Item>
                                                            {({ active }) => (
                                                                <button className="w-100" onClick={() => router.push("/account/my-music")}>
                                                                    {t("Моя музыка")}
                                                                </button>
                                                            )}
                                                        </Menu.Item>
                                                    </li>
                                                    <li>
                                                        <Menu.Item>
                                                            {({ active }) => (
                                                                <button className="w-100" onClick={() => router.push("/account/save")}>
                                                                    {t("Избранное")}
                                                                </button>
                                                            )}
                                                        </Menu.Item>
                                                    </li>
                                                    <li>
                                                        <Menu.Item>
                                                            {({ active }) => (
                                                                <button className="w-100" onClick={() => router.push("/account/favorite")}>
                                                                    {t("Понравившиеся")}
                                                                </button>
                                                            )}
                                                        </Menu.Item>
                                                    </li>
                                                   
                                                    {SUBSCRIBE && <li>
                                                        <Menu.Item>
                                                            {({ active }) => (
                                                                <button className="w-100" onClick={() => router.push("/account/active-subscription")}>{t("Активные подписки")}</button>
                                                            )}
                                                        </Menu.Item>
                                                    </li>}
                                                    {SUBSCRIBE && <li>
                                                        <Menu.Item>
                                                            {({ active }) => (
                                                                <button className="w-100" onClick={() => router.push("/account/subscription")}>{t("Подписки")}</button>
                                                            )}
                                                        </Menu.Item>
                                                    </li>}
                                                    {SUBSCRIBE && <li>
                                                        <Menu.Item>
                                                            {({ active }) => (
                                                                <button className="w-100" onClick={() => router.push("/account/payment")}>{t("Оплата")}</button>
                                                            )}
                                                        </Menu.Item>
                                                    </li>}
                                                    <li>
                                                        <Menu.Item>
                                                            {({ active }) => (
                                                                <button className="w-100" onClick={() => router.push("/account/history")}>{t("История просмотров")}</button>
                                                            )}
                                                        </Menu.Item>
                                                    </li>
                                                    <li>
                                                        <Menu.Item>
                                                            {({ active }) => (
                                                                <button className="w-100" onClick={() => router.push("/account/setting")}>{t("Настройки")}</button>
                                                            )}
                                                        </Menu.Item>
                                                    </li>
                                                    <li className="py-0">
                                                        <div>
                                                            <label htmlFor="switch-theme" className="d-flex w-100 align-items-center">
                                                                <span className="me-5">{t("Тёмная тема")}</span>
                                                                <Switch id="switch-theme" checkedIcon={false} uncheckedIcon={false} onColor="#EF225D" offColor="#E0E0E0" onChange={handleTheme} checked={globalContext.store.theme === DARK_THEME} />
                                                            </label>
                                                        </div>
                                                    </li>
                                                </ul>
                                                <div className="footer">
                                                    <a role="button" onClick={() => globalContext.logout()}>
                                                        <div className="d-flex">
                                                            <svg className="me-2" width="18" height="18" viewBox="0 0 18 18" fill="none"
                                                                xmlns="http://www.w3.org/2000/svg">
                                                                <path
                                                                    d="M7.79 13.29C8.18 13.68 8.81 13.68 9.2 13.29L12.79 9.7C13.18 9.31 13.18 8.68 12.79 8.29L9.2 4.7C8.81 4.31 8.18 4.31 7.79 4.7C7.4 5.09 7.4 5.72 7.79 6.11L9.67 8H1C0.45 8 0 8.45 0 9C0 9.55 0.45 10 1 10H9.67L7.79 11.88C7.4 12.27 7.41 12.91 7.79 13.29ZM16 0H2C0.89 0 0 0.9 0 2V5C0 5.55 0.45 6 1 6C1.55 6 2 5.55 2 5V3C2 2.45 2.45 2 3 2H15C15.55 2 16 2.45 16 3V15C16 15.55 15.55 16 15 16H3C2.45 16 2 15.55 2 15V13C2 12.45 1.55 12 1 12C0.45 12 0 12.45 0 13V16C0 17.1 0.9 18 2 18H16C17.1 18 18 17.1 18 16V2C18 0.9 17.1 0 16 0Z"
                                                                    fill="white" />
                                                            </svg>
                                                            {t("Выйти")}
                                                        </div>
                                                    </a>
                                                </div>
                                            </div>
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            </> : <>
                                <a className="btn btn-spec btn-spec-smaller" role="button" onClick={handleShowLogin}>{t("Войти")}</a>
                            </>}

                        </div>
                    </div>
                </div>
            </nav>

            <LoginModal isOpen={isLoginOpen} setIsOpen={setIsLoginOpen} showRegister={showRegister} />
            <RegisterModal isOpen={isRegisterOpen} setIsOpen={setIsRegisterOpen} showLogin={showLogin} />
        </header >
    );
}