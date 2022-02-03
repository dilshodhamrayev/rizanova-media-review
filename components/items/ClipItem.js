import Link from 'next/link';
import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import FavoriteBtn from '../buttons/FavoriteBtn';
import LongShareBtn from '../buttons/LongShareBtn';
import moment from 'moment';
import AddVideoPlaylist from '../buttons/AddVideoPlaylist';

export default function ClipItem({ model, link = "clip", hidePremiere, hideSinger, className = "" }) {
    const { t, i18n } = useTranslation();
    const router = useRouter();
    const [isOpenShare, setIsOpenShare] = useState(false);

    return (
        <div className={"music-item " + className}>
            <div className="image">
                <Image src={model.image_path} className="w-100" width={256} height={144} layout="responsive" unoptimized loading='lazy' />
                <div className={"controls " + (isOpenShare ? 'active' : '')} onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        router.push(`/${link}/${model.id}`);
                    }
                }}>
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
                    <AddVideoPlaylist model={model}/>
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
                    <a title={model.name}>{model.name} {model.version && <span className="version">{model.version}</span>}</a>
                </Link>
            </div>
            {!hideSinger && <div className="singer">
                <span>
                    {model.authors.map((author, index) => {
                        return (
                            <React.Fragment key={index}>
                                <Link href={`/person/${author.id}`}>
                                    <a className="d-block mb-lg-1 mb-0">{author.name}</a>
                                </Link>
                                {/* {index !== model.authors.length - 1 && <span>, </span>} */}
                            </React.Fragment>
                        );
                    })}
                </span>
            </div>}
        </div>
    );
}