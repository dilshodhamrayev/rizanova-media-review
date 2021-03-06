import React, { useContext } from "react";
import Tooltip from 'react-tooltip-lite';
import { useTranslation } from "next-i18next";
import { GlobalContext } from "../context";

export default function InfoBtn({ className = "", isOpen, setOpen, children }) {

    const { t } = useTranslation();

    const globalContext = useContext(GlobalContext);

    return (
        <Tooltip className={globalContext.store.theme + " " + (className ? className : "theme-thing d-flex align-items-center me-4 mb-2")} direction="down" content={t("Дополнительная информация")}>
            <a role="button" onClick={() => {
                setOpen(!isOpen);
            }}>
                {children ? children : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="20" viewBox="0 0 10 20" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd" d="M4.98254 0.0961663C4.27716 0.350444 3.74818 0.830794 3.42151 1.51366C3.22427 1.92593 3.20544 2.02576 3.20544 2.66C3.20544 3.28812 3.22503 3.39477 3.40984 3.7716C4.06943 5.11698 5.64012 5.69008 6.95479 5.06501C7.58125 4.76717 7.92126 4.43425 8.22306 3.82329C8.47178 3.31987 8.48546 3.25721 8.48428 2.6286C8.48317 2.05765 8.45726 1.90988 8.29809 1.56799C8.04048 1.01462 7.55228 0.516767 7.00093 0.24512C6.60221 0.0486452 6.46388 0.017729 5.91677 0.00265298C5.47998 -0.00936617 5.19645 0.0190491 4.98254 0.0961663ZM6.57497 1.16935C6.89616 1.33275 7.23693 1.69513 7.37039 2.01513C7.59334 2.5496 7.44327 3.35864 7.03962 3.79814C6.7991 4.06006 6.23906 4.29127 5.84549 4.29127C5.20215 4.29127 4.5543 3.86143 4.30648 3.27013C4.255 3.14716 4.21311 2.85015 4.21345 2.61012C4.21463 1.84582 4.72708 1.20721 5.48644 1.02373C5.78303 0.952097 6.27818 1.01831 6.57497 1.16935ZM2.89281 6.76402C0.895888 7.20289 0.545318 7.29863 0.423806 7.4382C0.310771 7.56812 0.24998 7.84366 0.122354 8.80512C-0.0361872 9.99905 -0.0363956 10.0109 0.0970657 10.1905C0.273046 10.4273 0.46028 10.4426 1.41313 10.2986C1.84728 10.233 2.21633 10.1932 2.23321 10.21C2.25009 10.2269 1.94996 11.1612 1.56625 12.2862C1.18247 13.4113 0.809392 14.5784 0.737138 14.8799C0.265959 16.8461 0.706986 18.664 1.84742 19.4561C2.41148 19.8479 2.98639 20.0028 3.86545 20C5.87564 19.9935 7.45154 18.9316 8.51381 16.8676C8.89711 16.1228 9.15541 15.3572 9.09782 15.1369C9.07656 15.0556 8.69889 14.6771 8.25856 14.2957C7.22825 13.4034 7.14127 13.3957 6.58109 14.1476C6.21023 14.6454 5.48894 15.3879 5.43183 15.3308C5.41259 15.3115 5.92768 13.3967 6.57643 11.0755C7.22519 8.75434 7.75605 6.79313 7.75605 6.71712C7.75605 6.64119 7.67928 6.50231 7.58549 6.40852C7.41812 6.24115 7.39464 6.2381 6.31757 6.24518C5.22258 6.25248 5.21521 6.25359 2.89281 6.76402ZM6.55288 7.37644C6.53253 7.42945 6.02883 9.21926 5.4335 11.3539C4.29592 15.433 4.22394 15.7935 4.45669 16.2437C4.58799 16.4976 4.75654 16.5897 5.08953 16.5897C5.52278 16.5897 5.94185 16.3281 6.66863 15.604C7.0449 15.2291 7.36782 14.9223 7.3863 14.9223C7.40471 14.9223 7.55401 15.039 7.71805 15.1817C8.01304 15.4384 8.01533 15.4439 7.92883 15.6891C7.63968 16.5086 6.98661 17.5128 6.42102 18.0075C5.73871 18.6044 4.66636 19.0213 3.81349 19.0213C3.42068 19.0213 2.75636 18.8313 2.45491 18.6327C1.72382 18.1511 1.41077 16.8641 1.67067 15.4086C1.7662 14.8738 2.24301 13.4016 3.10047 10.9941C3.36836 10.2421 3.58755 9.55747 3.58755 9.47285C3.58755 9.3883 3.50773 9.24407 3.41012 9.15236L3.23268 8.98569L2.18242 9.13999C1.60481 9.22482 1.12342 9.28554 1.11279 9.27484C1.09104 9.2531 1.23312 8.23064 1.26272 8.19569C1.27307 8.18339 2.1834 7.9749 3.28562 7.73236C4.91258 7.37436 5.41203 7.29029 5.93977 7.28571C6.46715 7.28112 6.58283 7.29828 6.55288 7.37644Z" />
                    </svg>
                )}
            </a>
        </Tooltip>
    );
}