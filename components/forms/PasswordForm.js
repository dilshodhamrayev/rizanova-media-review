import React, { useContext, useEffect, useState, Fragment, useRef } from 'react';
import { useForm } from "react-hook-form";
import { useTranslation } from 'next-i18next';
import { toast } from 'react-toastify';
import { GlobalContext } from '../context';
import Router from 'next/router';
import Link from 'next/link';
import { post } from '../../utils/request';
import useUser from '../../utils/useUser';
import { arrayToFormData } from '../../utils/functions';

export default function PasswordForm({ closeModal }) {
    const globalContext = useContext(GlobalContext);

    const { user, mutateUser } = useUser

    const { t, i18n } = useTranslation();

    const defaultValues = {
        password: "",
        new_password: "",
        repeat_new_password: ""
    };

    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({ defaultValues });

    const password = useRef({});
    password.current = watch("new_password", "");

    const [showPassword, setShowPassword] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async data => {
        try {
            setIsLoading(true);

            let res = await post('account/change-password', arrayToFormData(data));

            if (res.status === 'error') {
                if (res.code == 1) {
                    toast.error(t("Пожалуйста, авторизуйтесь"), { toastId: "password-msg", updateId: "password-msg" });
                    mutateUser();
                } else if (res.code == 2) {
                    toast.error(t("Ваш аккаунт не найден"), { toastId: "password-msg", updateId: "password-msg" });
                    mutateUser();
                } else if (res.code == 3) {
                    toast.error(t("Ошибка сервера, повторите попытку"), { toastId: "password-msg", updateId: "password-msg" });
                } else if (res.code == 4) {
                    toast.error(t("Новые пароли не совпадают"), { toastId: "password-msg", updateId: "password-msg" });
                } else if (res.code == 5) {
                    toast.error(t("Текущий пароль не правильно"), { toastId: "password-msg", updateId: "password-msg" });
                }
            } else if (res.status == 'success') {
                toast.success(t("Новый пароль успешно сохранён"), { toastId: "password-msg", updateId: "password-msg" });

                reset(defaultValues);

                if (closeModal)
                    closeModal();
            }

            setIsLoading(false);
        } catch (ex) {

        }
    };

    return (
        <div className="rizanova-login transition-all transform">
            {closeModal && <a role="button" className="close" onClick={closeModal}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                    <path fill="#222" fillRule="evenodd" d="M12 10.75L3.25 2 2 3.25 10.75 12 2 20.75 3.25 22 12 13.25 20.75 22 22 20.75 13.25 12 22 3.25 20.75 2z" />
                </svg>
            </a>}

            <div className="d-flex justify-content-center">
                <svg className="logo" xmlns="http://www.w3.org/2000/svg" width="165" height="40" viewBox="0 0 165 40" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M0 12.5014V37.9964C0 39.6265 1.84542 40.5719 3.16841 39.6196L28.3416 21.4997C32.5071 18.0766 34.2419 8.18974 27.3721 2.81221C23.8917 0.0878355 19.1481 1.63831e-05 14.7283 1.03918e-05L6.19337 0C4.67246 0 3.08157 0.0994002 1.87687 1.02778C0.942838 1.74757 0.132437 2.81182 0.132437 4.19002C0.132437 5.73443 0.0874077 7.94027 0.0491217 9.81577C0.0274693 10.8764 0.00797371 11.8315 0 12.5014ZM8.93848 35.285V16.074C8.93848 14.8522 9.13915 13.6131 9.83511 12.609C11.3145 10.4745 14.1715 8.12957 18.3415 9.16306C24.7647 11.1462 21.3214 16.2748 20.7254 16.9586C20.6876 17.002 20.6453 17.0527 20.5979 17.1097C19.8964 17.9516 18.0637 20.1509 12.9778 19.8307V32.413L8.93848 35.285Z" fill="#EF225D" />
                    <ellipse cx="27.0565" cy="34.0122" rx="4.47059" ry="4.64915" fill="#EF225D" />
                    <path d="M62.08 31.5789H57.3498L52.164 22.8421H48.0995V31.5789H44V8.17544H54.2664C56.5556 8.17544 58.401 8.8538 59.8025 10.2105C61.2041 11.5673 61.9048 13.3333 61.9048 15.5088C61.9048 17.4737 61.3676 19.0526 60.2931 20.2456C59.2185 21.4152 57.9104 22.1287 56.3687 22.386L62.08 31.5789ZM53.7058 19.2281C54.8737 19.2281 55.8314 18.8889 56.5789 18.2105C57.3264 17.5322 57.7002 16.6316 57.7002 15.5088C57.7002 14.386 57.3264 13.4854 56.5789 12.807C55.8314 12.1287 54.8737 11.7895 53.7058 11.7895H48.0995V19.2281H53.7058Z" fill="black" />
                    <path d="M66.3761 12.5614C65.7688 12.5614 65.2315 12.3392 64.7643 11.8947C64.3205 11.4503 64.0986 10.9123 64.0986 10.2807C64.0986 9.64912 64.3205 9.11111 64.7643 8.66667C65.2315 8.22222 65.7688 8 66.3761 8C67.0068 8 67.5441 8.22222 67.9879 8.66667C68.4317 9.11111 68.6537 9.64912 68.6537 10.2807C68.6537 10.9123 68.4317 11.4503 67.9879 11.8947C67.5441 12.3392 67.0068 12.5614 66.3761 12.5614ZM68.2332 31.5789H64.5541V14.6316H68.2332V31.5789Z" fill="black" />
                    <path d="M84.3122 31.5789H70.8923V28.807L78.5 18.5L70.8923 17.8596V14.6316H84.172V17.3333L75.7277 28.386H84.3122V31.5789Z" fill="black" />
                    <path d="M101 31.5789H97.3209V29.7544C96.0128 31.2515 94.1908 32 91.8549 32C90.3132 32 88.9466 31.5088 87.7553 30.5263C86.564 29.5205 85.9683 28.1404 85.9683 26.386C85.9683 24.5848 86.5523 23.2164 87.7203 22.2807C88.9116 21.345 90.2898 20.8772 91.8549 20.8772C94.2609 20.8772 96.0829 21.6023 97.3209 23.0526V20.5263C97.3209 19.5439 96.9589 18.7719 96.2347 18.2105C95.5106 17.6491 94.5529 17.3684 93.3615 17.3684C91.4694 17.3684 89.7992 18.0819 88.351 19.5088L86.8443 16.9474C88.7598 15.1228 91.1307 14.2105 93.9572 14.2105C96.0362 14.2105 97.7297 14.7018 99.0378 15.6842C100.346 16.6667 101 18.2222 101 20.3509V31.5789ZM93.2915 29.4737C95.1368 29.4737 96.48 28.8889 97.3209 27.7193V25.1579C96.48 23.9883 95.1368 23.4035 93.2915 23.4035C92.2403 23.4035 91.376 23.6842 90.6986 24.2456C90.0212 24.807 89.6825 25.5439 89.6825 26.4561C89.6825 27.3684 90.0212 28.1053 90.6986 28.6667C91.376 29.2047 92.2403 29.4737 93.2915 29.4737Z" fill="black" />
                    <path d="M120.763 31.6289H119.782L105.981 12.6082V31.6289H105V11H105.981L119.782 29.8351V11H120.763V31.6289Z" fill="black" />
                    <path d="M131.04 32C128.995 32 127.329 31.2577 126.041 29.7732C124.774 28.268 124.14 26.3918 124.14 24.1443C124.14 21.9175 124.774 20.0619 126.041 18.5773C127.329 17.0722 128.995 16.3196 131.04 16.3196C133.105 16.3196 134.771 17.0619 136.039 18.5464C137.306 20.0309 137.94 21.8969 137.94 24.1443C137.94 26.3918 137.306 28.268 136.039 29.7732C134.771 31.2577 133.105 32 131.04 32ZM131.04 31.1649C132.859 31.1649 134.291 30.4845 135.333 29.1237C136.396 27.7423 136.928 26.0825 136.928 24.1443C136.928 22.2268 136.396 20.5876 135.333 19.2268C134.291 17.8454 132.859 17.1546 131.04 17.1546C129.241 17.1546 127.81 17.8454 126.746 19.2268C125.683 20.5876 125.152 22.2268 125.152 24.1443C125.152 26.0825 125.683 27.7423 126.746 29.1237C127.81 30.4845 129.241 31.1649 131.04 31.1649Z" fill="black" />
                    <path d="M146.373 31.6289H145.3L138.952 16.6907H140.025L145.852 30.5464L151.648 16.6907H152.721L146.373 31.6289Z" fill="black" />
                    <path d="M165 31.6289H164.08V29.8041C162.751 31.268 161.044 32 158.959 32C157.568 32 156.352 31.5567 155.309 30.6701C154.287 29.7629 153.776 28.5464 153.776 27.0206C153.776 25.4948 154.287 24.2887 155.309 23.4021C156.331 22.4948 157.548 22.0412 158.959 22.0412C161.044 22.0412 162.751 22.7732 164.08 24.2371V20.866C164.08 19.7113 163.681 18.8041 162.884 18.1443C162.087 17.4845 161.095 17.1546 159.909 17.1546C158.028 17.1546 156.444 17.9381 155.156 19.5052L154.45 18.8866C155.207 18 156.004 17.3505 156.843 16.9381C157.681 16.5258 158.703 16.3196 159.909 16.3196C161.422 16.3196 162.649 16.7113 163.589 17.4948C164.53 18.2577 165 19.3711 165 20.8351V31.6289ZM159.204 31.1649C161.31 31.1649 162.935 30.4021 164.08 28.8763V25.1649C162.935 23.6392 161.31 22.8763 159.204 22.8763C157.875 22.8763 156.802 23.2783 155.984 24.0825C155.186 24.866 154.788 25.8454 154.788 27.0206C154.788 28.1959 155.186 29.1856 155.984 29.9897C156.802 30.7732 157.875 31.1649 159.204 31.1649Z" fill="black" />
                </svg>
            </div>

            <div className="d-flex justify-content-center w-100">
                <h3>{t("Смена пароля")}</h3>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group position-relative">
                    <input type={showPassword ? 'text' : "password"} {...register("password", {
                        required: true
                    })} className={errors.password ? 'has-error' : ''} placeholder={t("Текущий пароль")} />
                    <a role="button" className={"eye " + (showPassword ? 'active' : '')} onClick={() => setShowPassword(!showPassword)}>
                        {/* Eye svg */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="14" viewBox="0 0 20 14">
                            <path d="M10.0007 0.75C5.83398 0.75 2.27565 3.34167 0.833984 7C2.27565 10.6583 5.83398 13.25 10.0007 13.25C14.1673 13.25 17.7256 10.6583 19.1673 7C17.7256 3.34167 14.1673 0.75 10.0007 0.75ZM10.0007 11.1667C7.70065 11.1667 5.83398 9.3 5.83398 7C5.83398 4.7 7.70065 2.83333 10.0007 2.83333C12.3006 2.83333 14.1673 4.7 14.1673 7C14.1673 9.3 12.3006 11.1667 10.0007 11.1667ZM10.0007 4.5C8.61732 4.5 7.50065 5.61667 7.50065 7C7.50065 8.38333 8.61732 9.5 10.0007 9.5C11.384 9.5 12.5007 8.38333 12.5007 7C12.5007 5.61667 11.384 4.5 10.0007 4.5Z" />
                        </svg>
                    </a>
                </div>
                <div className="form-group mb-0 mt-3">
                    <div>
                        <input type={showPassword ? 'text' : "password"}
                            {...register("new_password", {
                                required: true,
                                minLength: {
                                    value: 8,
                                    message: t("Пароль должен состоять не менее чем из 8 символов")
                                }
                            })} className={errors.new_password ? 'has-error' : ''} placeholder={t("Новый пароль")}
                        />
                    </div>
                    {errors.new_password && errors.new_password.message.length > 0 && <p className="error-block">{errors.new_password.message}</p>}

                </div>
                <div className="form-group mb-0 mt-3">
                    <input type={showPassword ? 'text' : "password"}
                        {...register("repeat_new_password", {
                            required: true,
                            validate: value => value === password.current || t("Пароли не совпадают")
                        })}
                        className={errors.repeat_new_password ? 'has-error' : ''} placeholder={t("Повторите новый пароль")}
                    />
                </div>
                {errors.repeat_new_password && errors.repeat_new_password.message.length > 0 && <p className="error-block">{errors.repeat_new_password.message}</p>}

                <div>
                    <button type="submit" className="submit" disabled={isLoading}>{
                        isLoading ? <i className="fa fa-spinner rotating"></i> : t("Подтвердить")
                    }</button>
                </div>
            </form >
        </div >
    )
}