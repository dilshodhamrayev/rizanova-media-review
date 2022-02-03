import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { useState, useRef, useEffect } from 'react';
import SearchResult from '../parts/SearchResult';
import axios from 'axios';
import { get } from '../../utils/request';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

const CancelToken = axios.CancelToken;
let cancel;

export default function SearchForm({ isSearchOpen, setIsSearchOpen }) {
    const {t, i18n} = useTranslation();

    const router = useRouter();

    const [musics, setMusics] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [videos, setVideos] = useState([]);
    const [persons, setPersons] = useState([]);

    const [isSearched, setIsSearched] = useState(false);

    const [value, setValue] = useState("");

    const ref = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (!isSearchOpen) {
            setMusics([]);
            setAlbums([]);
            setVideos([]);
            setPersons([]);

            setIsSearched(false);
            setValue("");
        }
    }, [isSearchOpen]);

    useEffect(() => {
        const fetchSearch = async () => {
            if (value.length > 1) {
                cancel && cancel();

                let response = await get(`search/all?query=${value}`, {
                    cancelToken: new CancelToken(function executor(c) {
                        cancel = c;
                    }),
                });

                if (response) {
                    setIsSearched(true);
                    setMusics(response.musics);
                    setAlbums(response.albums);
                    setVideos(response.videos);
                    setPersons(response.persons);
                }
            } else {
                setMusics([]);
                setAlbums([]);
                setPersons([]);
                setVideos([]);

                setIsSearched(false);
            }
        }

        fetchSearch();
    }, [value]);

    useEffect(() => {
        if (isSearchOpen) {
            if (inputRef.current)
                inputRef.current.focus();

            function handleClickOutside(event) {
                if (ref.current && !ref.current.contains(event.target) && event.target.className?.baseVal !== "search-form-closer") {
                    setIsSearchOpen(false);
                }
            }

            document.addEventListener("mousedown", handleClickOutside);

            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }

    }, [ref, isSearchOpen]);

    const length = musics.length + videos.length + albums.length + persons.length;

    return (
        <div ref={ref} className={'search ' + (isSearchOpen ? 'active' : '')}>
            <form onSubmit={(e) => {
                e.preventDefault();

                if (value.length > 1) {
                    router.push(`/search/${value}`);
                    setIsSearchOpen(false);
                } else {
                    toast.info(t("Пожалуйста, введите не менее 2 букв для поиска"), { toastId: 1 });
                }
            }} className='h-100 d-flex'>
                <input ref={inputRef} type="text" placeholder={t("Поиск")} value={value} onChange={(e) => {
                    setValue(e.target.value);
                }} />
                <button>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M15.5 13.9999H14.71L14.43 13.7299C15.63 12.3299 16.25 10.4199 15.91 8.38989C15.44 5.60989 13.12 3.38989 10.32 3.04989C6.09001 2.52989 2.53002 6.08989 3.05002 10.3199C3.39002 13.1199 5.61002 15.4399 8.39002 15.9099C10.42 16.2499 12.33 15.6299 13.73 14.4299L14 14.7099V15.4999L18.25 19.7499C18.66 20.1599 19.33 20.1599 19.74 19.7499C20.15 19.3399 20.15 18.6699 19.74 18.2599L15.5 13.9999ZM9.50002 13.9999C7.01002 13.9999 5.00002 11.9899 5.00002 9.49989C5.00002 7.00989 7.01002 4.99989 9.50002 4.99989C11.99 4.99989 14 7.00989 14 9.49989C14 11.9899 11.99 13.9999 9.50002 13.9999Z" fill="#828282" />
                    </svg>
                </button>
            </form>

            {isSearched && <div className="content">
                <div className='results'>
                    {videos.map((model, index) => {
                        let type = "";

                        switch (model.type) {
                            case 1: type = "clip"; break;
                            case 2: type = "film"; break;
                            case 3: type = "serial"; break;
                            case 4: type = "concert"; break;
                            case 5: type = "humor"; break;
                            case 6: type = "telenovella"; break;
                        }

                        return (
                            <SearchResult model={model} key={index} type={type} setIsSearchOpen={setIsSearchOpen} />
                        )
                    })}
                    {musics.map((model, index) => {
                        return (
                            <SearchResult model={model} key={index} type={"music"} setIsSearchOpen={setIsSearchOpen} />
                        )
                    })}
                    {albums.map((model, index) => {
                        return (
                            <SearchResult model={model} key={index} type={"album"} setIsSearchOpen={setIsSearchOpen} />
                        )
                    })}
                    {persons.map((model, index) => {
                        return (
                            <SearchResult model={model} key={index} type={"person"} setIsSearchOpen={setIsSearchOpen} />
                        )
                    })}
                    {length === 0 && (
                        <div className="result">
                            <div className="not-found">{t("Ничего не найдено")}</div>
                        </div>
                    )}
                </div>
                {length > 0 && <div className="footer">
                    <Link href={`/search/${value}`}>
                        <a onClick={() => {
                            setIsSearchOpen(false);
                        }}>
                            <span>{t("Все результаты")}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M9.29 15.88L13.17 12L9.29 8.11998C8.9 7.72998 8.9 7.09998 9.29 6.70998C9.68 6.31998 10.31 6.31998 10.7 6.70998L15.29 11.3C15.68 11.69 15.68 12.32 15.29 12.71L10.7 17.3C10.31 17.69 9.68 17.69 9.29 17.3C8.91 16.91 8.9 16.27 9.29 15.88Z" fill="white" />
                            </svg>
                        </a>
                    </Link>
                </div>}
            </div>}
        </div>
    );
}