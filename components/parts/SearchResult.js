import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import moment from 'moment';

export default function SearchResult({ model, type = "film", setIsSearchOpen }) {
    const { t, i18n } = useTranslation();

    let title = "";

    switch (type) {
        case "film": title = t("Фильм"); break;
        case "serial": title = t("Сериал"); break;
        case "clip": title = t("Клип"); break;
        case "music": title = t("Музыка"); break;
        case "concert": title = t("Концерт"); break;
        case "album": title = t("Альбом"); break;
        case "humor": title = t("Юмор"); break;
        case "telenovella": title = t("Теленовелла"); break;
    }

    return (
        <Link href={`/${type == "album" ? "music/album" : type}/${model.id}`}>
            <a className={`result ${type}`} title={title} onClick={() => setIsSearchOpen(false)}>
                <div className="image">
                    <img src={model.image_path} alt="" />
                </div>
                <div className="info">
                    <div className="name">{model.name}</div>
                    {type == "person" ? (
                        <>{model.full_name && <div className="year">{model.full_name}</div>}</>
                    ) : (
                        <div className="year">{moment(model.release_date, "YYYY-MM-DD").format("YYYY")}</div>
                    )}
                    {/* <div className="rating">7.7</div> */}
                </div>
                <div className="price">
                    <span className='free'>{title}</span>
                </div>
            </a>
        </Link>
    );
}