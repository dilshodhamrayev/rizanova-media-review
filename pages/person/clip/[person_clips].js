import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import useSWR from 'swr';
import { get } from '../../../utils/request';
import Head from 'next/head';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { GlobalContext } from '../../../components/context';
import ClipItem from '../../../components/items/ClipItem';
import withSession from '../../../utils/session';
import Select from '../../../components/Select';
import Empty from '../../../components/Empty';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function View(props) {
    const router = useRouter();

    const {t, i18n} = useTranslation();

    const { person_clips } = router.query;

    const { data: { model, models } } = useSWR(`clip/person?id=${person_clips}`, get, { initialData: props.data });

    const { store: { audioPlayer }, dispatch } = useContext(GlobalContext);

    const title = model.name + ' — ' + t("клипы");
    const description = t("Смотреть онлайн узбекских клипов в хорошем качестве на сайте RizaNova.");
    const keywords = t("премьеры последние новые узбекских клип клипы исполнители певец певицы");

    return <div>
        <Head>
            <title>{title}</title>
            <meta property="og:title" content={title} />
            <meta name="description" content={description} />
            <meta property="og:description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta property="og:image" content={model.image_path} />
        </Head>

        <div className="container min-view inner-page">
            <ul className="breadcrumbs">
                <li><Link href="/"><a>{t("Главная")}</a></Link></li>
                <li><span>/</span></li>
                <li><Link href="/clip"><a>{t("Клипы")}</a></Link></li>
                <li><span>/</span></li>
                <li><Link href="/clip/singer"><a>{t("Исполнители")}</a></Link></li>
                <li><span>/</span></li>
                <li><p>{model.name}</p></li>
            </ul>

            <h1 className="big-header pb-4 mb-2 d-flex">
                {t("Клипы исполнителя")}: <Select model={model} />
            </h1>

            {models.length == 0 && <Empty text={t("Ничего не найдено")} />}

            <div className="row">

                {models.map((clip, index) => {
                    return (
                        <div className="col-6 col-md-4 col-lg-3 mb-4" key={index}>
                            <ClipItem model={clip} hidePremiere hideSinger className="px-0" />
                        </div>
                    );
                })}
            </div>
        </div>
    </div >;
}

export const getServerSideProps = withSession(async function ({ req, res, query: { person_clips }, locale }) {
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
        let data = await get(`clip/person?id=${person_clips}`, params);

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
                    models: [],
                    model: null
                },
                user
            }
        };
    }
});