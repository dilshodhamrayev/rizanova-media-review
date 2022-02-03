import { useTranslation } from 'next-i18next';
import AsyncSelect from 'react-select/async';
import { get } from '../utils/request';
import { useRouter } from 'next/router';

export default function Select({ model }) {

    const { t } = useTranslation();

    const router = useRouter()

    const handleChange = (value) => {
        if (value?.value) {
            let r = router.asPath.split("/");

            r.pop();

            router.push(r.join("/") + "/" + value.value)
        }
    };

    const loadOptions = async (
        inputValue,
        callback
    ) => {
        if (inputValue.length > 1) {
            let res = await get(`person/select?q=${inputValue}`);

            callback(res);
        }
    };

    return (
        <div className="ms-md-2 person-select fs-14">
            <AsyncSelect
                instanceId="person-select"
                placeholder={t("Выбрать персону")}
                cacheOptions
                loadOptions={loadOptions}
                defaultOptions
                onChange={handleChange}
                defaultValue={{ label: model.name, value: model.id }}
                noOptionsMessage={({ inputValue }) => !inputValue || inputValue.length < 2 ? t("Введите не менее 2 символов") : t("Ничего не найдено")}
            />
        </div>
    );
}