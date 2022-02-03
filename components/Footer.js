import React, { useContext, useState, Fragment } from 'react';
import { useTranslation } from 'next-i18next';
import FeedbackModal from './modals/FeedbackModal';
import { GlobalContext } from './context';
import { Menu, Transition } from '@headlessui/react';
import Switch from "react-switch";

import { DARK_THEME, WHITE_THEME } from '../reducers/themeReducer';
import SettingModal from './modals/SettingModal';

export default function Footer() {
    const { t, i18n } = useTranslation();

    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const [isSettingOpen, setIsSettingOpen] = useState(false);

    return (
        <footer className="main">
            <FeedbackModal isOpen={isFeedbackOpen} setIsOpen={setIsFeedbackOpen} />
            <SettingModal isOpen={isSettingOpen} setIsOpen={setIsSettingOpen} />
            <div className="container">
                <div className="py-40">
                    <div className="d-flex justify-content-evenly justify-content-md-between align-items-center first-level">
                        <div className="mb-md-0 mb-sm-4 mb-2">
                            <a role="button" className="me-2 d-inline-block store-link cursor-default"><img src="/image/google-soon.svg" alt="" /></a>
                            <a role="button" className="d-inline-block store-link cursor-default"><img src="/image/apple-soon.svg" alt="" /></a>
                        </div>
                        <div className="mb-md-0 mb-sm-4 mb-sm-0 mb-2 feedback-link-box">
                            <a role="button" className="feedback-link d-flex align-items-center" onClick={() => setIsFeedbackOpen(true)}>
                                <img src="/image/feedback-icon.svg" className="me-2" alt="" />
                                {t("Обратная связь")}
                            </a>
                        </div>
                        <div className="d-flex align-items-center justify-content-between mb-lg-0 mx-lg-0 mx-md-0 mx-sm-auto mx-sm-0 mb-2  feedback-link-box">
                            <a role="button" className='feedback-link d-flex align-items-center' onClick={() => {
                                setIsSettingOpen(true);
                            }}>
                                <img src="/image/theme-icon.svg" className="me-2" alt="" />
                                {t("Тема")}
                            </a>
                        </div>
                    </div>
                </div>
                <div className="second-level py-4 d-block d-sm-flex justify-content-between">
                    <p className="my-0">
                        {t("Все права защищены")} © {(new Date).getFullYear()}
                    </p>
                    <div className="d-flex align-items-center justify-content-center mt-sm-0 ml-lg-0 ml-md-0 ml-sm-auto ml-sm-0 mt-3 socials-box">
                        <a href="https://www.facebook.com/RizaNova-109923053933161" target="_blank" rel="noreferrer" className="ms-2">
                            <img src="/image/footer-facebook.svg" alt="" />
                        </a>
                        <a href="https://www.youtube.com/channel/UCDPnSqLmYqHadD6VkrRiarg" target="_blank" rel="noreferrer" className="ms-2">
                            <img src="/image/footer-youtube.svg" alt="" />
                        </a>
                        <a href="https://t.me/RizaNovaUZ" target="_blank" rel="noreferrer" className="ms-2">
                            <img src="/image/footer-telegram.svg" alt="" />
                        </a>
                        <a href="https://www.instagram.com/rizanovauz/" target="_blank" rel="noreferrer" className="ms-2">
                            <img src="/image/footer-instagram.svg" alt="" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}