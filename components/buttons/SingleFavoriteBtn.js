import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { toast } from "react-toastify";
import ReactTooltip from "react-tooltip";
import { get } from "../../utils/request";
import { GlobalContext } from "../context";
import Tooltip from 'react-tooltip-lite';

export default function SingleFavoriteBtn({ model, type = "music", className = "" }) {

    const [favorite, setFavorite] = useState(false);

    const { t } = useTranslation();

    useEffect(() => {
        setFavorite(model.favorite);
    }, [model.favorite]);

    const handleClick = async () => {

        let res = type === "album" ? await get(`account/favorite-album?album_id=${model.id}`) : (type === "music" ? await get(`account/favorite-music?music_id=${model.id}`) : await get(`account/favorite-album?album_id=${model.id}`));

        if (res?.status === 'liked') {
            setFavorite(true);
            toast.success(t('Добавлено в понравившиеся'), { toastId: "video-favorite", updateId: 'video-favorite', hideProgressBar: true })
        } else {
            setFavorite(false);
            toast.dismiss("video-favorite")
        }
    }

    useEffect(() => {
        ReactTooltip.rebuild();
    });

    const globalContext = useContext(GlobalContext);

    return (
        globalContext.store.auth.isAuth ? (
            <Tooltip className={"me-3"} direction="down" content={t("Добавить в понравившеися")}>
                <a role="button" className="album-tool" onClick={() => {
                    handleClick();
                }}>
                    {favorite ? (
                        <svg className="liked-heart" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                            <path fillRule="evenodd" clipRule="evenodd" d="M10.3168 10.0359C10.1921 10.0803 10.0578 10.2101 10.0209 10.3217C9.95196 10.5308 10.0592 10.7834 10.2577 10.8795L10.3692 10.9334L13.2563 10.9267L16.1435 10.92L16.2369 10.8619C16.3511 10.7909 16.4259 10.6748 16.4485 10.5336C16.4825 10.3212 16.3262 10.0849 16.1126 10.0255C16.0487 10.0078 15.0962 9.9994 13.216 10C10.8987 10.0008 10.3977 10.007 10.3168 10.0359ZM18.6199 10.0353C18.4911 10.082 18.3574 10.2143 18.3264 10.3258C18.3106 10.3828 18.3015 11.9136 18.3015 14.5479C18.3014 16.8208 18.2971 18.6805 18.2919 18.6805C18.2867 18.6805 18.2324 18.6526 18.1713 18.6184C17.6242 18.3126 16.8104 18.2313 16.1618 18.4177C15.4362 18.6262 14.8914 19.095 14.6871 19.6868C14.604 19.9276 14.604 20.3862 14.6871 20.6269C14.8465 21.0887 15.2074 21.475 15.7089 21.7205C16.3025 22.0112 16.9891 22.0778 17.6384 21.9078C18.3681 21.7166 18.9469 21.223 19.1523 20.6166L19.2225 20.4093L19.2296 17.6002L19.2368 14.791L19.2927 14.8079C19.3235 14.8171 19.469 14.8867 19.6161 14.9626C20.4867 15.4114 21.1252 16.2248 21.3306 17.1468L21.3628 17.2914L21.2643 17.4334C21.1101 17.6555 21.0775 17.7263 21.0775 17.8397C21.0774 18.0239 21.1725 18.1815 21.3349 18.2663C21.4228 18.3123 21.6408 18.3121 21.7299 18.266C21.8702 18.1935 22.1326 17.8542 22.3463 17.4691C22.5566 17.0902 22.7627 16.4733 22.8606 15.9296C22.9283 15.5537 22.9213 14.9489 22.8457 14.6425C22.7293 14.1709 22.5364 13.7624 22.2637 13.4095C21.986 13.0502 21.7337 12.8376 20.926 12.2827C20.1157 11.7259 19.9555 11.5838 19.6008 11.1073C19.389 10.8226 19.2489 10.5666 19.2212 10.4135C19.1996 10.2943 19.1708 10.2328 19.0994 10.1541C18.9845 10.0273 18.7811 9.97689 18.6199 10.0353ZM10.2548 12.8291C10.0573 12.9269 9.95252 13.1784 10.0219 13.3886C10.06 13.5041 10.2198 13.648 10.3484 13.6826C10.4181 13.7014 11.3214 13.7077 13.2837 13.7029C16.4242 13.6954 16.1933 13.7082 16.3402 13.5336C16.5357 13.3013 16.4676 12.9578 16.2003 12.8285L16.0897 12.7749L13.2269 12.7749L10.3641 12.775L10.2548 12.8291ZM10.2632 15.5908C10.1494 15.6501 10.0968 15.7046 10.0456 15.816C9.95519 16.013 10.0136 16.2404 10.189 16.3742L10.2844 16.447L11.7754 16.4544C12.5955 16.4585 13.3036 16.4551 13.349 16.4468C13.4516 16.4282 13.6035 16.2979 13.6488 16.1895C13.7465 15.9555 13.6269 15.6647 13.3973 15.5779C13.35 15.56 12.8269 15.5511 11.8326 15.5512C10.5274 15.5514 10.3293 15.5563 10.2632 15.5908ZM10.3168 18.3386C10.1919 18.3837 10.0577 18.5135 10.0209 18.6249C9.95211 18.8335 10.0592 19.0865 10.2569 19.1822C10.3657 19.2349 10.391 19.2357 11.8367 19.2357C13.3987 19.2357 13.4065 19.2352 13.5395 19.1149C13.7579 18.9174 13.716 18.5343 13.4596 18.3836L13.3421 18.3146L11.8784 18.309C10.6778 18.3044 10.397 18.3097 10.3168 18.3386Z" fill="white" />
                            <circle cx="16" cy="16" r="15.5" stroke="#BDBDBD" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                            <path fillRule="evenodd" clipRule="evenodd" d="M10.3568 10.016C9.96789 10.1097 9.87394 10.6262 10.2059 10.8458L10.3083 10.9136H13.2291H16.1499L16.2387 10.8528C16.4814 10.6865 16.5271 10.3858 16.343 10.167C16.1959 9.99217 16.4285 10.0048 13.2796 10.0004C11.7169 9.99821 10.4016 10.0052 10.3568 10.016ZM18.6755 10.0218C18.5494 10.0487 18.4499 10.1209 18.3768 10.2385L18.3182 10.3327L18.3115 14.5063C18.3079 16.8018 18.2975 18.6799 18.2885 18.6799C18.2795 18.6799 18.2237 18.6516 18.1646 18.6169C18.0136 18.5284 17.6895 18.4126 17.4556 18.3636C17.1773 18.3053 16.6458 18.3098 16.3482 18.373C15.3256 18.5903 14.6189 19.3194 14.6189 20.1574C14.6189 21.5343 16.4415 22.4231 17.9757 21.7943C18.6681 21.5105 19.1248 20.9731 19.2127 20.3387C19.2309 20.2071 19.2401 19.248 19.2401 17.4658C19.2401 15.9943 19.2473 14.7905 19.2561 14.7905C19.2649 14.7905 19.3764 14.8399 19.5039 14.9002C20.4335 15.3406 21.1234 16.1858 21.3375 17.1466L21.3701 17.2929L21.2686 17.4371C21.122 17.6453 21.0838 17.7298 21.0838 17.846C21.0838 18.1053 21.2804 18.3011 21.5408 18.3011C21.755 18.3011 21.8695 18.205 22.1466 17.7929C22.6455 17.0508 22.9682 15.9272 22.9186 15.1047C22.888 14.5972 22.6819 13.998 22.3901 13.5679C22.1103 13.1556 21.7827 12.8617 21.0206 12.3394C20.1704 11.7566 19.9697 11.5833 19.6444 11.1511C19.4044 10.8323 19.2843 10.6215 19.2222 10.41C19.2016 10.3397 19.162 10.245 19.1342 10.1995C19.0498 10.0614 18.8509 9.98436 18.6755 10.0218ZM19.8775 12.6616C20.0061 12.7573 20.2762 12.9479 20.4776 13.0852C21.4332 13.7364 21.7146 14.0555 21.9221 14.7232C21.9694 14.8754 21.9785 14.9642 21.9794 15.2829C21.9804 15.675 21.9307 16.0505 21.8874 15.9769C21.601 15.4897 21.4507 15.2819 21.1869 15.0088C20.9703 14.7846 20.7001 14.5551 20.4397 14.3742C20.2022 14.2093 19.7011 13.9548 19.4468 13.8702L19.2401 13.8013V12.9547V12.108L19.4418 12.2978C19.5528 12.4022 19.7488 12.5659 19.8775 12.6616ZM10.2531 12.8242C10.0892 12.9053 10.0088 13.0425 10.0094 13.24C10.0098 13.3783 10.0195 13.4097 10.0878 13.4943C10.1307 13.5474 10.2044 13.6135 10.2515 13.6413C10.3359 13.691 10.3826 13.6918 13.2038 13.6918C14.7804 13.6918 16.1014 13.6831 16.1394 13.6725C16.2466 13.6425 16.3785 13.5113 16.4257 13.3878C16.5092 13.1692 16.4128 12.9251 16.203 12.8235L16.0924 12.77L13.2274 12.77L10.3625 12.77L10.2531 12.8242ZM10.237 15.6058C10.1818 15.637 10.111 15.7006 10.0797 15.7471C9.92834 15.9717 9.99901 16.265 10.237 16.3997L10.3372 16.4565L11.832 16.457C12.8278 16.4572 13.3506 16.4484 13.3979 16.4305C13.7737 16.2885 13.7737 15.717 13.3979 15.575C13.3506 15.5571 12.8278 15.5483 11.832 15.5485L10.3372 15.549L10.237 15.6058ZM10.3568 18.3251C10.2454 18.3522 10.1642 18.4092 10.0805 18.519C10.0209 18.5972 10.0097 18.6362 10.0093 18.7675C10.0088 18.9644 10.0906 19.1024 10.2552 19.182C10.364 19.2347 10.3894 19.2356 11.8361 19.2356C13.3994 19.2356 13.4071 19.235 13.5402 19.1146C13.7588 18.917 13.7169 18.5337 13.4603 18.3828L13.3427 18.3137L11.8905 18.3095C11.0918 18.3072 10.4016 18.3142 10.3568 18.3251ZM17.409 19.2999C17.7694 19.3954 18.1065 19.63 18.2358 19.8751C18.2778 19.9548 18.2915 20.0239 18.2915 20.1574C18.2915 20.3736 18.2374 20.4889 18.0494 20.674C17.663 21.0543 16.9102 21.1838 16.3044 20.9742C15.692 20.7622 15.3932 20.2804 15.618 19.8674C15.7802 19.5693 16.1517 19.3436 16.6134 19.2624C16.798 19.23 17.2203 19.2498 17.409 19.2999Z" fill="white" />
                            <circle cx="16" cy="16" r="15.5" stroke="#BDBDBD" />
                        </svg>
                    )}
                </a >
            </Tooltip>
        ) : (
            <div>
                <Tooltip className={"me-3"} direction="down" content={t("Добавить в понравившеися")}>
                    <a role="button" className="album-tool" data-event="click" data-tip data-for={"favoriteTip"}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                            <path fillRule="evenodd" clipRule="evenodd" d="M10.3568 10.016C9.96789 10.1097 9.87394 10.6262 10.2059 10.8458L10.3083 10.9136H13.2291H16.1499L16.2387 10.8528C16.4814 10.6865 16.5271 10.3858 16.343 10.167C16.1959 9.99217 16.4285 10.0048 13.2796 10.0004C11.7169 9.99821 10.4016 10.0052 10.3568 10.016ZM18.6755 10.0218C18.5494 10.0487 18.4499 10.1209 18.3768 10.2385L18.3182 10.3327L18.3115 14.5063C18.3079 16.8018 18.2975 18.6799 18.2885 18.6799C18.2795 18.6799 18.2237 18.6516 18.1646 18.6169C18.0136 18.5284 17.6895 18.4126 17.4556 18.3636C17.1773 18.3053 16.6458 18.3098 16.3482 18.373C15.3256 18.5903 14.6189 19.3194 14.6189 20.1574C14.6189 21.5343 16.4415 22.4231 17.9757 21.7943C18.6681 21.5105 19.1248 20.9731 19.2127 20.3387C19.2309 20.2071 19.2401 19.248 19.2401 17.4658C19.2401 15.9943 19.2473 14.7905 19.2561 14.7905C19.2649 14.7905 19.3764 14.8399 19.5039 14.9002C20.4335 15.3406 21.1234 16.1858 21.3375 17.1466L21.3701 17.2929L21.2686 17.4371C21.122 17.6453 21.0838 17.7298 21.0838 17.846C21.0838 18.1053 21.2804 18.3011 21.5408 18.3011C21.755 18.3011 21.8695 18.205 22.1466 17.7929C22.6455 17.0508 22.9682 15.9272 22.9186 15.1047C22.888 14.5972 22.6819 13.998 22.3901 13.5679C22.1103 13.1556 21.7827 12.8617 21.0206 12.3394C20.1704 11.7566 19.9697 11.5833 19.6444 11.1511C19.4044 10.8323 19.2843 10.6215 19.2222 10.41C19.2016 10.3397 19.162 10.245 19.1342 10.1995C19.0498 10.0614 18.8509 9.98436 18.6755 10.0218ZM19.8775 12.6616C20.0061 12.7573 20.2762 12.9479 20.4776 13.0852C21.4332 13.7364 21.7146 14.0555 21.9221 14.7232C21.9694 14.8754 21.9785 14.9642 21.9794 15.2829C21.9804 15.675 21.9307 16.0505 21.8874 15.9769C21.601 15.4897 21.4507 15.2819 21.1869 15.0088C20.9703 14.7846 20.7001 14.5551 20.4397 14.3742C20.2022 14.2093 19.7011 13.9548 19.4468 13.8702L19.2401 13.8013V12.9547V12.108L19.4418 12.2978C19.5528 12.4022 19.7488 12.5659 19.8775 12.6616ZM10.2531 12.8242C10.0892 12.9053 10.0088 13.0425 10.0094 13.24C10.0098 13.3783 10.0195 13.4097 10.0878 13.4943C10.1307 13.5474 10.2044 13.6135 10.2515 13.6413C10.3359 13.691 10.3826 13.6918 13.2038 13.6918C14.7804 13.6918 16.1014 13.6831 16.1394 13.6725C16.2466 13.6425 16.3785 13.5113 16.4257 13.3878C16.5092 13.1692 16.4128 12.9251 16.203 12.8235L16.0924 12.77L13.2274 12.77L10.3625 12.77L10.2531 12.8242ZM10.237 15.6058C10.1818 15.637 10.111 15.7006 10.0797 15.7471C9.92834 15.9717 9.99901 16.265 10.237 16.3997L10.3372 16.4565L11.832 16.457C12.8278 16.4572 13.3506 16.4484 13.3979 16.4305C13.7737 16.2885 13.7737 15.717 13.3979 15.575C13.3506 15.5571 12.8278 15.5483 11.832 15.5485L10.3372 15.549L10.237 15.6058ZM10.3568 18.3251C10.2454 18.3522 10.1642 18.4092 10.0805 18.519C10.0209 18.5972 10.0097 18.6362 10.0093 18.7675C10.0088 18.9644 10.0906 19.1024 10.2552 19.182C10.364 19.2347 10.3894 19.2356 11.8361 19.2356C13.3994 19.2356 13.4071 19.235 13.5402 19.1146C13.7588 18.917 13.7169 18.5337 13.4603 18.3828L13.3427 18.3137L11.8905 18.3095C11.0918 18.3072 10.4016 18.3142 10.3568 18.3251ZM17.409 19.2999C17.7694 19.3954 18.1065 19.63 18.2358 19.8751C18.2778 19.9548 18.2915 20.0239 18.2915 20.1574C18.2915 20.3736 18.2374 20.4889 18.0494 20.674C17.663 21.0543 16.9102 21.1838 16.3044 20.9742C15.692 20.7622 15.3932 20.2804 15.618 19.8674C15.7802 19.5693 16.1517 19.3436 16.6134 19.2624C16.798 19.23 17.2203 19.2498 17.409 19.2999Z" fill="white" />
                            <circle cx="16" cy="16" r="15.5" stroke="#BDBDBD" />
                        </svg>
                    </a>
                </Tooltip>

            </div>
        )
    );
}