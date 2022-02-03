import { useContext } from "react";
import Tooltip from "react-tooltip-lite";
import { GlobalContext } from "../context";
import { useTranslation } from "next-i18next";
import { TYPE_VP_SET_PLAYLIST_TOGGLE } from "../../reducers/videoPlayerReducer";

export default function VideoPlaylistBtn({ className = "" }) {
    const globalContext = useContext(GlobalContext);
    const { t } = useTranslation();

    if (!globalContext.store.auth.isAuth) return <></>;

    return (
        <Tooltip className={globalContext.store.theme + " " + (className ? className : "theme-thing d-flex align-items-center me-4 mb-2")} direction="down" content={t("Очередь видео")}>
            <a role="button" onClick={() => {
                globalContext.dispatch({type: TYPE_VP_SET_PLAYLIST_TOGGLE});
            }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="23" height="20" viewBox="0 0 23 20" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M0.409924 0.0832935C0.142968 0.203708 0.0179444 0.402694 0.0179444 0.707316C0.0179444 0.985748 0.0999426 1.13332 0.347787 1.30078L0.493376 1.39915H11.2696H22.0458L22.1914 1.30078C22.4096 1.15334 22.5095 0.9927 22.5292 0.757467C22.5533 0.470859 22.4154 0.232172 22.1484 0.0983781L21.9521 0L11.2713 0.000961891C0.950443 0.00188009 0.584358 0.00467845 0.409924 0.0832935ZM0.347787 6.04479C0.12958 6.19222 0.0297024 6.35286 0.00997353 6.58809C-0.0141151 6.8747 0.123767 7.11339 0.390768 7.24718L0.587088 7.34556H11.2696H21.9521L22.1484 7.24718C22.4154 7.11339 22.5533 6.8747 22.5292 6.58809C22.5095 6.35286 22.4096 6.19222 22.1914 6.04479L22.0458 5.94641H11.2696H0.493376L0.347787 6.04479ZM15.2492 11.0659C15.0424 11.1254 14.8046 11.4103 14.7717 11.638C14.7566 11.7421 14.7502 13.5587 14.7575 15.6749L14.7706 19.5226L14.8666 19.6756C15.0009 19.8896 15.2081 20 15.4752 20C15.6871 20 15.8186 19.9267 18.9542 18.0626C20.7465 16.997 22.2762 16.0598 22.3534 15.9801C22.6014 15.7239 22.6018 15.3289 22.3543 15.0711C22.221 14.9322 16.0129 11.2129 15.6926 11.08C15.5261 11.0109 15.4489 11.0085 15.2492 11.0659ZM0.468935 11.9116C0.251565 11.9886 0.18379 12.0484 0.0759421 12.2583C-0.0880985 12.5775 0.0186049 12.9274 0.347787 13.1499L0.493376 13.2482L6.17873 13.2481C11.7364 13.2479 11.8673 13.246 12.0048 13.1627C12.2671 13.0039 12.4002 12.6894 12.324 12.4084C12.2628 12.1827 12.0467 11.9485 11.8495 11.8941C11.7436 11.8649 9.78353 11.8501 6.16121 11.8512C1.65364 11.8526 0.603955 11.8637 0.468935 11.9116ZM18.3194 14.2429C19.4799 14.9342 20.4294 15.5098 20.4294 15.5219C20.4294 15.5463 16.2244 18.0578 16.1835 18.0578C16.1694 18.0578 16.1578 16.9167 16.1578 15.5219C16.1578 14.1271 16.1694 12.9859 16.1835 12.9859C16.1977 12.9859 17.1588 13.5516 18.3194 14.2429ZM0.347787 17.8939C0.0999426 18.0613 0.0179444 18.2089 0.0179444 18.4873C0.0179444 18.792 0.142968 18.9909 0.409924 19.1114C0.58286 19.1893 0.824055 19.1928 6.17363 19.1937C12.2629 19.1947 11.9123 19.2094 12.1649 18.9426C12.4763 18.6135 12.3699 18.0608 11.9577 17.8666C11.8207 17.8021 11.283 17.7955 6.15007 17.7955H0.493376L0.347787 17.8939Z" />
                </svg>
            </a>
        </Tooltip>
    )
}