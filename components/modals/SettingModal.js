import React, { Fragment, useContext } from 'react';
import { useTranslation } from 'next-i18next';
import { Dialog, Transition } from '@headlessui/react';
import { GlobalContext } from '../context';
import { DARK_THEME, WHITE_THEME } from '../../reducers/themeReducer';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        padding: "0",
        background: 'transparent',
        border: 0
    },
    overlay: {
        background: 'rgba(4, 4, 4, 0.8)',
    }
};

export default function SettingModal({ isOpen, setIsOpen }) {
    const closeModal = () => setIsOpen(false);
    const globalContext = useContext(GlobalContext);

    const { t, i18n } = useTranslation();

    const handleTheme = (e) => {
        globalContext.changeTheme(e);
    }

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog
                as="div"
                className="fixed inset-0 z-3333 overflow-y-auto"
                onClose={closeModal}
            >
                <div className="min-h-screen d-flex align-items-center justify-content-center">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0" style={customStyles.overlay} />
                    </Transition.Child>

                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <div>
                            <div className="rizanova-login max-width-auto transition-all transform">
                                <a role="button" className="close" onClick={closeModal}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path fill="#222" fillRule="evenodd" d="M12 10.75L3.25 2 2 3.25 10.75 12 2 20.75 3.25 22 12 13.25 20.75 22 22 20.75 13.25 12 22 3.25 20.75 2z" /></svg>
                                </a>
                                <div className="setting pt-5">
                                    <div className="d-flex flex-wrap flex-sm-nowrap">
                                        <div className="label d-flex align-items-end text-dark">
                                            {t("Тема")}:
                                        </div>

                                        <a role="button" className={"theme " + (globalContext.store.theme === WHITE_THEME ? 'active' : '')} onClick={() => {
                                            handleTheme(WHITE_THEME);
                                        }}>
                                            <div className="image">
                                                <img src="/image/theme-light.jpg" />
                                            </div>
                                            <div className="title text-dark">Light</div>
                                        </a>

                                        <a role="button" className={"theme " + (globalContext.store.theme === DARK_THEME ? 'active' : '')} onClick={() => {
                                            handleTheme(DARK_THEME);
                                        }}>
                                            <div className="image">
                                                <img src="/image/theme-dark.jpg" />
                                            </div>
                                            <div className="title text-dark">Dark</div>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    )
}