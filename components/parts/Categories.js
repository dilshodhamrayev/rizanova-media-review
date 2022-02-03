import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

export default function Categories() {
    const {t, i18n} = useTranslation();

    return (
        <section className="categories py-70 bg-different">
            <div className="container">
                <div className="row">
                    <div className="col-lg-3 col-md-4 col-sm-6 col-6 mb-4">
                        <Link href="/music">
                            <a className="category" >
                                <img src="/image/category-music.jpg" />
                                <div
                                    className="title cover d-flex align-items-center align-content-center justify-content-center flex-wrap">
                                    <img src="/image/category-music.svg" />
                                    <span className="w-100 text-center mt-3">{t("Музыка")}</span>
                                </div>
                            </a>
                        </Link>
                    </div>
                    <div className="col-lg-3 col-md-4 col-sm-6 col-6 mb-4">
                        <Link href="/clip">
                            <a className="category" >
                                <img src="/image/category-clip.jpg" />
                                <div
                                    className="title cover d-flex align-items-center align-content-center justify-content-center flex-wrap">
                                    <img src="/image/category-clip.svg" />
                                    <span className="w-100 text-center mt-3">{t("Клипы")}</span>
                                </div>
                            </a>
                        </Link>
                    </div>
                    <div className="col-lg-3 col-md-4 col-sm-6 col-6 mb-4">
                        <Link href="/film">
                            <a className="category" >
                                <img src="/image/category-film.jpg" />
                                <div
                                    className="title cover d-flex align-items-center align-content-center justify-content-center flex-wrap">
                                    <img src="/image/category-film.svg" />
                                    <span className="w-100 text-center mt-3">{t("Фильмы")}</span>
                                </div>
                            </a>
                        </Link>
                    </div>
                    <div className="col-lg-3 col-md-4 col-sm-6 col-6 mb-4">
                        <Link href="/telenovella">
                            <a className="category" >
                                <img src="/image/category-telenovella.jpg" />
                                <div
                                    className="title cover d-flex align-items-center align-content-center justify-content-center flex-wrap">
                                    <img src="/image/category-telenovella.svg" />
                                    <span className="w-100 text-center mt-3">{t("Теленовелла")}</span>
                                </div>
                            </a>
                        </Link>
                    </div>
                    <div className="col-lg-3 col-md-4 col-sm-6 col-6 mb-4">
                        <Link href="/serial">
                            <a className="category" >
                                <img src="/image/category-serial.jpg" />
                                <div
                                    className="title cover d-flex align-items-center align-content-center justify-content-center flex-wrap">
                                    <img src="/image/category-serial.svg" />
                                    <span className="w-100 text-center mt-3">{t("Сериалы")}</span>
                                </div>
                            </a>
                        </Link>
                    </div>
                    <div className="col-lg-3 col-md-4 col-sm-6 col-6 mb-4">
                        <Link href="/concert">
                            <a className="category" >
                                <img src="/image/category-concert.jpg" />
                                <div
                                    className="title cover d-flex align-items-center align-content-center justify-content-center flex-wrap">
                                    <img src="/image/category-concert.svg" />
                                    <span className="w-100 text-center mt-3">{t("Концерты")}</span>
                                </div>
                            </a>
                        </Link>
                    </div>
                    <div className="col-lg-3 col-md-4 col-sm-6 col-6 mb-4">
                        <Link href="/humor">
                            <a className="category" >
                                <img src="/image/category-humor.jpg" />
                                <div
                                    className="title cover d-flex align-items-center align-content-center justify-content-center flex-wrap">
                                    <img src="/image/category-humor.svg" />
                                    <span className="w-100 text-center mt-3">{t("Юмор")}</span>
                                </div>
                            </a>
                        </Link>
                    </div>
                    <div className="col-lg-3 col-md-4 col-sm-6 col-6 mb-4">
                        <Link href="/music/singer">
                            <a className="category" >
                                <img src="/image/category-singers.jpg" />
                                <div
                                    className="title cover d-flex align-items-center align-content-center justify-content-center flex-wrap">
                                    <img src="/image/category-singers.svg" />
                                    <span className="w-100 text-center mt-3">{t("Исполнители")}</span>
                                </div>
                            </a>
                        </Link>
                    </div>
                    {/* <div className="col-lg-3 col-md-4 col-sm-6 col-6 mb-4">
                        <Link href="/radio">
                            <a className="category" >
                                <img src="/image/category-radio.jpg" />
                                <div
                                    className="title cover d-flex align-items-center align-content-center justify-content-center flex-wrap">
                                    <img src="/image/category-radio.svg" />
                                    <span className="w-100 text-center mt-3">{t("Радио")}</span>
                                </div>
                            </a>
                        </Link>
                    </div> */}
                </div>
            </div>
        </section>
    );
}