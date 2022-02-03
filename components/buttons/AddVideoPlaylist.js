import React, { useContext } from 'react';
import Tooltip from 'react-tooltip-lite';
import { useTranslation } from "next-i18next";

import { GlobalContext } from '../context';
import { TYPE_VP_ADD_TO_PLAYLIST, TYPE_VP_REMOVE_FROM_PLAYLIST } from '../../reducers/videoPlayerReducer';
import { useMemo } from 'react';
import { toast } from 'react-toastify';

export default function AddVideoPlaylist({ model }) {
    const { t, i18n } = useTranslation();

    const { store: { videoPlayer, auth }, dispatch } = useContext(GlobalContext);

    const current = useMemo(() => {
        return videoPlayer.playlist.find(v => v.id === model.id);
    }, [videoPlayer.playlist, model]);

    if (!auth.isAuth) return <></>;

    return (
        <Tooltip direction="down" className='add-to-video-playlist' content={current ? t("Удалить из очереди") : t("Добавить в очередь")}>
            <a role="button" className='m-0' onClick={() => {
                if (current) {
                    dispatch({ type: TYPE_VP_REMOVE_FROM_PLAYLIST, payload: model.id });
                    toast.success(t("Видео удален из очереди"), { toastId: "video-playlist-handle", updateId: "video-playlist-handle", hideProgressBar: true });
                } else {
                    dispatch({ type: TYPE_VP_ADD_TO_PLAYLIST, payload: model });
                    toast.success(t("Видео добавлен в очередь"), { toastId: "video-playlist-handle", updateId: "video-playlist-handle", hideProgressBar: true });
                }
            }}>
                {current ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="13" viewBox="0 0 26 13" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd" d="M0 1.28212V2.56425H7.71788H15.4358V1.28212V0H7.71788H0V1.28212ZM0 6.41061V7.69274H7.71788H15.4358V6.41061V5.12849H7.71788H0V6.41061ZM0 11.5894V12.8715H5.15363H10.3073V11.5894V10.3073H5.15363H0V11.5894Z" fill="black" />
                        <path d="M18 10.3073H15.4358H12.8715V11.5894V12.8715H15.4358H18H20.6145H23.1788H25.743V11.5894V10.3073H23.1792H20.6154H19.3077H18Z" fill="white" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="18" viewBox="0 0 26 18" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd" d="M0 1.28212V2.56425H7.71788H15.4358V1.28212V0H7.71788H0V1.28212ZM0 6.41061V7.69274H7.71788H15.4358V6.41061V5.12849H7.71788H0V6.41061ZM18.0343 5.16117C18.0155 5.18008 18 6.34565 18 7.75141V10.3073H15.4358H12.8715V11.5894V12.8715H15.4358H18V15.4358V18H19.3073H20.6145V15.4358V12.8715H23.1788H25.743V11.5894V10.3073H23.1792H20.6154L20.6024 7.73045L20.5894 5.15363L19.329 5.14021C18.6359 5.13282 18.0532 5.14227 18.0343 5.16117ZM0 11.5894V12.8715H5.15363H10.3073V11.5894V10.3073H5.15363H0V11.5894Z" fill="white" />
                    </svg>
                )}
            </a>
        </Tooltip >
    )
}