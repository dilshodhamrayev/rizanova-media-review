import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { useTranslation } from "next-i18next";
import { toast } from "react-toastify";
import { arrayToFormData } from "../../utils/functions";
import { post } from "../../utils/request";
import useUser from "../../utils/useUser";
import { GlobalContext } from "../context";

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

export default function TariffButton({ model, mutate }) {
    const globalContext = useContext(GlobalContext);

    const router = useRouter();

    const {t, i18n} = useTranslation();

    const { user, mutateUser } = useUser();

    const [isLoading, setIsLoading] = useState(false);

    const subscribe = async (model) => {
        if (isLoading) return;

        if (!globalContext.store.auth.isAuth) {
            toast.info(t("Войдите чтобы оформить подписку", {toastId: "subscription-msg", updateid: "subscription-msg"}));

            router.push('/login')
            return;
        }

        if (Number.parseFloat(model.price) <= Number.parseFloat(globalContext.store.auth.user.balance)) {
            const options = {
                title: t("Оформление подписки") + " " + model.name,
                message: '',
                buttons: [
                    {
                        label: t("Подтвердить"),
                        onClick: async () => {
                            setIsLoading(true);

                            let res = await post("subscription/subscribe", arrayToFormData({ tariff_id: model.id }));

                            if (res.status === "success") {
                                toast.success(t("Поздравляем! Вы успешно оформили подписку."));

                                if (mutate)
                                    mutate();

                                mutateUser();
                            } else {
                                if (res.code == 1) {
                                    toast.error(t("Подписка не найдена"));
                                } else if (res.code == 2) {
                                    toast.error(t("Пользователь не найден"));
                                } else if (res.code == 3) {
                                    toast.error(t("На вашем балансе недостаточно средств"));

                                    if (res.currency)
                                        router.push(`/account/payment?currency=${res.currency}`);
                                } else if (res.code == 4) {
                                    toast.info(t("Вы уже оформили подписку"));
                                } else {
                                    toast.error(res.message);
                                }
                            }

                            setIsLoading(false);
                        }
                    },
                    {
                        label: t("Отмена"),
                    }
                ],
                closeOnEscape: true,
                closeOnClickOutside: true,
                overlayClassName: "overlay-custom-class-name"
            };
            confirmAlert(options);
        } else {
            toast.error(t("У вас недостаточно средств на балансе, пожалуйста, пополните баланс"));
            router.push(`/account/payment?currency=${Number.parseFloat(model.price) - Number.parseFloat(globalContext.store.auth.user.balance)}`);
        }
    }

    return user && model.is_active ? (
        <a role="button" className="btn-gradient-purple-text me-2 mb-3">{t("Уже оформлен")}</a>
    ) : (
        <a role="button" className="btn-gradient-purple me-2 mb-3" onClick={() => {
            subscribe(model);
        }}>
            {isLoading && <i className="fa fa-spinner rotating me-2"></i>}
            {t("Оформить подписку")}
        </a>
    );
}