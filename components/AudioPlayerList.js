import React, { useContext } from 'react';
import { useTranslation } from 'next-i18next';
import { GlobalContext } from './context';
import ChartItem from './items/ChartItem';
import Empty from './Empty';

export default function AudioPlayerList({ isOpen, setIsOpen }) {
    const { store: { audioPlayer } } = useContext(GlobalContext);
    const {t, i18n} = useTranslation();

    return (
        <div className={`rizanova-audio-playerlist ${isOpen ? '' : 'd-none'}`}>
            <div className="container py-3 position-relative">
                <div className="d-flex justify-content-end close">
                    <a role="button" className="d-inline" onClick={() => setIsOpen(!isOpen)}>
                        <svg className="d-inline" width="20" height="20" viewBox="0 0 5 5" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M4.83099 0.984828L3.31602 2.49997L4.83099 4.01503C5.05634 4.24046 5.05634 4.60563 4.83099 4.83107C4.7184 4.94366 4.57078 5 4.42324 5C4.27545 5 4.12782 4.94375 4.01531 4.83107L2.50001 3.31583L0.984821 4.83105C0.872242 4.94365 0.724611 4.99999 0.576936 4.99999C0.429305 4.99999 0.281774 4.94373 0.169094 4.83105C-0.05625 4.60572 -0.05625 4.24054 0.169094 4.01502L1.68402 2.49995L0.169008 0.984828C-0.0563361 0.759482 -0.0563361 0.394226 0.169008 0.16888C0.39431 -0.0562934 0.759348 -0.0562934 0.984735 0.16888L2.49999 1.68402L4.01514 0.16888C4.24057 -0.0562934 4.60565 -0.0562934 4.83091 0.16888C5.05634 0.394226 5.05634 0.759482 4.83099 0.984828Z"
                                fill="#8E8E8E" />
                        </svg>
                    </a>
                </div>

                <div className="rizanova-audio-playlist">
                    <div className="row justify-content-center">
                        <div className="col-md-7">
                            <h3 className="title-2 mt-0 mb-3">{t("Очередь прослушивания")}</h3>
                            <hr />
                            {audioPlayer.currentPlaylist && <h4 className="title-3 mt-0 mb-2">{t("Сейчас играет")}: <span className="current-playlist">{audioPlayer.currentPlaylist}</span></h4>}

                            <ul className="chart-list">
                                {audioPlayer.originalTracks.map((model, index) => {
                                    return (
                                        <ChartItem model={model} key={index} showTrash />
                                    );
                                })}

                                {audioPlayer.originalTracks.length === 0 && <Empty text={t("Список пуст")} />}
                            </ul>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}