import { useRouter } from 'next/router';
import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import useSWR from 'swr';
import { get } from '../../../utils/request';
import { useTranslation } from 'next-i18next';
import withSession from '../../../utils/session';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function FilmCast(props) {

    const router = useRouter();

    const { cast_film_id } = router.query;

    const {t, i18n} = useTranslation();

    const { data: model } = useSWR(`telenovella/persons?id=${cast_film_id}`, get, { initialData: props.data });

    const title = model.name + " — " + t("Актёры и создатели теленовелла");
    const description = t("Онлайн-кинотеатр узбекских фильмов в хорошем качестве только на сайте RizaNova.");
    const keywords = t("премьеры последние новые узбекских фильм фильмов актеры актрисы режиссеры узбеккино онлайн жанры");

    return (
        <div>
            <Head>
                <title>{title}</title>
                <meta property="og:title" content={title} />
                <meta name="description" content={description} />
                <meta property="og:description" content={description} />
                <meta name="keywords" content={keywords} />
                <meta property="og:image" content="https://rizanova.uz/image/logo.png" />
            </Head>

            <div className="container min-view pb-lg-5 mb-lg-5">
                <h1 className="big-header">{t("Актёры и создатели теленовелла")} «<Link href={`/telenovella/${model.id}`}><a>{model.name}</a></Link>»</h1>

                {model.persons.directors.length > 0 && <>
                    <h2 className="title-2 mt-2 mb-2">{t("Режиссёр")}</h2>

                    <div className="row mb-2 mb-lg-5">
                        {model.persons.directors.map((person, index) => {
                            return (
                                <div className="col-lg-2 col-md-3 col-sm-4 col-6" key={index}>
                                    <Link href={"/person/" + person.id}>
                                        <a className="d-block">
                                            <div className="actor">
                                                <div className="image">
                                                    <img src={person.image_path} className="w-100 d-block h-100" />
                                                </div>

                                                <p className="w-100 text-center name">{person.name}</p>
                                            </div>
                                        </a>
                                    </Link>
                                </div>
                            )
                        })}
                    </div>
                </>}

                {model.persons.actors.length > 0 && <>
                    <h2 className="title-2 mt-2 mb-2">{t("Актёр")}</h2>
                    <div className="row mb-2 mb-lg-5">
                        {model.persons.actors.map((person, index) => {
                            return (
                                <div className="col-lg-2 col-md-3 col-sm-4 col-6" key={index}>
                                    <Link href={"/person/" + person.id}>
                                        <a className="d-block">
                                            <div className="actor">
                                                <div className="image">
                                                    <img src={person.image_path} className="w-100 d-block h-100" />
                                                </div>

                                                <p className="w-100 text-center name">{person.name}</p>
                                            </div>
                                        </a>
                                    </Link>
                                </div>
                            )
                        })}
                    </div>
                </>}

                {model.persons.scenarists.length > 0 && <>
                    <h2 className="title-2 mt-2 mb-2">{t("Сценарист")}</h2>
                    <div className="row mb-2 mb-lg-5">
                        {model.persons.scenarists.map((person, index) => {
                            return (
                                <div className="col-lg-2 col-md-3 col-sm-4 col-6" key={index}>
                                    <Link href={"/person/" + person.id}>
                                        <a className="d-block">
                                            <div className="actor">
                                                <div className="image">
                                                    <img src={person.image_path} className="w-100 d-block h-100" />
                                                </div>

                                                <p className="w-100 text-center name">{person.name}</p>
                                            </div>
                                        </a>
                                    </Link>
                                </div>
                            )
                        })}
                    </div>
                </>}

                {model.persons.operators.length > 0 && <>
                    <h2 className="title-2 mt-2 mb-2">{t("Оператор")}</h2>
                    <div className="row mb-2 mb-lg-5">
                        {model.persons.operators.map((person, index) => {
                            return (
                                <div className="col-lg-2 col-md-3 col-sm-4 col-6" key={index}>
                                    <Link href={"/person/" + person.id}>
                                        <a className="d-block">
                                            <div className="actor">
                                                <div className="image">
                                                    <img src={person.image_path} className="w-100 d-block h-100" />
                                                </div>

                                                <p className="w-100 text-center name">{person.name}</p>
                                            </div>
                                        </a>
                                    </Link>
                                </div>
                            )
                        })}
                    </div>
                </>}

                {model.persons.xudojniks.length > 0 && <>
                    <h2 className="title-2 mt-2 mb-2">{t("Художник")}</h2>
                    <div className="row mb-2 mb-lg-5">
                        {model.persons.xudojniks.map((person, index) => {
                            return (
                                <div className="col-lg-2 col-md-3 col-sm-4 col-6" key={index}>
                                    <Link href={"/person/" + person.id}>
                                        <a className="d-block">
                                            <div className="actor">
                                                <div className="image">
                                                    <img src={person.image_path} className="w-100 d-block h-100" />
                                                </div>

                                                <p className="w-100 text-center name">{person.name}</p>
                                            </div>
                                        </a>
                                    </Link>
                                </div>
                            )
                        })}
                    </div>
                </>}

                {model.persons.compositors.length > 0 && <>
                    <h2 className="title-2 mt-2 mb-2">{t("Композитор")}</h2>
                    <div className="row mb-2 mb-lg-5">
                        {model.persons.compositors.map((person, index) => {
                            return (
                                <div className="col-lg-2 col-md-3 col-sm-4 col-6" key={index}>
                                    <Link href={"/person/" + person.id}>
                                        <a className="d-block">
                                            <div className="actor">
                                                <div className="image">
                                                    <img src={person.image_path} className="w-100 d-block h-100" />
                                                </div>

                                                <p className="w-100 text-center name">{person.name}</p>
                                            </div>
                                        </a>
                                    </Link>
                                </div>
                            )
                        })}
                    </div>
                </>}

                {model.persons.producers.length > 0 && <>
                    <h2 className="title-2 mt-2 mb-2">{t("Продюсер")}</h2>
                    <div className="row mb-2 mb-lg-5">
                        {model.persons.producers.map((person, index) => {
                            return (
                                <div className="col-lg-2 col-md-3 col-sm-4 col-6" key={index}>
                                    <Link href={"/person/" + person.id}>
                                        <a className="d-block">
                                            <div className="actor">
                                                <div className="image">
                                                    <img src={person.image_path} className="w-100 d-block h-100" />
                                                </div>

                                                <p className="w-100 text-center name">{person.name}</p>
                                            </div>
                                        </a>
                                    </Link>
                                </div>
                            )
                        })}
                    </div>
                </>}

                {model.persons.montajs.length > 0 && <>
                    <h2 className="title-2 mt-2 mb-2">{t("Монтаж")}</h2>
                    <div className="row mb-2 mb-lg-5">
                        {model.persons.montajs.map((person, index) => {
                            return (
                                <div className="col-lg-2 col-md-3 col-sm-4 col-6" key={index}>
                                    <Link href={"/person/" + person.id}>
                                        <a className="d-block">
                                            <div className="actor">
                                                <div className="image">
                                                    <img src={person.image_path} className="w-100 d-block h-100" />
                                                </div>

                                                <p className="w-100 text-center name">{person.name}</p>
                                            </div>
                                        </a>
                                    </Link>
                                </div>
                            )
                        })}
                    </div>
                </>}


            </div>
        </div>
    )
}

export const getServerSideProps = withSession(async function ({ req, res, query: { cast_film_id }, locale }) {
    const user = req.session.get('user') || null;

    let params = {};

    if (user) {
        params = {
            "headers": {
                "Authorization": "Bearer " + user.token
            }
        };
    }

    try {
        let data = await get(`telenovella/persons?id=${cast_film_id}`, params);

        if (data.status == 'not-found') {
            return {
                notFound: true
            };
        }

        return {
            props: {
                ...(await serverSideTranslations(locale, ['common'])),
                data,
                user
            }
        };
    } catch (ex) {
        return {
            props: {
                ...(await serverSideTranslations(locale, ['common'])),
                data: {
                    model: null
                },
                user
            }
        };
    }
});