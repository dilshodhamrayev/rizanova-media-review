import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import moment from 'moment';
import { Collapse } from 'react-bootstrap';

export default function DetailPersons({ model, more = true }) {
    const { t, i18n } = useTranslation();

    return (
        <div className="person-table">
            <table>
                <tbody>
                    <tr>
                        <td colSpan={2} className='p-0'>
                            <Collapse in={more}>
                                <div>
                                    <table className='w-100'>
                                        <tbody>
                                            {model.release_date && <tr>
                                                <th>{t("Год производство")}:</th>
                                                <td>{moment(model.release_date, "YYYY-MM-DD").format("YYYY")}</td>
                                            </tr>}
                                            {model.persons.author_texts?.length > 0 && <tr>
                                                <th>{t("Автор текста")}:</th>
                                                <td>{model.persons.author_texts?.map((person, index) => {
                                                    return (
                                                        <React.Fragment key={index}>
                                                            <Link href={`/person/${person.id}`}><a>{person.name}</a></Link>{model.persons.author_texts?.length - 1 != index && <span className="me-2">,</span>}
                                                        </React.Fragment>
                                                    );
                                                })}</td>
                                            </tr>}
                                            {model.persons.compositors?.length > 0 && <tr>
                                                <th>{t("Композитор")}:</th>
                                                <td>{model.persons.compositors?.map((person, index) => {
                                                    return (
                                                        <React.Fragment key={index}>
                                                            <Link href={`/person/${person.id}`}><a>{person.name}</a></Link>{model.persons.compositors?.length - 1 != index && <span className="me-2">,</span>}
                                                        </React.Fragment>
                                                    );
                                                })}</td>
                                            </tr>}
                                            {model.persons.scenarists?.length > 0 && <tr>
                                                <th>{t("Сценарист")}:</th>
                                                <td>{model.persons.scenarists?.map((person, index) => {
                                                    return (
                                                        <React.Fragment key={index}>
                                                            <Link href={`/person/${person.id}`}><a>{person.name}</a></Link>{model.persons.scenarists?.length - 1 != index && <span className="me-2">,</span>}
                                                        </React.Fragment>
                                                    );
                                                })}</td>
                                            </tr>}
                                            {model.persons.operators?.length > 0 && <tr>
                                                <th>{t("Оператор")}:</th>
                                                <td>{model.persons.operators?.map((person, index) => {
                                                    return (
                                                        <React.Fragment key={index}>
                                                            <Link href={`/person/${person.id}`}><a>{person.name}</a></Link>{model.persons.operators?.length - 1 != index && <span className="me-2">,</span>}
                                                        </React.Fragment>
                                                    );
                                                })}</td>
                                            </tr>}
                                            {model.persons.xudojniks?.length > 0 && <tr>
                                                <th>{t("Художник")}:</th>
                                                <td>{model.persons.xudojniks?.map((person, index) => {
                                                    return (
                                                        <React.Fragment key={index}>
                                                            <Link href={`/person/${person.id}`}><a>{person.name}</a></Link>{model.persons.xudojniks?.length - 1 != index && <span className="me-2">,</span>}
                                                        </React.Fragment>
                                                    );
                                                })}</td>
                                            </tr>}
                                            {model.persons.directors?.length > 0 && <tr>
                                                <th>{t("Режиссёр")}:</th>
                                                <td>{model.persons.directors?.map((person, index) => {
                                                    return (
                                                        <React.Fragment key={index}>
                                                            <Link href={`/person/${person.id}`}><a>{person.name}</a></Link>{model.persons.directors?.length - 1 != index && <span className="me-2">,</span>}
                                                        </React.Fragment>
                                                    );
                                                })}</td>
                                            </tr>}
                                            {model.persons.producers?.length > 0 && <tr>
                                                <th>{t("Продюсер")}:</th>
                                                <td>{model.persons.producers?.map((person, index) => {
                                                    return (
                                                        <React.Fragment key={index}>
                                                            <Link href={`/person/${person.id}`}><a>{person.name}</a></Link>{model.persons.producers?.length - 1 != index && <span className="me-2">,</span>}
                                                        </React.Fragment>
                                                    );
                                                })}</td>
                                            </tr>}
                                            {model.persons.actors?.length > 0 && <tr>
                                                <th>{t("Актёр")}:</th>
                                                <td>{model.persons.actors?.map((person, index) => {
                                                    return (
                                                        <React.Fragment key={index}>
                                                            <Link href={`/person/${person.id}`}><a>{person.name}</a></Link>{model.persons.actors?.length - 1 != index && <span className="me-2">,</span>}
                                                        </React.Fragment>
                                                    );
                                                })}</td>
                                            </tr>}
                                        </tbody>
                                    </table>
                                </div>
                            </Collapse>
                        </td>
                    </tr>
                </tbody>

            </table>
        </div>
    );
}