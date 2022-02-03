import { useRef } from "react";
import { useEffect } from "react";
import { useTranslation } from "next-i18next";
import useUser from "../../utils/useUser";

export default function Payme({ amount, isLoading, setIsLoading }) {

    const { t } = useTranslation();

    const ref = useRef(null);

    const { user } = useUser();

    useEffect(() => {
        const fetchOrder = async () => {
            if (Number.parseFloat(amount) >= 1000) {
                if (ref.current) {
                    ref.current.submit();
                }
            }

            setIsLoading(false);
        }

        if (isLoading)
            fetchOrder();

    }, [isLoading, amount]);

    return (
        <form ref={ref} method="POST" action="https://checkout.paycom.uz/" id="payment-form">
            <input type="hidden" name="merchant" value="616922f2a934af095c7fdde5" />
            <input type="hidden" id="user_id" name="account[user_id]" value={user.id} />
            <input type="hidden" id="real-amount" name="amount" value={amount * 100} />

            <button type="submit">{t("Оплатить через Payme")}</button>
        </form>
    );
}