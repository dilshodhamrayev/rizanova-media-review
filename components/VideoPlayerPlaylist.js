import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useState } from "react";
import { useContext } from "react";
import { get } from "../utils/request";
import { MEDIA_LINKS } from "../utils/types";
import { GlobalContext } from "./context";
import VideoPlayerPlaylistItem from "./items/VideoPlayerPlaylistItem";

export default function VideoPlayerPlaylist({ show = false, goNext = false }) {
    const { store: { videoPlayer }, dispatch } = useContext(GlobalContext);
    const router = useRouter();

    const [playlist, setPlaylist] = useState([]);

    useEffect(() => {
        const fetchList = async () => {
            let res = await get(`search/playlist${videoPlayer.playlist.length > 0 ? `?exclude=${videoPlayer.playlist.map(v => v.id)}` : ``}`);

            setPlaylist(res);
        };

        fetchList();

    }, [videoPlayer.playlist]);

    useEffect(() => {
        if (goNext) {
            if (videoPlayer.playlist.length > 0) {
                router.push(`/${MEDIA_LINKS[videoPlayer.playlist[0].type]}/${videoPlayer.playlist[0].id}`);
            }/* else if (playlist.length > 0) {
                router.push(`/${MEDIA_LINKS[playlist[0].type]}/${playlist[0].id}`);
            }*/
        }

    }, [goNext]);

    if (!show) return <></>;

    return (
        <div className="video-playlist p-3 p-md-3 p-lg-4">
            <div className="row">
                {videoPlayer.playlist.map((model, index) => {
                    return (
                        <VideoPlayerPlaylistItem key={index} model={model} showRemove />
                    )
                })}
                {playlist.map((model, index) => {
                    return (
                        <VideoPlayerPlaylistItem key={index} model={model} />
                    )
                })}
            </div>
        </div>
    );
}