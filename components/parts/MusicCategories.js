import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

export default function MusicCategories({ models, hideShowAll = false }) {
    const {t, i18n} = useTranslation();

    return (
        <section className="categories">
            {!hideShowAll ? <Link href="/music/category">
                <nav className="title-nav cursor-pointer">
                    <a>
                        <h3 className={"title-2 mb-0 mt-0"}>{t("Категории")}</h3>
                        <p className="mt-0 sub-title-2">{t("Треки, собранные по категориям")}</p>
                    </a>

                    <a className="show-all mb-3">
                        <span>
                            {t("Показать все")}
                        </span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="20" viewBox="0 0 11 20" fill="none">
                            <path
                                d="M0.38 19.01C0.87 19.5 1.66 19.5 2.15 19.01L10.46 10.7C10.85 10.31 10.85 9.68005 10.46 9.29005L2.15 0.980049C1.66 0.490049 0.87 0.490049 0.38 0.980049C-0.11 1.47005 -0.11 2.26005 0.38 2.75005L7.62 10L0.37 17.25C-0.11 17.73 -0.11 18.5301 0.38 19.01Z" />
                        </svg>
                    </a>
                </nav>
            </Link> : <>
                <h3 className={"title-2 mb-0 mt-0"}>{t("Категории")}</h3>
                <p className="mt-0 sub-title-2 mb-2 mb-md-4">{t("Треки, собранные по категориям")}</p>
            </>}
            <div className="row">
                {models.map((model, index) => {
                    let name = i18n.language === "ru" ? model.name_ru : model.name_uz;

                    return (
                        <div className="col-lg-3 col-md-4 col-sm-6 col-6 mb-4" key={index}>
                            <Link href={"/music/category/" + model.id}>
                                <a className="category music-category" >
                                    <img src={model.image_path} />
                                    <div
                                        className="title cover d-flex align-items-end align-content-end justify-content-center flex-wrap">
                                        <span className="w-100 text-center mb-4">{name}</span>
                                    </div>
                                </a>
                            </Link>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}