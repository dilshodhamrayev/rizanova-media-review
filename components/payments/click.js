import { useEffect } from "react";
import useUser from "../../utils/useUser";

export default function Click({ amount, isLoading, setIsLoading }) {

    const { user } = useUser();

    useEffect(() => {
        window.location.href = `https://my.click.uz/services/pay?service_id=19658&merchant_id=14148&amount=${amount}&transaction_param=${user.id}&return_url=${window.location.href}`;

    }, [isLoading, amount]);

    return (
        <div></div>
    );
}