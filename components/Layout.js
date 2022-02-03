import Head from 'next/head'
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import AudioPlayer from './AudioPlayer';
import { GlobalContext } from './context';
import Footer from './Footer'
import Header from './Header'
import Preloader from './Preloader';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import ReactTooltip from "react-tooltip";

export default function Layout({ children }) {
    const globalContext = useContext(GlobalContext);

    const router = useRouter();

    const { t } = useTranslation();

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <>
            <div className={`rizanova-content ${globalContext.store.theme} ${globalContext.store.audioPlayer.currentTrackId ? 'audio-player-open' : ''}`}>
                <Head>
                    <link rel="canonical" href={`https://rizanova.uz${router.asPath === "/" ? '' : router.asPath}`} />

                    <link rel="alternate" hrefLang='uz' href={`https://rizanova.uz${router.asPath === "/" ? '' : router.asPath}`} />
                    <link rel="alternate" hrefLang='ru' href={`https://rizanova.uz/ru${router.asPath === "/" ? '' : router.asPath}`} />
                </Head>

                {globalContext.store.routeStatus && <Preloader />}

                <Header />

                {children}

                <Footer />

                {isMounted && <ReactTooltip insecure={true} multiline clickable globalEventOff="click" id={"favoriteTip"} place="bottom" effect="float">
                    <div>{t("Войдите, чтобы отмечать понравившееся")}</div>
                    <Link href="/login">
                        <a className="btn btn-spec btn-spec-smaller mt-2">{t("Войти")}</a>
                    </Link>
                </ReactTooltip>}
                {isMounted && <ReactTooltip insecure={true} multiline clickable globalEventOff="click" id={"seeLaterTip"} place="bottom" effect="float">
                    <div>{t(`Войдите, чтобы добавить в плейлист "смотреть позже"`)}</div>
                    <Link href="/login">
                        <a className="btn btn-spec btn-spec-smaller mt-2">{t("Войти")}</a>
                    </Link>
                </ReactTooltip>}

                <AudioPlayer />
            </div>
        </>
    )
}