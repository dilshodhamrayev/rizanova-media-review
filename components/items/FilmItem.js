import Link from 'next/link';
import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import FavoriteBtn from '../buttons/FavoriteBtn';
import LongShareBtn from '../buttons/LongShareBtn';
import { useRouter } from 'next/router';
import moment from 'moment';

export default function FilmItem({ model, link = "film", hidePremiere, className = "" }) {
    const { t, i18n } = useTranslation();
    const [isOpenShare, setIsOpenShare] = useState(false);
    const router = useRouter();

    return (
        <div className={"music-item film-item " + className}>
            <div className="image">
                <Image src={model.image_path} className="w-100" width={256} height={144} layout="responsive" unoptimized loading='lazy' />
                <div className={"controls " + (isOpenShare ? 'active' : '')} onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        router.push(`/${link}/${model.id}`);
                    }
                }}>
                    {/* <FavoriteBtn model={model} type="video" /> */}

                    <Link href={`/${link}/${model.id}`}>
                        <a className='play-btn'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"
                                viewBox="0 0 48 48" fill="none">
                                <path
                                    d="M21.2001 33.1013L32.0968 24.9346C32.7267 24.468 32.7267 23.5346 32.0968 23.068L21.2001 14.9013C20.4301 14.318 19.3334 14.878 19.3334 15.8346V32.168C19.3334 33.1246 20.4301 33.6846 21.2001 33.1013ZM24.0001 0.667969C11.1201 0.667969 0.666748 11.1213 0.666748 24.0013C0.666748 36.8813 11.1201 47.3346 24.0001 47.3346C36.8801 47.3346 47.3334 36.8813 47.3334 24.0013C47.3334 11.1213 36.8801 0.667969 24.0001 0.667969ZM24.0001 42.668C13.7101 42.668 5.33342 34.2913 5.33342 24.0013C5.33342 13.7113 13.7101 5.33464 24.0001 5.33464C34.2901 5.33464 42.6668 13.7113 42.6668 24.0013C42.6668 34.2913 34.2901 42.668 24.0001 42.668Z"
                                    fill="white" />
                            </svg>
                        </a>
                    </Link>
                    {/* <LongShareBtn link={"/" + link + "/" + model.id} setIsOpenShare={setIsOpenShare}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="20"
                            viewBox="0 0 18 20" fill="none">
                            <path
                                d="M15 14.08C14.24 14.08 13.56 14.38 13.04 14.85L5.91 10.7C5.96 10.47 6 10.24 6 10C6 9.76 5.96 9.53 5.91 9.3L12.96 5.19C13.5 5.69 14.21 6 15 6C16.66 6 18 4.66 18 3C18 1.34 16.66 0 15 0C13.34 0 12 1.34 12 3C12 3.24 12.04 3.47 12.09 3.7L5.04 7.81C4.5 7.31 3.79 7 3 7C1.34 7 0 8.34 0 10C0 11.66 1.34 13 3 13C3.79 13 4.5 12.69 5.04 12.19L12.16 16.35C12.11 16.56 12.08 16.78 12.08 17C12.08 18.61 13.39 19.92 15 19.92C16.61 19.92 17.92 18.61 17.92 17C17.92 15.39 16.61 14.08 15 14.08Z"
                                fill="white" />
                        </svg>
                    </LongShareBtn> */}
                </div>
                {!!model.is_premiere && !hidePremiere && <div className="premiere-badge">
                    {t("Премьера")}
                </div>}
                <div className="year">
                    {moment(model.release_date, "YYYY-MM-DD").format("YYYY")}
                </div>
            </div>
            <div className="title">
                <Link href={`/${link}/${model.id}`}>
                    <a title={model.name}>{model.name}</a>
                </Link>
            </div>
        </div>
    );
}