import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import moment from 'moment';
import { Collapse } from 'react-bootstrap';
import Slider from 'react-slick';

export default function ActorsAndCreators({ model, link = "film" }) {
    const {t, i18n} = useTranslation();

    const [models, setModels] = useState([]);

    useEffect(() => {
        let data = [];

        for (const person of model.persons.directors) {
            data.push({
                role: t('режиссёр'),
                model: person
            });
        }
        for (const person of model.persons.actors) {
            data.push({
                role: t('актёр'),
                model: person
            });
        }
        for (const person of model.persons.scenarists) {
            data.push({
                role: t('сценарист'),
                model: person
            });
        }
        for (const person of model.persons.operators) {
            data.push({
                role: t('оператор'),
                model: person
            });
        }
        for (const person of model.persons.xudojniks) {
            data.push({
                role: t('художник'),
                model: person
            });
        }
        for (const person of model.persons.compositors) {
            data.push({
                role: t('композитор'),
                model: person
            });
        }

        setModels([...data]);
    }, [model]);

    const settings = {
        dots: false,
        pauseOnFocus: false,
        pauseOnHover: false,
        slidesToShow: 8,
        infinite: false,
        centerMode: false,
        useCSS: true,
        useTransform: true,
        rtl: false,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 6,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: 5,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 575,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                }
            },
        ]
    };

    if (models.length === 0) return <></>;

    return (
        <div className="actors-and-creators">
            <nav className="title-nav cursor-pointer">
                <Link href={"/" + link + "/cast/" + model.id}>
                    <a>
                        <h2 className="title-1 mt-0">{t("Актёры и создатели")}</h2>
                    </a>
                </Link>
            </nav>

            <Slider {...settings} className="carousel-4 actors">
                {models.filter((model, index) => index < 7).map((model, index) => {
                    return (
                        <Link href={"/person/" + model.model.id} key={index}>
                            <a className="d-block">
                                <div className="actor">
                                    <div className="image">
                                        <img src={model.model.image_path} className="w-100" />
                                    </div>

                                    <p className="w-100 text-center name">{model.model.name}</p>
                                    <p className="w-100 text-center role">{model.role}</p>
                                </div>
                            </a>
                        </Link>
                    );
                })}
                <Link href={"/" + link + "/cast/" + model.id}>
                    <a className="d-block more-creators">
                        <div className="d-flex align-items-center justify-content-center">
                            {t("Ещё")}
                        </div>
                    </a>
                </Link>
            </Slider>
        </div>
    );
}