import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { toast } from "react-toastify";
import { arrayToFormData } from "../utils/functions";
import { post } from "../utils/request";

export default function VideoPlayerReview({ isReviewOpen, setIsReviewOpen, isReviewClosed, setIsReviewClosed, video_id }) {
    const [stars, setStars] = useState(0);
    const [starsClicked, setStarsClicked] = useState(false);
    const { t, i18n } = useTranslation();

    useEffect(() => {
        const sendReview = async (rate) => {
            let res = await post("account/video-rate", arrayToFormData({
                video_id,
                rate
            }));

            if (res.status === "success") {
                toast.success(t("Спасибо! Ваше отзыв успешно отправлено."), { toastId: "video-rate", updateId: "video-rate", hideProgressBar: true })
            }
        }

        if (stars > 0 && starsClicked) {
            sendReview(stars);
        }
    }, [stars, starsClicked]);

    if (!isReviewOpen) return <></>;

    return (
        <div className="review">
            <a className="close" role="button" onClick={() => {
                setIsReviewOpen(false);
                setIsReviewClosed(true);
            }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M18.3002 5.70997C17.9102 5.31997 17.2802 5.31997 16.8902 5.70997L12.0002 10.59L7.11022 5.69997C6.72022 5.30997 6.09021 5.30997 5.70021 5.69997C5.31021 6.08997 5.31021 6.71997 5.70021 7.10997L10.5902 12L5.70021 16.89C5.31021 17.28 5.31021 17.91 5.70021 18.3C6.09021 18.69 6.72022 18.69 7.11022 18.3L12.0002 13.41L16.8902 18.3C17.2802 18.69 17.9102 18.69 18.3002 18.3C18.6902 17.91 18.6902 17.28 18.3002 16.89L13.4102 12L18.3002 7.10997C18.6802 6.72997 18.6802 6.08997 18.3002 5.70997Z" fill="white" />
                </svg>
            </a>

            <h4>{t("Оцените этот фильм")}</h4>
            <p>{t("Оценки улучшают персональные рекомендации")}</p>
            <div className="stars d-flex justify-content-center" onMouseLeave={() => !starsClicked && setStars(0)}>
                {[...Array(10).keys()].map((el, index) => {
                    return (
                        <a role="button" key={index} onMouseOver={() => !starsClicked && setStars(index + 1)} onClick={() => {
                            setStars(index + 1);
                            setStarsClicked(true);
                        }}>
                            {stars > index ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="29" viewBox="0 0 30 29" fill="none">
                                    <path d="M14.9999 23.7833L21.9165 27.9666C23.1832 28.7333 24.7332 27.5999 24.3999 26.1666L22.5665 18.2999L28.6832 12.9999C29.7999 12.0333 29.1999 10.1999 27.7332 10.0833L19.6832 9.39993L16.5332 1.9666C15.9665 0.616602 14.0332 0.616602 13.4665 1.9666L10.3165 9.38327L2.26654 10.0666C0.799877 10.1833 0.199877 12.0166 1.31654 12.9833L7.43321 18.2833L5.59988 26.1499C5.26654 27.5833 6.81654 28.7166 8.08321 27.9499L14.9999 23.7833Z" fill="#EF225D" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="29" viewBox="0 0 30 29" fill="none">
                                    <path d="M27.7499 10.0667L19.6832 9.36667L16.5332 1.95C15.9665 0.6 14.0332 0.6 13.4665 1.95L10.3165 9.38333L2.26654 10.0667C0.799877 10.1833 0.199877 12.0167 1.31654 12.9833L7.43321 18.2833L5.59988 26.15C5.26654 27.5833 6.81654 28.7167 8.08321 27.95L14.9999 23.7833L21.9165 27.9667C23.1832 28.7333 24.7332 27.6 24.3999 26.1667L22.5665 18.2833L28.6832 12.9833C29.7999 12.0167 29.2165 10.1833 27.7499 10.0667V10.0667ZM14.9999 20.6667L8.73321 24.45L10.3999 17.3167L4.86654 12.5167L12.1665 11.8833L14.9999 5.16667L17.8499 11.9L25.1499 12.5333L19.6165 17.3333L21.2832 24.4667L14.9999 20.6667Z" fill="#4F4F4F" />
                                </svg>
                            )}
                        </a>
                    );
                })}
            </div>
            <div className={"rating " + (stars > 0 ? 'show' : 'hide')}>{stars}</div>
        </div>
    );
}