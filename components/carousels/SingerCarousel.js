import Link from 'next/link';
import React from 'react';
import { useTranslation } from 'next-i18next';
import Slider from 'react-slick';
import Image from 'next/image';

export default function SingerCarousel({ models, isHome }) {

    const {t, i18n} = useTranslation();

    const settings = {
        dots: false,
        pauseOnFocus: false,
        pauseOnHover: false,
        slidesToShow: 4,
        infinite: models.length > 4,
        centerMode: false,
        autoplay: true,
        autoplaySpeed: 5000,
        useCSS: true,
        useTransform: true,
        rtl: false,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 575,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
            },
        ]
    };

    return (
        <section className={"singer-carousel" + (isHome ? " py-70" : "")}>
            <div className={isHome ? "container" : ""}>
                <Link href="/music/singer">
                    <nav className="title-nav cursor-pointer">
                        <Link href="/music/singer">
                            <a>
                                <h3 className={(isHome ? "title-1" : "title-2") + " mt-0 mb-3"}>{t("Исполнители")}</h3>
                            </a>
                        </Link>

                        <Link href="/music/singer">
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
                <Slider {...settings} className="carousel-4">
                    {models.map((model, index) => {
                        return (
                            <div className="music-item singer-item" key={index}>
                                <Link href={`/person/` + model.id}>
                                    <a>
                                        <div className="image rounded-circle singer-image">
                                            <Image src={model.image_path} className="w-100" alt={model.name} width={256} height={256} layout="responsive" unoptimized loading='lazy' />
                                        </div>
                                    </a>
                                </Link>
                                <div className="title text-center">
                                    <Link href={`/person/` + model.id}>
                                        <a>{model.name}</a>
                                    </Link>
                                </div>

                            </div>
                        );
                    })}

                </Slider>
            </div>
        </section >
    );
}