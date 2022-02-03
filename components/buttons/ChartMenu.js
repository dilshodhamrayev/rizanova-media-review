import { Menu, Transition } from '@headlessui/react';
import { useRouter } from 'next/router';
import { Fragment, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { get } from '../../utils/request';
import { GlobalContext } from '../context';

export default function ChartMenu({ model, mutate }) {
    const globalContext = useContext(GlobalContext);

    const router = useRouter();

    const { t } = useTranslation();

    const [favorite, setFavorite] = useState(false);

    useEffect(() => {
        setFavorite(model.favorite);
    }, [model.favorite]);

    const handleClick = async () => {

        let res = await get(`account/favorite-music?music_id=${model.id}`);

        if (res?.status === 'liked') {
            setFavorite(true);
        } else {
            setFavorite(false);
        }

        if (mutate) mutate();
    }

    return (
        <Menu as="div" className="relative d-flex align-items-center menyu">
            <Menu.Button className="">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M6 10C4.9 10 4 10.9 4 12C4 13.1 4.9 14 6 14C7.1 14 8 13.1 8 12C8 10.9 7.1 10 6 10ZM18 10C16.9 10 16 10.9 16 12C16 13.1 16.9 14 18 14C19.1 14 20 13.1 20 12C20 10.9 19.1 10 18 10ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z" fill="#BDBDBD" />
                </svg>
            </Menu.Button>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute w-56 mt-2 origin-top menu-content menyu-content">
                    {/* <Menu.Item>
                        {({ active }) => (
                            <button className="w-100" onClick={() => {
                                globalContext.dispatch({ type: TYPE_AP_ADD_TRACK, payload: model })
                            }}>
                                {t("Добавить в очередь")}
                            </button>
                        )}
                    </Menu.Item> */}
                    {globalContext.store.auth.isAuth && <Menu.Item>
                        {({ active }) => (
                            <button className="w-100" onClick={() => handleClick()}>
                                {favorite ? t("Не нравится") : t("Нравится")}
                            </button>
                        )}
                    </Menu.Item>}
                    <Menu.Item>
                        {({ active }) => (
                            <button className="w-100" onClick={() => router.push(`/person/${model.author_id}`)}>
                                {t("К исполнителю")}
                            </button>
                        )}
                    </Menu.Item>
                    {/* <Menu.Item>
                        {({ active }) => (
                            <button className="w-100" onClick={() => router.push("/")}>
                                {t("Поделиться")}
                            </button>
                        )}
                    </Menu.Item> */}
                </Menu.Items>
            </Transition>
        </Menu>

    );
}