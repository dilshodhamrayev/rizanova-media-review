import React, { useContext, useEffect, useState } from "react";
import { get } from "../../utils/request";
import { GlobalContext } from "../context";
import { useTranslation } from "next-i18next";
import ReactTooltip from "react-tooltip";
import useUser from "../../utils/useUser";
import { toast } from "react-toastify";
import Tooltip from "react-tooltip-lite";

export default function HeartFavoriteBtn({ model, type = "video", className = "", fill }) {
    const [favorite, setFavorite] = useState(false);

    const { user, mutate } = useUser();

    const { t } = useTranslation();

    useEffect(() => {
        setFavorite(model.favorite);
    }, [model.favorite]);

    useEffect(() => {
        if (user)
            ReactTooltip.rebuild();
    }, [user]);

    const handleClick = async () => {

        let res = type === "video" ? await get(`account/favorite-video?video_id=${model.id}`) : (type === "music" ? await get(`account/favorite-music?music_id=${model.id}`) : await get(`account/favorite-album?album_id=${model.id}`));

        if (res?.status === 'liked') {
            setFavorite(true);
            toast.success(t('Добавлено в понравившиеся'), { toastId: "video-favorite", updateId: 'video-favorite', hideProgressBar: true })
        } else {
            setFavorite(false);
            toast.dismiss("video-favorite")
        }
    }

    return (
        user ? (
            <Tooltip direction="down" content={t("Добавить в понравившеися")}>
                <a role="button" className={className + " display-inline-block"} onClick={() => {
                    handleClick();
                }}>
                    {favorite ? (
                        <svg className="liked-heart" xmlns="http://www.w3.org/2000/svg" width="22" height="18" viewBox="0 0 22 18">
                            <path d="M18.66 0.990044C16.02 -0.809956 12.76 0.0300438 11 2.09004C9.23997 0.0300438 5.97997 -0.819956 3.33997 0.990044C1.93997 1.95004 1.05997 3.57004 0.999969 5.28004C0.859969 9.16004 4.29997 12.27 9.54997 17.04L9.64997 17.13C10.41 17.82 11.58 17.82 12.34 17.12L12.45 17.02C17.7 12.26 21.13 9.15004 21 5.27004C20.94 3.57004 20.06 1.95004 18.66 0.990044Z" />
                        </svg>
                    ) : (
                        <svg {...(fill ? { fill } : {})} xmlns="http://www.w3.org/2000/svg" width="22" height="18"
                            viewBox="0 0 22 18">
                            <path d="M18.66 0.990044C16.02 -0.809956 12.76 0.0300438 11 2.09004C9.23997 0.0300438 5.97997 -0.819956 3.33997 0.990044C1.93997 1.95004 1.05997 3.57004 0.999969 5.28004C0.859969 9.16004 4.29997 12.27 9.54997 17.04L9.64997 17.13C10.41 17.82 11.58 17.82 12.34 17.12L12.45 17.02C17.7 12.26 21.13 9.15004 21 5.27004C20.94 3.57004 20.06 1.95004 18.66 0.990044ZM11.1 15.55L11 15.65L10.9 15.55C6.13997 11.24 2.99997 8.39004 2.99997 5.50004C2.99997 3.50004 4.49997 2.00004 6.49997 2.00004C8.03997 2.00004 9.53997 2.99004 10.07 4.36004H11.94C12.46 2.99004 13.96 2.00004 15.5 2.00004C17.5 2.00004 19 3.50004 19 5.50004C19 8.39004 15.86 11.24 11.1 15.55Z" />
                        </svg>
                    )}
                </a>
            </Tooltip>
        ) : (
            <Tooltip direction="down" content={t("Добавить в понравившеися")}>
                <div className="d-flex align-items-center">
                    <a role="button" className={className} data-event="click" data-tip data-for={"favoriteTip"}>
                        <svg {...(fill ? { fill } : {})} xmlns="http://www.w3.org/2000/svg" width="22" height="18"
                            viewBox="0 0 22 18">
                            <path d="M18.66 0.990044C16.02 -0.809956 12.76 0.0300438 11 2.09004C9.23997 0.0300438 5.97997 -0.819956 3.33997 0.990044C1.93997 1.95004 1.05997 3.57004 0.999969 5.28004C0.859969 9.16004 4.29997 12.27 9.54997 17.04L9.64997 17.13C10.41 17.82 11.58 17.82 12.34 17.12L12.45 17.02C17.7 12.26 21.13 9.15004 21 5.27004C20.94 3.57004 20.06 1.95004 18.66 0.990044ZM11.1 15.55L11 15.65L10.9 15.55C6.13997 11.24 2.99997 8.39004 2.99997 5.50004C2.99997 3.50004 4.49997 2.00004 6.49997 2.00004C8.03997 2.00004 9.53997 2.99004 10.07 4.36004H11.94C12.46 2.99004 13.96 2.00004 15.5 2.00004C17.5 2.00004 19 3.50004 19 5.50004C19 8.39004 15.86 11.24 11.1 15.55Z" />
                        </svg>
                    </a>
                </div>
            </Tooltip >
        )

    );
}