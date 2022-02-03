import Head from 'next/head';
import Link from 'next/link';
import useSWR from 'swr';
import { get } from '../../utils/request';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import React, { useRef } from 'react';
import VideoPlayer from '../../components/VideoPlayer';
import Carousel from '../../components/carousels/others/Carousel';
import ListItems from '../../components/lists/ListItems';
import DetailPersons from '../../components/DetailPersons';
import withSession from '../../utils/session';
import SeeLaterBtn from '../../components/buttons/SeeLaterBtn';
import LongShareBtn from '../../components/buttons/LongShareBtn';
import BigFavoriteBtn from '../../components/buttons/BigFavoriteBtn';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import MusicLink from '../../components/buttons/MusicLink';
import InfoBtn from '../../components/buttons/InfoBtn';
import { useState } from 'react';
import VideoPlaylistBtn from '../../components/buttons/VideoPlaylistBtn';

export default function ClipView(props) {
    const { t, i18n } = useTranslation();

    const router = useRouter();

    const { clip_id, page = 1 } = router.query;

    const ref = useRef(null);

    const { data: { model, others } } = useSWR(`clip/get?id=${clip_id}`, get, { initialData: props.data });
    const { data: { models: clips, pagination } } = useSWR(`clip?page=${page}&exclude=${[...others.map(m => m.id), model.id]}&sort=random`, get, { initialData: props.clips });

    const authors = model.persons.authors?.map(person => {
        return person.name;
    }).join(" & ");

    const title = authors + " — " + model.name;
    const description = t("Смотреть онлайн узбекских музыкальных видеоклипов в хорошем качестве на сайте RizaNova.");
    const keywords = t("премьеры последние новые узбекских клип клипы исполнители певец певицы");

    const [isOpenInfo, setIsOpenInfo] = useState(false);

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

            <div className="container min-view pb-lg-5 mb-lg-5 inner-page">

                <h1 className="big-header pb-0">{model.persons.authors.map((singer, index) => <><Link href={`/person/${singer.id}`} key={index}><a>{singer.name}</a></Link>{model.persons.authors.length - 1 != index ? ', ' : ''}</>)}</h1>
                <h2 className="big-header gray pt-0 pb-2 pb-md-4"><small>{model.name}</small></h2>

                <div className="row">
                    <div className="col-lg-12">
                        <VideoPlayer model={model} />
                    </div>
                </div>

                <div className="row mt-2 pt-1">
                    <div className="col-lg-12 d-flex align-items-center justify-content-center justify-content-sm-start flex-wrap">
                        <BigFavoriteBtn model={model} />
                        <SeeLaterBtn model={model} />
                        {model.music && <MusicLink model={model.music} />}
                        <InfoBtn isOpen={isOpenInfo} setOpen={setIsOpenInfo} />
                        <LongShareBtn />
                        <VideoPlaylistBtn />

                    </div>
                </div>

                <DetailPersons model={model} more={isOpenInfo} />

                <Carousel models={others} person_id={model.persons.authors[0].id} link="clip" title={t("Другие клипы исполнителя")} />

                <ListItems models={clips} page={page} pagination={pagination} link="clip" title={t("Рекомендуемые")} pathname={"/clip/" + clip_id} showPagination={false} />
            </div>
        </div>
    )
}

export const getServerSideProps = withSession(async function ({ req, res, query: { clip_id, page = 1 }, locale }) {
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
        let data = await get(`clip/get?id=${clip_id}`, params);

        if (data.status == 'not-found') {
            return {
                notFound: true
            };
        }

        let clips = await get(`clip?page=${page}&exclude=${[...data.others.map(m => m.id), data.model.id]}&sort=random`, params);

        return {
            props: {
                ...(await serverSideTranslations(locale, ['common'])),
                data,
                clips,
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
                    clips: {
                        models: [],
                        pagination: {}
                    }
                },
                user
            }
        };
    }
});