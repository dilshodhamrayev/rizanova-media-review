import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { toast } from "react-toastify";
import ReactTooltip from "react-tooltip";
import { get } from "../../utils/request";
import { GlobalContext } from "../context";
import Tooltip from 'react-tooltip-lite';

export default function SeeLaterBtn({ model, type = "video", className = "", fill }) {
    const { t, i18n } = useTranslation();

    const [saved, setSaved] = useState(false);

    useEffect(() => {
        setSaved(model.saved);
    }, [model.saved]);

    useEffect(() => {
        ReactTooltip.rebuild();
    });

    const handleClick = async () => {

        let res = await get(`account/save-video?video_id=${model.id}`);

        if (res?.status === 'saved') {
            toast.success(t('Добавлено в избранные'), { toastId: "video-save", updateId: 'video-save', hideProgressBar: true })
            setSaved(true);
        } else {
            setSaved(false);
            toast.dismiss("video-save")
        }
    }

    const globalContext = useContext(GlobalContext);

    return (
        globalContext.store.auth.isAuth ? (
            <Tooltip className={globalContext.store.theme + " " + "theme-thing d-flex align-items-center me-4 mb-2 " + className} direction="down" content={t("В избранные")}>
                <a onClick={() => {
                    handleClick();
                }} role="button">
                    {saved ? (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="20" viewBox="0 0 16 20" fill="none">
                                <path fillRule="evenodd" clipRule="evenodd" d="M2.63077 0.863142C1.82561 0.982361 1.10729 1.51213 0.755771 2.24607C0.48292 2.81572 0.500029 2.24427 0.500029 10.791V18.5002L0.603428 18.7077C0.77667 19.0554 1.16374 19.2353 1.52784 19.1374C1.62229 19.112 3.02593 18.2595 4.84804 17.121L8.00464 15.1486L11.1618 17.1234C13.2328 18.4187 14.379 19.1132 14.4933 19.142C14.8433 19.2301 15.229 19.0441 15.3976 18.7059L15.5 18.5002V10.8109C15.5 2.28419 15.5155 2.80103 15.2436 2.24591C14.9251 1.59576 14.359 1.12521 13.6344 0.908181C13.4277 0.846306 12.9985 0.840603 8.13674 0.8349C5.23635 0.831501 2.75866 0.844236 2.63077 0.863142Z" fill="black" />
                            </svg>
                            {/* <span>{t("Удалить из избранных")}</span> */}
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" {...(fill ? { fill } : {})} width="16" height="20" viewBox="0 0 16 20" fill="none">
                                <path fillRule="evenodd" clipRule="evenodd" d="M2.63077 0.863142C1.82561 0.982361 1.10729 1.51213 0.755771 2.24607C0.48292 2.81572 0.500029 2.24427 0.500029 10.791V18.5002L0.603428 18.7077C0.77667 19.0554 1.16374 19.2353 1.52784 19.1374C1.62229 19.112 3.02593 18.2595 4.84804 17.121L8.00464 15.1486L11.1618 17.1234C13.2328 18.4187 14.379 19.1132 14.4933 19.142C14.8433 19.2301 15.229 19.0441 15.3976 18.7059L15.5 18.5002V10.8109C15.5 2.28419 15.5155 2.80103 15.2436 2.24591C14.9251 1.59576 14.359 1.12521 13.6344 0.908181C13.4277 0.846306 12.9985 0.840603 8.13674 0.8349C5.23635 0.831501 2.75866 0.844236 2.63077 0.863142ZM13.304 2.56064C13.4966 2.64107 13.6576 2.79677 13.7463 2.98826C13.8158 3.13845 13.8187 3.4097 13.8195 9.97067C13.8199 13.7251 13.8115 16.7968 13.8008 16.7968C13.79 16.7968 12.5902 16.0525 11.1346 15.1427C9.67897 14.2329 8.42842 13.4577 8.35557 13.42C8.20006 13.3396 7.8203 13.3281 7.68249 13.3996C7.63155 13.4261 6.38323 14.2013 4.9085 15.1223C3.43374 16.0433 2.21643 16.7968 2.20343 16.7968C2.19038 16.7968 2.17972 13.72 2.17972 9.95935C2.17972 3.30791 2.18175 3.11791 2.25425 2.97693C2.29526 2.89724 2.37878 2.78462 2.43979 2.72673C2.69042 2.48908 2.34276 2.50318 7.99151 2.5015C12.577 2.50013 13.1751 2.50681 13.304 2.56064Z" fill="black" />
                            </svg>
                            {/* <span>{t("В избранные")}</span> */}
                        </>
                    )}
                </a>
            </Tooltip>
        ) : (
            <div>
                <Tooltip className={globalContext.store.theme + " " + "theme-thing d-flex align-items-center me-4 mb-2 " + className} direction="down" content={t("В избранные")}>
                    <a role="button" data-event="click" data-tip data-for={"seeLaterTip"}>
                        <svg xmlns="http://www.w3.org/2000/svg" {...(fill ? { fill } : {})} width="16" height="20" viewBox="0 0 16 20" fill="none">
                            <path fillRule="evenodd" clipRule="evenodd" d="M2.63077 0.863142C1.82561 0.982361 1.10729 1.51213 0.755771 2.24607C0.48292 2.81572 0.500029 2.24427 0.500029 10.791V18.5002L0.603428 18.7077C0.77667 19.0554 1.16374 19.2353 1.52784 19.1374C1.62229 19.112 3.02593 18.2595 4.84804 17.121L8.00464 15.1486L11.1618 17.1234C13.2328 18.4187 14.379 19.1132 14.4933 19.142C14.8433 19.2301 15.229 19.0441 15.3976 18.7059L15.5 18.5002V10.8109C15.5 2.28419 15.5155 2.80103 15.2436 2.24591C14.9251 1.59576 14.359 1.12521 13.6344 0.908181C13.4277 0.846306 12.9985 0.840603 8.13674 0.8349C5.23635 0.831501 2.75866 0.844236 2.63077 0.863142ZM13.304 2.56064C13.4966 2.64107 13.6576 2.79677 13.7463 2.98826C13.8158 3.13845 13.8187 3.4097 13.8195 9.97067C13.8199 13.7251 13.8115 16.7968 13.8008 16.7968C13.79 16.7968 12.5902 16.0525 11.1346 15.1427C9.67897 14.2329 8.42842 13.4577 8.35557 13.42C8.20006 13.3396 7.8203 13.3281 7.68249 13.3996C7.63155 13.4261 6.38323 14.2013 4.9085 15.1223C3.43374 16.0433 2.21643 16.7968 2.20343 16.7968C2.19038 16.7968 2.17972 13.72 2.17972 9.95935C2.17972 3.30791 2.18175 3.11791 2.25425 2.97693C2.29526 2.89724 2.37878 2.78462 2.43979 2.72673C2.69042 2.48908 2.34276 2.50318 7.99151 2.5015C12.577 2.50013 13.1751 2.50681 13.304 2.56064Z" fill="black" />
                        </svg>
                        {/* <span>{t("В избранные")}</span> */}
                    </a>
                </Tooltip>
            </div>
        )
    );
}