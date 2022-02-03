import Link from 'next/link';
import React from 'react';
import { useTranslation } from 'next-i18next';
import ChartItem from '../items/ChartItem';

export default function MiniChart({ models, isHome, mutate }) {
    const { t, i18n } = useTranslation();

    return (
        <section className={"chart-rizanova" + (isHome ? " py-70 bg-different" : "")}>
            <div className={isHome ? "container" : ""}>
                <Link href="/music/chart">
                    <nav className="title-nav cursor-pointer">
                        <Link href="/music/chart">
                            <a>
                                <h3 className={(isHome ? "title-1 mb-3" : "title-2 mb-0") + " mt-0 "}>{t("Чарт RizaNova")}</h3>
                                {!isHome && <p className="mt-0 sub-title-2">{t("Треки, популярные на RizaNova прямо сейчас")}</p>}
                            </a>
                        </Link>

                        <Link href="/music/chart">
                            <a className="show-all mb-3">
                                <span>
                                    {t("Показать все")}
                                </span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="20" viewBox="0 0 11 20" fill="none">
                                    <path
                                        d="M0.38 19.01C0.87 19.5 1.66 19.5 2.15 19.01L10.46 10.7C10.85 10.31 10.85 9.68005 10.46 9.29005L2.15 0.980049C1.66 0.490049 0.87 0.490049 0.38 0.980049C-0.11 1.47005 -0.11 2.26005 0.38 2.75005L7.62 10L0.37 17.25C-0.11 17.73 -0.11 18.5301 0.38 19.01Z" />
                                </svg>
                            </a>
                        </Link>
                    </nav>
                </Link>

                <div className="row">
                    <div className="col-md-6">
                        <ul className="chart-list">
                            {models.filter((model, index) => index < models.length / 2).map((model, index) => {
                                return (
                                    <ChartItem mutate={mutate} showMenyu model={model} key={index} order={index + 1} models={models} />
                                );
                            })}

                        </ul>
                    </div>
                    <div className="col-md-6">
                        <ul className="chart-list">
                            {models.filter((model, index) => index >= models.length / 2).map((model, index) => {
                                return (
                                    <ChartItem mutate={mutate} showMenyu model={model} key={Math.ceil(models.length / 2) + index + 1} order={Math.ceil(models.length / 2) + index + 1} models={models} />
                                );
                            })}

                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}