import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import moment from 'moment';
import { Collapse } from 'react-bootstrap';

export default function AdvancedDetailPersonMusic({ model, link = "film" }) {
    const {t, i18n} = useTranslation();
    const [showMore, setShowMore] = useState(false);

    return (
        <div className="advanced-person-table person-table my-3">
            <div className="row">
                <div className="col-lg-12">
                    <div className="table">

                        {model.release_date && <div className="d-flex w-100 justify-content-start align-items-center">
                            <div className="label">{t("Год производство")}:</div>
                            <div className="value">{moment(model.release_date, "YYYY-MM-DD").format("YYYY")}</div>
                        </div>}
                        {model.countries?.length > 0 && <div className="d-flex w-100 justify-content-start align-items-center">
                            <div className="label">{t("Страна")}:</div>
                            <div className="value">{model.countries?.map((country, index) => {
                                return (
                                    <React.Fragment key={index}>
                                        <Link href={`/${link}/country/${country.id}`}><a>{country['name_' + i18n.language]}</a></Link>{model.countries?.length - 1 != index && <span className="me-2">,</span>}
                                    </React.Fragment>
                                );
                            })}</div>
                        </div>}
                        {model.genres?.length > 0 && <div className="d-flex w-100 justify-content-start align-items-center">
                            <div className="label">{t("Жанр")}:</div>
                            <div className="value">{model.genres?.map((genre, index) => {
                                return (
                                    <React.Fragment key={index}>
                                        <Link href={`/${link}/genre/${genre.id}`}><a>{genre['name_' + i18n.language]}</a></Link>{model.genres?.length - 1 != index && <span className="me-2">,</span>}
                                    </React.Fragment>
                                );
                            })}</div>
                        </div>}
                        <Collapse in={showMore}>
                            <div>
                                {model.persons?.scenarists?.length > 0 && <div className="d-flex w-100 justify-content-start align-items-center">
                                    <div className="label">{t("Сценарист")}:</div>
                                    <div className="value">{model.persons.scenarists?.map((person, index) => {
                                        return (
                                            <React.Fragment key={index}>
                                                <Link href={`/person/${person.id}`}><a>{person.name}</a></Link>{model.persons.scenarists?.length - 1 != index && <span className="me-2">,</span>}
                                            </React.Fragment>
                                        );
                                    })}</div>
                                </div>}
                                {model.persons?.directors?.length > 0 && <div className="d-flex w-100 justify-content-start align-items-center">
                                    <div className="label">{t("Режиссёр")}:</div>
                                    <div className="value">{model.persons.directors?.map((person, index) => {
                                        return (
                                            <React.Fragment key={index}>
                                                <Link href={`/person/${person.id}`}><a>{person.name}</a></Link>{model.persons.directors?.length - 1 != index && <span className="me-2">,</span>}
                                            </React.Fragment>
                                        );
                                    })}</div>
                                </div>}
                                {model.persons?.operators?.length > 0 && <div className="d-flex w-100 justify-content-start align-items-center">
                                    <div className="label">{t("Оператор")}:</div>
                                    <div className="value">{model.persons.operators?.map((person, index) => {
                                        return (
                                            <React.Fragment key={index}>
                                                <Link href={`/person/${person.id}`}><a>{person.name}</a></Link>{model.persons.operators?.length - 1 != index && <span className="me-2">,</span>}
                                            </React.Fragment>
                                        );
                                    })}</div>
                                </div>}
                                {model.persons?.xudojniks?.length > 0 && <div className="d-flex w-100 justify-content-start align-items-center">
                                    <div className="label">{t("Художник")}:</div>
                                    <div className="value">{model.persons.xudojniks?.map((person, index) => {
                                        return (
                                            <React.Fragment key={index}>
                                                <Link href={`/person/${person.id}`}><a>{person.name}</a></Link>{model.persons.xudojniks?.length - 1 != index && <span className="me-2">,</span>}
                                            </React.Fragment>
                                        );
                                    })}</div>
                                </div>}
                                {model.persons?.compositors?.length > 0 && <div className="d-flex w-100 justify-content-start align-items-center">
                                    <div className="label">{t("Композитор")}:</div>
                                    <div className="value">{model.persons.compositors?.map((person, index) => {
                                        return (
                                            <React.Fragment key={index}>
                                                <Link href={`/person/${person.id}`}><a>{person.name}</a></Link>{model.persons.compositors?.length - 1 != index && <span className="me-2">,</span>}
                                            </React.Fragment>
                                        );
                                    })}</div>
                                </div>}
                                {model.persons?.producers?.length > 0 && <div className="d-flex w-100 justify-content-start align-items-center">
                                    <div className="label">{t("Продюсер")}:</div>
                                    <div className="value">{model.persons.producers?.map((person, index) => {
                                        return (
                                            <React.Fragment key={index}>
                                                <Link href={`/person/${person.id}`}><a>{person.name}</a></Link>{model.persons.producers?.length - 1 != index && <span className="me-2">,</span>}
                                            </React.Fragment>
                                        );
                                    })}</div>
                                </div>}
                                {model.persons?.actors?.length > 0 && <div className="d-flex w-100 justify-content-start align-items-center">
                                    <div className="label">{t("Актёр")}:</div>
                                    <div className="value">{model.persons.actors?.map((person, index) => {
                                        return (
                                            <React.Fragment key={index}>
                                                <Link href={`/person/${person.id}`}><a>{person.name}</a></Link>{model.persons.actors?.length - 1 != index && <span className="me-2">,</span>}
                                            </React.Fragment>
                                        );
                                    })}</div>
                                </div>}
                                {model.persons?.montajs?.length > 0 && <div className="d-flex w-100 justify-content-start align-items-center">
                                    <div className="label">{t("Монтаж")}:</div>
                                    <div className="value">{model.persons.montajs?.map((person, index) => {
                                        return (
                                            <React.Fragment key={index}>
                                                <Link href={`/person/${person.id}`}><a>{person.name}</a></Link>{model.persons.montajs?.length - 1 != index && <span className="me-2">,</span>}
                                            </React.Fragment>
                                        );
                                    })}</div>
                                </div>}
                                {model.duration && <div className="d-flex w-100 justify-content-start align-items-center">
                                    <div className="label">{t("Время")}:</div>
                                    <div className="value">{model.duration}</div>
                                </div>}
                                {model.age && <div className="d-flex w-100 justify-content-start align-items-center">
                                    <div className="label">{t("Возраст")}:</div>
                                    <div className="value">{model.age}+</div>
                                </div>}
                            </div>

                        </Collapse>
                    </div>
                </div>
            </div>
            <a role="button" onClick={() => {
                setShowMore(!showMore);
            }} className={"d-flex w-100 more-detail justify-content-center align-items-center " + (!showMore ? 'mt-0' : '')}>
                {showMore ? (
                    <>
                        <span className="me-2">{t("Меньше")}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="8" viewBox="0 0 12 8" fill="none">
                            <path d="M9.8793 6.71L5.9993 2.83L2.1193 6.71C1.7293 7.1 1.0993 7.1 0.709296 6.71C0.319296 6.32 0.319296 5.69 0.709296 5.3L5.2993 0.710002C5.6893 0.320002 6.3193 0.320002 6.7093 0.710002L11.2993 5.3C11.6893 5.69 11.6893 6.32 11.2993 6.71C10.9093 7.09 10.2693 7.1 9.8793 6.71Z" />
                        </svg>
                    </>
                ) : (
                    <>
                        <span className="me-2">{t("Подробно")}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="8" viewBox="0 0 12 8" fill="none">
                            <path d="M2.1207 1.29006L6.0007 5.17006L9.8807 1.29006C10.2707 0.900059 10.9007 0.900059 11.2907 1.29006C11.6807 1.68006 11.6807 2.31006 11.2907 2.70006L6.7007 7.29006C6.3107 7.68006 5.6807 7.68006 5.2907 7.29006L0.700703 2.70006C0.310703 2.31006 0.310703 1.68006 0.700703 1.29006C1.0907 0.910059 1.7307 0.900059 2.1207 1.29006Z" />
                        </svg>
                    </>

                )}
            </a>
        </div>
    );
}