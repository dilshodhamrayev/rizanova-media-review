import React, { useState, useEffect, useRef, useContext } from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { SELF_URL } from "../../config";
import Tooltip from 'react-tooltip-lite';
import { GlobalContext } from "../context";

export default function LongShareBtn({ link, children, className = "", setIsOpenShare }) {

    const [isOpen, setIsOpen] = useState(false);
    const [_timeout, set_timeout] = useState();

    const { asPath } = useRouter();

    const { t, i18n } = useTranslation();
    const [copyText, setCopyText] = useState(t('Скопировать ссылку'));

    const currentUrl = link ? encodeURIComponent(SELF_URL + link) : encodeURIComponent(SELF_URL + asPath);

    const ref = useRef()

    const copy = () => {
        if (_timeout) clearTimeout(_timeout);

        const el = document.createElement("input");
        el.value = link ? SELF_URL + link : window.location.href;
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
        setCopyText(t('Скопировано!'));

        set_timeout(setTimeout(() => {
            setCopyText(t('Скопировать ссылку'));
        }, 2000));
    }

    useEffect(() => {
        document.addEventListener('mousedown', (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setIsOpen(false);
            }
        });
    }, []);

    useEffect(() => {
        if (setIsOpenShare) setIsOpenShare(isOpen);
    }, [isOpen]);

    const globalContext = useContext(GlobalContext);

    return (
        <div className={"share " + (className == "album-tool" ? "" : "mb-2")} ref={ref}>
            <Tooltip className={globalContext.store.theme + " " + (className ? className : "theme-thing d-flex align-items-center me-4")} direction="down" content={t("Поделиться")}>
                <a role="button" onClick={() => setIsOpen(!isOpen)}>
                    {children ? children : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="21" viewBox="0 0 18 21" fill="none">
                                <path fillRule="evenodd" clipRule="evenodd" d="M14.0733 0.127497C13.4181 0.24939 12.869 0.544471 12.3698 1.04282C11.9825 1.4296 11.7176 1.84907 11.573 2.3048C11.341 3.03612 11.3423 3.49224 11.5791 4.46671C11.596 4.53637 11.2529 4.76097 8.95262 6.18571C7.49734 7.08709 6.29287 7.83005 6.27603 7.83673C6.25919 7.84341 6.108 7.73347 5.94 7.59243C5.58112 7.29122 5.05707 7.01657 4.6188 6.90011C4.20194 6.78931 3.45348 6.78181 3.05608 6.88436C2.0657 7.14003 1.21788 7.84052 0.825795 8.72705C0.62061 9.19106 0.557983 9.50529 0.557983 10.071C0.557983 10.6367 0.62061 10.9509 0.825795 11.4149C1.21023 12.2841 2.04628 12.9864 2.99958 13.241C3.45152 13.3616 4.1667 13.362 4.6188 13.2419C5.05707 13.1254 5.58112 12.8508 5.94 12.5495C6.108 12.4085 6.25919 12.2986 6.27603 12.3053C6.29287 12.3119 7.49734 13.0549 8.95262 13.9563C11.2529 15.381 11.596 15.6056 11.5791 15.6753C11.3416 16.6528 11.3412 17.1352 11.5775 17.8455C11.7365 18.3237 11.964 18.6855 12.3543 19.0806C12.8831 19.6162 13.4554 19.9145 14.1793 20.032C15.8148 20.2974 17.4204 19.2292 17.8475 17.5916C18.027 16.9033 17.9322 16.0201 17.6082 15.3643C17.046 14.2258 15.916 13.531 14.6398 13.5391C13.7948 13.5444 13.0796 13.8252 12.4466 14.4002L12.2371 14.5905L10.7916 13.693C9.99652 13.1994 8.79225 12.453 8.11539 12.0342C7.43854 11.6155 6.88092 11.2697 6.87623 11.2657C6.87154 11.2617 6.9012 11.1478 6.94218 11.0125C7.12021 10.4244 7.12021 9.71754 6.94218 9.12945C6.9012 8.99416 6.87154 8.88024 6.87623 8.87625C6.88092 8.87231 7.43854 8.52647 8.11539 8.10774C8.79225 7.68901 9.99652 6.94281 10.7916 6.4495L12.2371 5.55257L12.4801 5.77049C13.4739 6.66144 14.9142 6.86374 16.1053 6.27959C16.9644 5.85828 17.6236 5.03887 17.8481 4.11311C17.9631 3.63929 17.9628 2.9924 17.8475 2.55038C17.4096 0.871471 15.7615 -0.18661 14.0733 0.127497ZM15.2284 1.34298C16.3012 1.65807 16.9428 2.74104 16.6906 3.81072C16.6018 4.18765 16.418 4.51121 16.1284 4.80082C15.6874 5.24186 15.1434 5.45021 14.5421 5.40845C13.9989 5.37071 13.5692 5.17451 13.1929 4.79231C12.3739 3.96051 12.4158 2.58566 13.2839 1.8052C13.5056 1.60587 13.7683 1.45949 14.0928 1.35443C14.3722 1.26399 14.94 1.25828 15.2284 1.34298ZM4.49566 8.11059C5.09023 8.32379 5.56737 8.80659 5.77674 9.40683C5.90269 9.76794 5.90242 10.3754 5.77619 10.7351C5.56608 11.334 5.08648 11.8204 4.50007 12.0294C4.17374 12.1457 3.641 12.1701 3.31002 12.0839C2.3761 11.8408 1.74729 11.032 1.74729 10.074C1.74729 9.13019 2.33871 8.34258 3.25142 8.0709C3.56986 7.97608 4.1744 7.99538 4.49566 8.11059ZM15.1383 14.7789C15.8955 14.9575 16.5116 15.5719 16.6894 16.3259C16.9428 17.4012 16.3037 18.4832 15.2284 18.799C14.9516 18.8803 14.4043 18.88 14.1292 18.7983C13.4072 18.584 12.8856 18.0624 12.6712 17.3403C12.5915 17.0718 12.59 16.5645 12.668 16.2649C12.8671 15.5009 13.5486 14.8774 14.3272 14.7471C14.5462 14.7104 14.908 14.7246 15.1383 14.7789Z" />
                            </svg>
                            {/* <span>{t("Поделиться")}</span> */}
                        </>
                    )}
                </a>
            </Tooltip>

            <div className={"content " + (isOpen ? 'active' : '')}>
                <div className="d-flex socials">
                    <a href={`https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`} target="_blank" rel="noreferrer">
                        {/* Facebook */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                            <rect width="32" height="32" rx="8" fill="#1877F2" />
                            <path d="M22.2282 20.625L22.9375 16H18.5V13C18.5 11.7344 19.1188 10.5 21.1063 10.5H23.125V6.5625C23.125 6.5625 21.2938 6.25 19.5438 6.25C15.8876 6.25 13.5 8.4656 13.5 12.475V16H9.4375V20.625H13.5V31.8063C14.3156 31.9344 15.15 32 16 32C16.85 32 17.6844 31.9344 18.5 31.8063V20.625H22.2282Z" fill="white" />
                        </svg>
                    </a>
                    <a href={`https://vk.com/share.php?url=${currentUrl}`} target="_blank" rel="noreferrer">
                        {/* VK */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                            <rect width="32" height="32" rx="8" fill="#4680C2" />
                            <path fillRule="evenodd" clipRule="evenodd" d="M26.1545 10.2141C26.3125 9.71731 26.1545 9.35597 25.4544 9.35597H23.1283C22.5412 9.35597 22.2702 9.67211 22.1121 10.0109C22.1121 10.0109 20.9152 12.9015 19.2441 14.7758C18.7021 15.3178 18.4537 15.4985 18.1601 15.4985C18.002 15.4985 17.7988 15.3178 17.7988 14.821V10.1915C17.7988 9.60437 17.6181 9.33337 17.1213 9.33337H13.4629C13.1015 9.33337 12.8757 9.60437 12.8757 9.87537C12.8757 10.44 13.7113 10.5754 13.8016 12.1562V15.5888C13.8016 16.3341 13.6661 16.4696 13.3725 16.4696C12.5821 16.4696 10.6626 13.5564 9.51087 10.2367C9.285 9.58177 9.0592 9.33337 8.47207 9.33337H6.1234C5.44593 9.33337 5.33301 9.64957 5.33301 9.98831C5.33301 10.598 6.1234 13.6693 9.014 17.7342C10.9336 20.5119 13.6661 22.0024 16.1277 22.0024C17.6181 22.0024 17.7988 21.6636 17.7988 21.0991V18.9989C17.7988 18.3214 17.9343 18.2085 18.4085 18.2085C18.7473 18.2085 19.357 18.3891 20.7345 19.7215C22.3153 21.3023 22.5863 22.025 23.4671 22.025H25.7931C26.4706 22.025 26.7868 21.6862 26.6061 21.0313C26.4029 20.3764 25.6351 19.428 24.6414 18.2988C24.0994 17.6665 23.2864 16.9664 23.038 16.6276C22.6993 16.176 22.7896 15.9954 23.038 15.5888C23.0155 15.5888 25.8609 11.5691 26.1545 10.2141Z" fill="white" />
                        </svg>
                    </a>
                    <a href={`https://twitter.com/intent/tweet?url=${currentUrl}`} target="_blank" rel="noreferrer">
                        {/* Twitter */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                            <rect width="32" height="32" rx="8" fill="#55ACEE" />
                            <path d="M16.5208 13.405L16.5544 13.9586L15.9948 13.8908C13.9579 13.631 12.1784 12.7497 10.6676 11.2695L9.92891 10.5351L9.73865 11.0775C9.33575 12.2864 9.59316 13.5632 10.4325 14.4219C10.8802 14.8964 10.7795 14.9642 10.0073 14.6818C9.73865 14.5914 9.50363 14.5236 9.48124 14.5575C9.4029 14.6366 9.6715 15.6647 9.88414 16.0715C10.1751 16.6364 10.7683 17.1901 11.4174 17.5177L11.9658 17.7776L11.3167 17.7889C10.6899 17.7889 10.6676 17.8002 10.7347 18.0375C10.9585 18.7719 11.8427 19.5515 12.8276 19.8904L13.5214 20.1277L12.9171 20.4893C12.0218 21.009 10.9697 21.3028 9.91772 21.3254C9.41409 21.3367 9 21.3819 9 21.4158C9 21.5288 10.3654 22.1615 11.16 22.4101C13.5438 23.1445 16.3753 22.8281 18.5017 21.574C20.0126 20.6814 21.5235 18.9075 22.2286 17.1901C22.6091 16.2749 22.9896 14.6027 22.9896 13.8005C22.9896 13.2807 23.0232 13.2129 23.6499 12.5915C24.0192 12.2299 24.3662 11.8345 24.4333 11.7215C24.5452 11.5068 24.534 11.5068 23.9633 11.6989C23.012 12.0379 22.8777 11.9927 23.3477 11.4842C23.6947 11.1227 24.1088 10.4673 24.1088 10.2753C24.1088 10.2414 23.9409 10.2979 23.7506 10.3995C23.5492 10.5125 23.1015 10.682 22.7658 10.7837L22.1614 10.9758L21.613 10.6029C21.3108 10.3995 20.8856 10.1736 20.6617 10.1058C20.0909 9.9476 19.218 9.9702 18.7032 10.151C17.3042 10.6594 16.4201 11.9701 16.5208 13.405Z" fill="white" />
                        </svg>
                    </a>
                    <a href={`https://telegram.me/share/url?url=${currentUrl}`} target="_blank" rel="noreferrer" className="share-telegram">
                        {/* Telegram */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                            <rect width="32" height="32" rx="8" fill="url(#paint0_linear_142:6297)" />
                            <path d="M6.27614 16.0433C8.14652 15.0131 10.2344 14.1532 12.1852 13.2889C15.5413 11.8733 18.9108 10.4823 22.3143 9.18719C22.9765 8.96652 24.1663 8.75072 24.2829 9.73206C24.2191 11.1211 23.9563 12.5021 23.776 13.883C23.3185 16.9198 22.7897 19.9462 22.274 22.973C22.0963 23.9812 20.8333 24.5031 20.0252 23.8579C18.0831 22.5461 16.126 21.247 14.2087 19.9047C13.5806 19.2665 14.163 18.3501 14.7239 17.8943C16.3235 16.3179 18.0199 14.9786 19.5359 13.3207C19.9449 12.3332 18.7366 13.1655 18.3381 13.4205C16.1482 14.9295 14.0119 16.5307 11.7031 17.857C10.5238 18.5062 9.14926 17.9514 7.97046 17.5891C6.91351 17.1515 5.3647 16.7107 6.27603 16.0434L6.27614 16.0433Z" fill="white" />
                            <defs>
                                <linearGradient id="paint0_linear_142:6297" x1="12.0019" y1="1.3344" x2="4.00187" y2="20" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#37AEE2" />
                                    <stop offset="1" stopColor="#1E96C8" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </a>
                    <a href={`https://wa.me/?text=${currentUrl}`} target="_blank" rel="noreferrer">
                        {/* Whatsapp */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                            <path d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" fill="#25D366" />
                            <rect width="32" height="32" rx="8" fill="#25D366" />
                            <path fillRule="evenodd" clipRule="evenodd" d="M16.5267 24.9017H16.5227C14.9304 24.9012 13.3658 24.5017 11.9762 23.7437L6.93262 25.0667L8.28236 20.1366C7.44977 18.6937 7.01167 17.057 7.01238 15.3802C7.01447 10.1345 11.2825 5.8667 16.5266 5.8667C19.0717 5.8678 21.4605 6.85861 23.2568 8.65697C25.053 10.4552 26.0417 12.8456 26.0407 15.3877C26.0386 20.6322 21.7723 24.8996 16.5267 24.9017ZM12.2095 22.0211L12.4983 22.1925C13.7124 22.913 15.1041 23.2942 16.5231 23.2948H16.5263C20.8848 23.2948 24.4322 19.7473 24.434 15.387C24.4348 13.274 23.6131 11.2873 22.1201 9.79254C20.6271 8.29781 18.6416 7.47424 16.5294 7.47351C12.1676 7.47351 8.62013 11.0206 8.6184 15.3806C8.61779 16.8748 9.03587 18.33 9.82744 19.589L10.0155 19.8882L9.21661 22.8062L12.2095 22.0211ZM20.9948 17.4361C21.1606 17.5162 21.2726 17.5703 21.3204 17.6501C21.3798 17.7493 21.3798 18.2252 21.1818 18.7806C20.9836 19.3359 20.0339 19.8427 19.5772 19.9109C19.1676 19.9722 18.6493 19.9977 18.0799 19.8167C17.7346 19.7072 17.2918 19.5609 16.7246 19.316C14.496 18.3537 12.9899 16.1936 12.7053 15.7854C12.6853 15.7568 12.6714 15.7368 12.6636 15.7264L12.6617 15.7239C12.5359 15.556 11.6929 14.4313 11.6929 13.2672C11.6929 12.1722 12.2308 11.5983 12.4784 11.3341C12.4953 11.316 12.511 11.2993 12.5249 11.2841C12.7428 11.0461 13.0004 10.9866 13.1589 10.9866C13.3173 10.9866 13.476 10.988 13.6145 10.995C13.6316 10.9958 13.6493 10.9957 13.6677 10.9956C13.8063 10.9948 13.979 10.9938 14.1493 11.4031C14.2149 11.5606 14.3108 11.7941 14.412 12.0403C14.6165 12.5383 14.8425 13.0886 14.8823 13.1682C14.9417 13.2872 14.9813 13.426 14.9021 13.5847C14.8902 13.6085 14.8792 13.6309 14.8687 13.6524C14.8092 13.7739 14.7654 13.8633 14.6644 13.9812C14.6247 14.0276 14.5836 14.0776 14.5426 14.1276C14.4608 14.2272 14.379 14.3268 14.3078 14.3977C14.1888 14.5163 14.0649 14.6449 14.2036 14.8829C14.3422 15.1209 14.8193 15.8993 15.5261 16.5297C16.2857 17.2073 16.946 17.4937 17.2807 17.6389C17.346 17.6672 17.399 17.6902 17.4378 17.7096C17.6754 17.8287 17.8141 17.8087 17.9528 17.6501C18.0915 17.4915 18.5471 16.956 18.7055 16.718C18.864 16.4801 19.0225 16.5197 19.2404 16.599C19.4583 16.6784 20.6271 17.2535 20.8648 17.3724C20.9112 17.3957 20.9546 17.4167 20.9948 17.4361Z" fill="#FDFDFD" />
                        </svg>
                    </a>
                </div>

                <div className="link">
                    <a role="button" className="d-flex align-items-center" onClick={copy}>
                        <svg className="me-2" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                            <rect width="32" height="32" rx="8" />
                            <path d="M21 11H18C17.45 11 17 11.45 17 12C17 12.55 17.45 13 18 13H21C22.65 13 24 14.35 24 16C24 17.65 22.65 19 21 19H18C17.45 19 17 19.45 17 20C17 20.55 17.45 21 18 21H21C23.76 21 26 18.76 26 16C26 13.24 23.76 11 21 11ZM12 16C12 16.55 12.45 17 13 17H19C19.55 17 20 16.55 20 16C20 15.45 19.55 15 19 15H13C12.45 15 12 15.45 12 16ZM14 19H11C9.35 19 8 17.65 8 16C8 14.35 9.35 13 11 13H14C14.55 13 15 12.55 15 12C15 11.45 14.55 11 14 11H11C8.24 11 6 13.24 6 16C6 18.76 8.24 21 11 21H14C14.55 21 15 20.55 15 20C15 19.45 14.55 19 14 19Z" />
                        </svg>
                        <span>
                            {copyText}
                        </span>
                    </a>
                </div>
            </div>
        </div>
    );
}