import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

export default function ChartBadge({ place, className = "ms-2" }) {

    const router = useRouter();

    const { i18n } = useTranslation();

    return (
        <span className={`chart-place ${className}`} onClick={() => {
            router.push("/music/chart");
        }}>
            {i18n.language === "ru" ? <>#{place} в чарте</> : <>Xit-paradda #{place}</>}
        </span>
    )
}