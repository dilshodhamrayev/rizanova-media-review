import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import useSWR from 'swr';
import { get } from '../../../utils/request';
import Head from 'next/head';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { GlobalContext } from '../../../components/context';
import FilmItem from '../../../components/items/FilmItem';
import withSession from '../../../utils/session';
import Select from '../../../components/Select';
import Empty from '../../../components/Empty';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function View(props) {
    const router = useRouter();

    const {t, i18n} = useTranslation();

    const { person_serials } = router.query;

    const { data: { model, models } } = useSWR(`serial/person?id=${person_serials}`, get, { initialData: props.data });

    const { store: { audioPlayer }, dispatch } = useContext(GlobalContext);

    const title = model.name + ' — ' + t("сериалы");
    const description = t("Смотреть онлайн узбекских сериалов в хорошем качестве на сайте RizaNova.");
    const keywords = t("премьеры последние новые узбекских сериал сериалы исполнители певец певицы");

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
                <li><Link href="/serial"><a>{t("Сериалы")}</a></Link></li>
                <li><span>/</span></li>
                <li><p>{model.name}</p></li>
            </ul>

            <h1 className="big-header pb-4 mb-2 d-flex">
                {t("Сериалы персона")}: <Select model={model} />
            </h1>

            {models.length == 0 && <Empty text={t("Ничего не найдено")} />}

            <div className="row">
                {models.map((serial, index) => {
                    return (
                        <div className="col-6 col-md-4 col-lg-3 mb-4" key={index}>
                            <FilmItem model={serial} hidePremiere className="px-0" link="serial" />
                        </div>
                    );
                })}
            </div>
        </div>
    </div >;
}

export const getServerSideProps = withSession(async function ({ req, res, query: { person_serials }, locale }) {
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
        let data = await get(`serial/person?id=${person_serials}`, params);

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