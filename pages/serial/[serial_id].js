import Head from 'next/head';
import Link from 'next/link';
import useSWR from 'swr';
import { get } from '../../utils/request';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import React, { useEffect, useRef, useState } from 'react';
import VideoPlayer from '../../components/VideoPlayer';
import Carousel from '../../components/carousels/serial/Carousel';
import AdvancedDetailPersons from '../../components/AdvancedDetailPersons';
import ActorsAndCreators from '../../components/ActorsAndCreators';
import withSession from '../../utils/session';
import SeeLaterBtn from '../../components/buttons/SeeLaterBtn';
import LongShareBtn from '../../components/buttons/LongShareBtn';
import BigFavoriteBtn from '../../components/buttons/BigFavoriteBtn';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function FilmView(props) {
    const { t, i18n } = useTranslation();

    const router = useRouter();

    const { serial_id, episode_id } = router.query;

    const ref = useRef(null);

    const { data: { model, others } } = useSWR(`serial/get?id=${serial_id}`, get, { initialData: props.data });

    const [episode, setEpisode] = useState(null);

    const [season, setSeason] = useState(null);
    const [seasons, setSeasons] = useState([]);

    useEffect(() => {
        if (episode_id) {
            setEpisode(model.episodes.find(episode => episode.id == episode_id));
        } else {
            setEpisode(model.episodes.length > 0 ? model.episodes[0] : null);
        }
    }, [episode_id]);

    useEffect(() => {
        if (episode) {
            setSeason(episode.season);
        }
    }, [episode]);

    useEffect(() => {
        if (model && model.episodes?.length > 0) {
            let _seasons = [];

            for (const _episode of model.episodes) {
                if (_seasons.indexOf(_episode.season) === -1) {
                    _seasons.push(_episode.season);
                }
            }

            setSeasons([..._seasons]);
        }
    }, [model]);

    const title = t("Сериал") + " " + model.name + " — " + t("смотреть онлайн");
    const description = t("Онлайн-кинотеатр узбекских сериалов в хорошем качестве только на сайте RizaNova.");
    const keywords = t("премьеры последние новые узбекских сериал сериалов актеры актрисы режиссеры узбеккино онлайн жанры");

    return (
        <div>
            <Head>
                <title>{title}</title>
                <meta property="og:title" content={title} />
                <meta name="description" content={description} />
                <meta property="og:description" content={description} />
                <meta name="keywords" content={keywords} />
                <meta property="og:image" content={model.image_path} />
            </Head>

            <div className="container inner-page">
                <ul className="breadcrumbs">
                    <li><Link href="/"><a>{t("Главная")}</a></Link></li>
                    <li><span>/</span></li>
                    <li><Link href="/serial"><a>{t("Сериалы")}</a></Link></li>
                    <li><span>/</span></li>
                    <li><p>{model.name}</p></li>
                </ul>

                <Link href='/serial'>
                    <a>
                        <h3 className="big-header">{t("Сериалы")}</h3>
                    </a>
                </Link>

                <div className="row">
                    <div className="col-lg-12">
                        {episode && <VideoPlayer model={episode} showReview />}
                    </div>

                    {/* <div className="col-lg-3 order-md-minus">
                        <div className="ads h-100 bg-different">

                        </div>
                    </div> */}
                </div>
                <div className="row mt-2 pt-1">
                    <div className="col-lg-9 d-flex align-items-center justify-content-center justify-content-sm-start flex-wrap">
                        <BigFavoriteBtn model={model} />
                        <SeeLaterBtn model={model} />

                        <LongShareBtn />
                    </div>
                    <div className="col-12">
                        <h2 className="title-1 pt-1 mt-1 pb-0 mb-0">{model.name}{episode && (", " + (i18n.language == "ru" ? "Серия" + " " + episode.seria : episode.seria + "-qism"))}</h2>
                    </div>
                </div>
            </div>

            <section className="bg-different serias">
                <div className="container">
                    <nav className="seasons">
                        {seasons.map(s => {
                            return (
                                <a role="button" key={s} className={s === season ? "active" : ""} onClick={() => setSeason(s)}>{s} {t("сезон")}</a>
                            );
                        })}
                    </nav>

                    <div className="content">
                        <div className="row">
                            {model.episodes.filter(episode => episode.season === season).map(_episode => {
                                return (
                                    <div className="col-lg-2 col-md-3 col-sm-4 col-6" key={_episode.id}>
                                        <Link href={"/serial/" + model.id + "?episode_id=" + _episode.id}>
                                            <a>
                                                <div className={"seria " + (episode.id === _episode.id ? 'active' : '')}>
                                                    <div className="image">
                                                        <img src={_episode.image_path} alt={_episode.name} />
                                                        <div className={"controls " + (episode?.id === _episode.id ? 'active' : "")}>
                                                            {episode?.id === _episode.id ? (
                                                                <div className="ringring"></div>
                                                            ) : (
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="37" height="37"
                                                                    viewBox="0 0 48 48" fill="none">
                                                                    <path
                                                                        d="M21.2001 33.1013L32.0968 24.9346C32.7267 24.468 32.7267 23.5346 32.0968 23.068L21.2001 14.9013C20.4301 14.318 19.3334 14.878 19.3334 15.8346V32.168C19.3334 33.1246 20.4301 33.6846 21.2001 33.1013ZM24.0001 0.667969C11.1201 0.667969 0.666748 11.1213 0.666748 24.0013C0.666748 36.8813 11.1201 47.3346 24.0001 47.3346C36.8801 47.3346 47.3334 36.8813 47.3334 24.0013C47.3334 11.1213 36.8801 0.667969 24.0001 0.667969ZM24.0001 42.668C13.7101 42.668 5.33342 34.2913 5.33342 24.0013C5.33342 13.7113 13.7101 5.33464 24.0001 5.33464C34.2901 5.33464 42.6668 13.7113 42.6668 24.0013C42.6668 34.2913 34.2901 42.668 24.0001 42.668Z"
                                                                        fill="white" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                        <div className="time">
                                                            {_episode.duration?.startsWith("00:") ? _episode.duration?.replace("00:", "") : _episode.duration}
                                                        </div>
                                                    </div>
                                                    <div className="name">
                                                        {i18n.language == "ru" ? "Серия" + " " + _episode.seria : _episode.seria + "-qism"}
                                                    </div>

                                                </div>
                                            </a>
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>
            <div className="container pb-lg-5 mb-lg-5">

                <AdvancedDetailPersons model={model} link="serial" />
                <ActorsAndCreators model={model} link="serial" />

                <Carousel models={others} link={`/serial/genre/${model.genres.length > 0 ? model.genres[0].id : ''}`} title={t("Похожие сериалы")} />
            </div>
        </div>
    )
}

export const getServerSideProps = withSession(async function ({ req, res, query: { serial_id, episode_id }, locale }) {
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
        let data = await get(`serial/get?id=${serial_id}`, params);

        if (episode_id && !data.model.episodes.find(episode => episode.id == episode_id)) {
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
                    model: null,
                    others: [],
                },
                user
            }
        };
    }
});