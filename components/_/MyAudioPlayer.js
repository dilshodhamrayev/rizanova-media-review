import React, { useEffect, useRef } from 'react';


export default function MyAudioPlayer(props) {
    const playerRef = useRef(new Audio());

    const { url, playing, ref, onProgress, onEnded } = props;

    useEffect(() => {
        if (playerRef) {
            if (playing)
                playerRef.current.play();
            else
                playerRef.current.pause();
        }
    }, [props.playing]);

    useEffect(() => {
        if (playerRef) {
            // playerRef.current.pause();
            // playerRef.current.load();
            // playerRef.current.play();
        }
    }, [props.url]);

    return (
        <audio preload="auto" ref={playerRef}>
            {url instanceof Array ? url.map((source, index) => <source src={source.src} type={source.type} key={index} />) : <source src={source.src} type={source.type} />}
        </audio>
    )
}