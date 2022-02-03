import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';
import useSWR from 'swr';
import { get } from '../../utils/request';
import Head from 'next/head';
import Link from 'next/link';
import MusicSidebar from '../../components/sidebars/MusicSidebar';
import { useTranslation } from 'next-i18next';
import moment from 'moment';
import { GlobalContext } from '../../components/context';
import { TYPE_AP_SET_PLAYING, TYPE_AP_SET_TRACKS } from '../../reducers/audioPlayerReducer';
import Image from 'next/image';
import withSession from '../../utils/session';
import SingleFavoriteBtn from '../../components/buttons/SingleFavoriteBtn';
import SingleMusicItem from '../../components/items/SingleMusicItem';
import LongShareBtn from '../../components/buttons/LongShareBtn';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Collapse } from 'react-bootstrap';
import InfoBtn from '../../components/buttons/InfoBtn';
import ChartBadge from '../../components/parts/ChartBadge';

export default function MusicView(props) {
    const router = useRouter();
    const { t, i18n } = useTranslation();

    const [isOpenInfo, setIsOpenInfo] = useState(false);

    const { music_id } = router.query;

    const { data: { model, albums, models } } = useSWR(`music/get?id=${music_id}`, get, { initialData: props.data });

    const { store: { audioPlayer }, dispatch } = useContext(GlobalContext);

    const play = (music_id) => {
        if (audioPlayer.currentTrackId === model.id)
            dispatch({ type: TYPE_AP_SET_PLAYING, payload: !audioPlayer.playing });
        else {
            dispatch({ type: TYPE_AP_SET_TRACKS, payload: [model], currentTrackId: model.id });
        }
    }

    const title = model.author.name + " — " + model.name /*+ ". " + t("Слушать онлайн на сайте RizaNova")*/;
    const description = t("Слушайте онлайн узбекских треков и альбомов в хорошем качестве на сайте RizaNova.");
    const keywords = t("премьеры последние новые узбекских треки музыки альбомы чарт плейлисты исполнители певец певицы");

    return <div>
        <Head>
            <title>{title}</title>
            <meta property="og:title" content={title} />
            <meta name="description" content={description} />
            <meta property="og:description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta property="og:image" content={model.image_path} />
        </Head>

        <div className="container min-view">
            <h2 className="big-header">{t("Музыка")}</h2>

            <div className="row">
                <div className="col-md-3">
                    <MusicSidebar />
                </div>
                <div className="col-md-9 pb-5">
                    <div className="album-page">
                        <div className="details">
                            <div className="d-flex">
                                <div className="image">
                                    <Image src={model.image_path} className="w-100" width={256} height={256} layout="responsive" alt={model.name} unoptimized loading='lazy' />
                                </div>
                                <div className="info">
                                    <h2 className="mt-0 d-inline-flex align-items-center w-100">{t("Сингл")} • {moment(model.release_date, "YYYY-MM-DD").format("YYYY")} {model.chart_place && <> • <ChartBadge place={model.chart_place} className='ms-2' /></>}</h2>
                                    <h1>{model.name} </h1>

                                    <p className="singer">
                                        {t("Исполнитель")}: <Link href={`/person/${model.author_id}`}><a>{model.author.name}</a></Link>{model.authors.length > 0 && <span>, </span>}
                                        {model.authors.map((author, index) => {
                                            return (
                                                <React.Fragment key={index}>
                                                    <Link href={`/person/${author.id}`}>
                                                        <a className="flex-shrink-0">{author.name}</a>
                                                    </Link>
                                                    {index !== model.authors.length - 1 && <span>, </span>}
                                                </React.Fragment>
                                            );
                                        })}
                                    </p>
                                    <Collapse in={isOpenInfo}>
                                        <div>
                                            {model.persons?.author_texts.length > 0 && <p className="singer">
                                                {t("Автор текста")}: {model.persons.author_texts.map((author, index) => {
                                                    return (
                                                        <React.Fragment key={index}>
                                                            <Link href={`/person/${author.id}`}>
                                                                <a className="flex-shrink-0">{author.name}</a>
                                                            </Link>
                                                            {index !== model.persons.author_texts.length - 1 && <span>, </span>}
                                                        </React.Fragment>
                                                    );
                                                })}
                                            </p>}
                                            {model.persons?.compositors.length > 0 && <p className="singer">
                                                {t("Композитор")}: {model.persons.compositors.map((author, index) => {
                                                    return (
                                                        <React.Fragment key={index}>
                                                            <Link href={`/person/${author.id}`}>
                                                                <a className="flex-shrink-0">{author.name}</a>
                                                            </Link>
                                                            {index !== model.persons.compositors.length - 1 && <span>, </span>}
                                                        </React.Fragment>
                                                    );
                                                })}
                                            </p>}
                                            {model.persons.producers.length > 0 && <p className="singer">
                                                {t("Продюсер")}: {model.persons.producers.map((author, index) => {
                                                    return (
                                                        <React.Fragment key={index}>
                                                            <Link href={`/person/${author.id}`}>
                                                                <a className="flex-shrink-0">{author.name}</a>
                                                            </Link>
                                                            {index !== model.persons.producers.length - 1 && <span>, </span>}
                                                        </React.Fragment>
                                                    );
                                                })}
                                            </p>}
                                        </div>
                                    </Collapse>
                                    <p className="tracks-info">{t("Длительность")} {model.duration}</p>
                                    <div className="d-flex">
                                        <a role="button" className="btn-spec me-3" onClick={() => {
                                            play();
                                        }}>
                                            {(audioPlayer.currentTrackId === model.id) && audioPlayer.playing ? (
                                                <svg className="me-2" height="10" viewBox="-45 0 327 327" width="8" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="m158 0h71c4.417969 0 8 3.582031 8 8v311c0 4.417969-3.582031 8-8 8h-71c-4.417969 0-8-3.582031-8-8v-311c0-4.417969 3.582031-8 8-8zm0 0" />
                                                    <path d="m8 0h71c4.417969 0 8 3.582031 8 8v311c0 4.417969-3.582031 8-8 8h-71c-4.417969 0-8-3.582031-8-8v-311c0-4.417969 3.582031-8 8-8zm0 0" />
                                                </svg>
                                            ) : (
                                                <svg className="me-2" width="8" height="10" viewBox="0 0 8 10" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M0.332031 1.547V8.45366C0.332031 8.98033 0.912031 9.30033 1.3587 9.01366L6.78536 5.56033C7.1987 5.30033 7.1987 4.70033 6.78536 4.43366L1.3587 0.986998C0.912031 0.700331 0.332031 1.02033 0.332031 1.547Z" />
                                                </svg>
                                            )}

                                            {t("Слушать")}
                                        </a>
                                        <SingleFavoriteBtn model={model} />
                                        <InfoBtn isOpen={isOpenInfo} setOpen={setIsOpenInfo} className="album-tool me-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                                                <circle cx="16" cy="16" r="15.5" stroke="#BDBDBD" />
                                                <path fillRule="evenodd" clipRule="evenodd" d="M15.9825 6.09617C15.2772 6.35044 14.7482 6.83079 14.4215 7.51366C14.2243 7.92593 14.2054 8.02576 14.2054 8.66C14.2054 9.28812 14.225 9.39477 14.4098 9.7716C15.0694 11.117 16.6401 11.6901 17.9548 11.065C18.5813 10.7672 18.9213 10.4342 19.2231 9.82329C19.4718 9.31987 19.4855 9.25721 19.4843 8.6286C19.4832 8.05765 19.4573 7.90988 19.2981 7.56799C19.0405 7.01462 18.5523 6.51677 18.0009 6.24512C17.6022 6.04865 17.4639 6.01773 16.9168 6.00265C16.48 5.99063 16.1965 6.01905 15.9825 6.09617ZM17.575 7.16935C17.8962 7.33275 18.2369 7.69513 18.3704 8.01513C18.5933 8.5496 18.4433 9.35864 18.0396 9.79814C17.7991 10.0601 17.2391 10.2913 16.8455 10.2913C16.2022 10.2913 15.5543 9.86143 15.3065 9.27013C15.255 9.14716 15.2131 8.85015 15.2135 8.61012C15.2146 7.84582 15.7271 7.20721 16.4864 7.02373C16.783 6.9521 17.2782 7.01831 17.575 7.16935ZM13.8928 12.764C11.8959 13.2029 11.5453 13.2986 11.4238 13.4382C11.3108 13.5681 11.25 13.8437 11.1224 14.8051C10.9638 15.9991 10.9636 16.0109 11.0971 16.1905C11.273 16.4273 11.4603 16.4426 12.4131 16.2986C12.8473 16.233 13.2163 16.1932 13.2332 16.21C13.2501 16.2269 12.95 17.1612 12.5663 18.2862C12.1825 19.4113 11.8094 20.5784 11.7371 20.8799C11.266 22.8461 11.707 24.664 12.8474 25.4561C13.4115 25.8479 13.9864 26.0028 14.8655 26C16.8756 25.9935 18.4515 24.9316 19.5138 22.8676C19.8971 22.1228 20.1554 21.3572 20.0978 21.1369C20.0766 21.0556 19.6989 20.6771 19.2586 20.2957C18.2282 19.4034 18.1413 19.3957 17.5811 20.1476C17.2102 20.6454 16.4889 21.3879 16.4318 21.3308C16.4126 21.3115 16.9277 19.3967 17.5764 17.0755C18.2252 14.7543 18.756 12.7931 18.756 12.7171C18.756 12.6412 18.6793 12.5023 18.5855 12.4085C18.4181 12.2412 18.3946 12.2381 17.3176 12.2452C16.2226 12.2525 16.2152 12.2536 13.8928 12.764ZM17.5529 13.3764C17.5325 13.4295 17.0288 15.2193 16.4335 17.3539C15.2959 21.433 15.2239 21.7935 15.4567 22.2437C15.588 22.4976 15.7565 22.5897 16.0895 22.5897C16.5228 22.5897 16.9418 22.3281 17.6686 21.604C18.0449 21.2291 18.3678 20.9223 18.3863 20.9223C18.4047 20.9223 18.554 21.039 18.718 21.1817C19.013 21.4384 19.0153 21.4439 18.9288 21.6891C18.6397 22.5086 17.9866 23.5128 17.421 24.0075C16.7387 24.6044 15.6664 25.0213 14.8135 25.0213C14.4207 25.0213 13.7564 24.8313 13.4549 24.6327C12.7238 24.1511 12.4108 22.8641 12.6707 21.4086C12.7662 20.8738 13.243 19.4016 14.1005 16.9941C14.3684 16.2421 14.5876 15.5575 14.5876 15.4728C14.5876 15.3883 14.5077 15.2441 14.4101 15.1524L14.2327 14.9857L13.1824 15.14C12.6048 15.2248 12.1234 15.2855 12.1128 15.2748C12.091 15.2531 12.2331 14.2306 12.2627 14.1957C12.2731 14.1834 13.1834 13.9749 14.2856 13.7324C15.9126 13.3744 16.412 13.2903 16.9398 13.2857C17.4671 13.2811 17.5828 13.2983 17.5529 13.3764Z" fill="white" />
                                            </svg>
                                        </InfoBtn>
                                        <LongShareBtn className="album-tool">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M19.5153 6.05511C18.8601 6.177 18.311 6.47208 17.8118 6.97044C17.4245 7.35721 17.1596 7.77668 17.0151 8.23241C16.783 8.96373 16.7843 9.41985 17.0211 10.3943C17.0381 10.464 16.6949 10.6886 14.3946 12.1133C12.9394 13.0147 11.7349 13.7577 11.718 13.7643C11.7012 13.771 11.55 13.6611 11.382 13.52C11.0231 13.2188 10.4991 12.9442 10.0608 12.8277C9.64396 12.7169 8.89549 12.7094 8.49809 12.812C7.50772 13.0676 6.6599 13.7681 6.26781 14.6547C6.06263 15.1187 6 15.4329 6 15.9986C6 16.5643 6.06263 16.8785 6.26781 17.3425C6.65224 18.2117 7.4883 18.9141 8.4416 19.1686C8.89354 19.2892 9.60872 19.2896 10.0608 19.1695C10.4991 19.053 11.0231 18.7784 11.382 18.4772C11.55 18.3361 11.7012 18.2262 11.718 18.2329C11.7349 18.2396 12.9394 18.9825 14.3946 19.8839C16.6949 21.3086 17.0381 21.5332 17.0211 21.6029C16.7836 22.5804 16.7832 23.0629 17.0195 23.7732C17.1786 24.2513 17.406 24.6131 17.7963 25.0083C18.3251 25.5438 18.8974 25.8421 19.6213 25.9596C21.2568 26.225 22.8624 25.1568 23.2895 23.5192C23.469 22.8309 23.3742 21.9477 23.0503 21.2919C22.488 20.1534 21.358 19.4586 20.0818 19.4667C19.2369 19.472 18.5216 19.7529 17.8886 20.3278L17.6791 20.5181L16.2336 19.6206C15.4385 19.1271 14.2343 18.3806 13.5574 17.9619C12.8806 17.5431 12.3229 17.1973 12.3182 17.1933C12.3136 17.1894 12.3432 17.0754 12.3842 16.9401C12.5622 16.3521 12.5622 15.6452 12.3842 15.0571C12.3432 14.9218 12.3136 14.8078 12.3182 14.8039C12.3229 14.7999 12.8806 14.4541 13.5574 14.0354C14.2343 13.6166 15.4385 12.8704 16.2336 12.3771L17.6791 11.4802L17.9221 11.6981C18.9159 12.5891 20.3562 12.7913 21.5473 12.2072C22.4065 11.7859 23.0656 10.9665 23.2901 10.0407C23.4051 9.5669 23.4048 8.92001 23.2895 8.478C22.8516 6.79908 21.2035 5.741 19.5153 6.05511ZM20.6705 7.2706C21.7432 7.58568 22.3848 8.66865 22.1326 9.73833C22.0438 10.1153 21.86 10.4388 21.5704 10.7284C21.1294 11.1695 20.5854 11.3778 19.9841 11.3361C19.4409 11.2983 19.0112 11.1021 18.6349 10.7199C17.816 9.88812 17.8578 8.51327 18.7259 7.73281C18.9476 7.53349 19.2103 7.3871 19.5348 7.28204C19.8142 7.1916 20.382 7.1859 20.6705 7.2706ZM9.93767 14.0382C10.5323 14.2514 11.0094 14.7342 11.2188 15.3344C11.3447 15.6956 11.3444 16.303 11.2182 16.6628C11.0081 17.2616 10.5285 17.748 9.94209 17.957C9.61575 18.0733 9.08302 18.0977 8.75203 18.0115C7.81811 17.7684 7.18931 16.9596 7.18931 16.0016C7.18931 15.0578 7.78072 14.2702 8.69343 13.9985C9.01188 13.9037 9.61642 13.923 9.93767 14.0382ZM20.5803 20.7065C21.3375 20.8851 21.9537 21.4995 22.1314 22.2535C22.3848 23.3288 21.7457 24.4108 20.6705 24.7266C20.3936 24.8079 19.8463 24.8076 19.5712 24.7259C18.8492 24.5116 18.3276 23.99 18.1132 23.2679C18.0335 22.9994 18.032 22.4921 18.1101 22.1925C18.3091 21.4285 18.9906 20.805 19.7692 20.6747C19.9883 20.638 20.35 20.6522 20.5803 20.7065Z" fill="white" />
                                                <circle cx="16" cy="16" r="15.5" stroke="#BDBDBD" />
                                            </svg>
                                        </LongShareBtn>

                                    </div>
                                </div>
                            </div>
                        </div>

                        {models.length > 0 && <Link href={"/person/music/" + model.author_id}>
                            <nav className="title-nav cursor-pointer mt-5">
                                <a>
                                    <h3 className={"title-2 mb-0 mt-0"}>{t("Последние треки исполнителя")}</h3>
                                </a>

                                <a className="show-all mb-0">
                                    <span>
                                        {t("Показать все")}
                                    </span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="20" viewBox="0 0 11 20" fill="none">
                                        <path
                                            d="M0.38 19.01C0.87 19.5 1.66 19.5 2.15 19.01L10.46 10.7C10.85 10.31 10.85 9.68005 10.46 9.29005L2.15 0.980049C1.66 0.490049 0.87 0.490049 0.38 0.980049C-0.11 1.47005 -0.11 2.26005 0.38 2.75005L7.62 10L0.37 17.25C-0.11 17.73 -0.11 18.5301 0.38 19.01Z" />
                                    </svg>
                                </a>
                            </nav>
                        </Link>}
                        <div className="album-musics mt-2">
                            {models.length > 0 && <>
                                <div className="album-music-list">
                                    <div className={"d-flex album-music-item album-music-header align-items-center justify-content-between "}>
                                        <div className="number"></div>
                                        <div className="composition-name">
                                            {t("Название")}
                                        </div>
                                        <div className="favorite favorite-element">

                                        </div>
                                        <div className="time d-flex justify-content-center">
                                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M8.94609 0C4.18637 0 0.332031 3.864 0.332031 8.625C0.332031 13.386 4.18637 17.25 8.94609 17.25C13.7144 17.25 17.5774 13.386 17.5774 8.625C17.5774 3.864 13.7144 0 8.94609 0ZM8.95472 15.525C5.14349 15.525 2.05657 12.4373 2.05657 8.625C2.05657 4.81275 5.14349 1.725 8.95472 1.725C12.7659 1.725 15.8529 4.81275 15.8529 8.625C15.8529 12.4373 12.7659 15.525 8.95472 15.525ZM8.76502 4.3125H8.71328C8.36837 4.3125 8.09245 4.5885 8.09245 4.9335V9.0045C8.09245 9.30637 8.24766 9.591 8.51496 9.74625L12.0934 11.8939C12.3865 12.0664 12.7659 11.9801 12.9384 11.6869C13.1195 11.3936 13.0246 11.0055 12.7228 10.833L9.38585 8.84925V4.9335C9.38585 4.5885 9.10993 4.3125 8.76502 4.3125Z" fill="#4F4F4F" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="album-music-list">
                                    {models.map((music, index) => {
                                        return (
                                            <SingleMusicItem model={music} order={index + 1} key={index} models={models} />
                                        );
                                    })}
                                </div>
                            </>}

                            {albums.length > 0 && <>

                                <Link href={"/person/album/" + model.author_id}>
                                    <nav className="title-nav cursor-pointer mt-5">
                                        <a>
                                            <h3 className={"title-2 mb-0 mt-0"}>{t("Другие альбомы исполнителя")}</h3>
                                        </a>

                                        <a className="show-all mb-0">
                                            <span>
                                                {t("Показать все")}
                                            </span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="20" viewBox="0 0 11 20" fill="none">
                                                <path
                                                    d="M0.38 19.01C0.87 19.5 1.66 19.5 2.15 19.01L10.46 10.7C10.85 10.31 10.85 9.68005 10.46 9.29005L2.15 0.980049C1.66 0.490049 0.87 0.490049 0.38 0.980049C-0.11 1.47005 -0.11 2.26005 0.38 2.75005L7.62 10L0.37 17.25C-0.11 17.73 -0.11 18.5301 0.38 19.01Z" />
                                            </svg>
                                        </a>
                                    </nav>
                                </Link>

                                <div className="row mt-4">
                                    {albums.map((album, index) => {
                                        return (
                                            <div className="col-6 col-md-6 col-lg-4" key={index}>
                                                <Link href={`/music/album/${album.id}`}>
                                                    <a>
                                                        <div className="album">
                                                            <div className="image">
                                                                <Image src={album.image_path} className="w-100" width={256} height={256} alt={album.name} layout="responsive" />
                                                            </div>
                                                            <div className="info">
                                                                <p className="name">{album.name}</p>
                                                                <p className="year">{moment(album.release_date, "YYYY-MM-DD").format("YYYY")} {t("Альбом")}</p>
                                                            </div>
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
                </div>
            </div>
        </div>
    </div>;
}

export const getServerSideProps = withSession(async function ({ req, res, query: { music_id }, locale }) {
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
        let data = await get(`music/get?id=${music_id}`, params);

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