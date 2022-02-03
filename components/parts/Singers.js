import Pagination from "../Pagination";
import Link from 'next/link';
import Image from 'next/image';
import Empty from "../Empty";
import { letters } from "../../utils/functions";
import { useTranslation } from "next-i18next";

export default function Singers({ letter, data, page, link = 'music' }) {
    const { t } = useTranslation();

    return (
        <>
            <div className="letters">
                <Link href={`/${link}/singer`}>
                    <a className={!letter.toUpperCase() ? 'active' : ''}>{t("Все")}</a>
                </Link>
                {letters.map((l, index) => {
                    return (
                        <Link key={index} href={`/${link}/singer${l ? `?letter=${l}` : ``}`}>
                            <a className={l.toUpperCase() == letter.toUpperCase() ? 'active' : ''}>{l}</a>
                        </Link>
                    );
                })}
            </div>

            {data.models.length === 0 && <Empty text={t("Здесь пока пусто, попробуйте изменить фильтр.")} />}

            <div className="row border-radius-4 padding-0 inner-page">
                {data.models.map((model, index) => {
                    return (
                        <div className="col-lg-3 col-md-4 col-6 mb-4" key={index}>
                            <div className="music-item " key={index}>
                                <Link href={`/person/` + model.id}>
                                    <a>
                                        <div className="image rounded-circle overflow-hidden singer-image mb-2">
                                            <Image src={model.image_path} className="w-100" alt={model.name} width={256} height={256} layout="responsive" title={model.name} unoptimized loading='lazy' />
                                        </div>
                                    </a>
                                </Link>
                                <div className="title text-center">
                                    <Link href={`/person/` + model.id}>
                                        <a title={model.name}>{model.name}</a>
                                    </Link>
                                </div>

                            </div>
                        </div>
                    );
                })}
            </div>

            <Pagination pageCount={data.pagination.pageCount || 0} totalCount={data.pagination.totalCount || 0} initialPage={page - 1} query={{ letter }} />
        </>
    )
}