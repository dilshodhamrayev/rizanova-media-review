import Link from "next/link";
import { useContext } from "react";
import { TYPE_VP_REMOVE_FROM_PLAYLIST } from "../../reducers/videoPlayerReducer";
import { MEDIA_LINKS } from "../../utils/types";
import { GlobalContext } from "../context";

export default function VideoPlayerPlaylistItem({ model, showRemove = false }) {
    const { store: { videoPlayer }, dispatch } = useContext(GlobalContext);

    return (
        <div className="col-xl-3 col-lg-3 col-md-4 col-6 mb-3 px-1 px-md-2">

            <div className="video-player-playlist-item">
                <Link href={`/${MEDIA_LINKS[model.type]}/${model.id}`}>
                    <a>
                        <img className="w-100" src={model.image_path} alt={model.name} />
                        <div className="video-player-playlist-item-cover">
                            <div>

                                <p className="video-player-playlist-item-title"><b>{model.name}</b></p>
                                {model.authors?.length > 0 && <p className="video-player-playlist-item-subtitle"><b>{model.authors.map(a => a.name).join(", ")}</b></p>}
                            </div>
                            {model.duration && <p className="video-player-playlist-item-duration">{model.duration.startsWith("00:") ? model.duration.replace("00:", "") : model.duration}</p>}
                        </div>
                    </a>
                </Link>
                {showRemove && <a role="button" className="video-player-playlist-item-remove" onClick={() => {
                    dispatch({ type: TYPE_VP_REMOVE_FROM_PLAYLIST, payload: model.id });
                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 22 22" fill="none">
                        <path d="M21.5 0.516862C20.85 -0.133138 19.8 -0.133138 19.15 0.516862L11 8.6502L2.84998 0.500195C2.19998 -0.149805 1.14998 -0.149805 0.499982 0.500195C-0.150018 1.1502 -0.150018 2.2002 0.499982 2.8502L8.64998 11.0002L0.499982 19.1502C-0.150018 19.8002 -0.150018 20.8502 0.499982 21.5002C1.14998 22.1502 2.19998 22.1502 2.84998 21.5002L11 13.3502L19.15 21.5002C19.8 22.1502 20.85 22.1502 21.5 21.5002C22.15 20.8502 22.15 19.8002 21.5 19.1502L13.35 11.0002L21.5 2.8502C22.1333 2.21686 22.1333 1.1502 21.5 0.516862Z" fill="white" />
                    </svg>
                </a>}
            </div>

        </div>
    );
}