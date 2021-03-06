import React, { useContext, useEffect, useRef, useState } from 'react';
import { useForm } from "react-hook-form";
import { useTranslation } from 'next-i18next';
import { toast } from 'react-toastify';
import { GlobalContext } from '../context';
import useUser from '../../utils/useUser';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';
import InputMask from '../parts/InputMask';
import { post } from '../../utils/request';
import moment from 'moment';
import { arrayToFormData } from '../../utils/functions';

import { useGoogleLogin } from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'

export default function LoginForm({ showRegister, closeModal, isModal = false }) {
    const { mutateUser } = useUser({
        redirectTo: '/account',
        redirectIfFound: !isModal,
    });

    const [step, setStep] = useState(1);
    const [timeLeft, setTimeLeft] = useState(10);

    const globalContext = useContext(GlobalContext);

    const router = useRouter();

    const { t } = useTranslation();

    const defaultValues = {
        username: "",
        password: ""
    };

    const restoreDefaultValues = {
        username: "",
        code: "",
        password: "",
        repeat_password: ""
    }

    const { register, handleSubmit, formState: { errors }, reset, control } = useForm({ defaultValues });
    const { register: restoreRegister, handleSubmit: restoreHandleSubmit, formState: { errors: restoreErrors }, control: restoreControl, watch: restoreWatch } = useForm({ restoreDefaultValues });

    const restorePassword = useRef({});
    restorePassword.current = restoreWatch("password", "");

    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async data => {
        try {
            setIsLoading(true);

            let { data: res } = await axios.post('/api/login', data);

            if (res.status === 'error') {
                if (res.code == 1) {

                    toast.error(t("?????????? ?????? ???????????? ???? ??????????????"), { toastId: "login-toast", updateId: "login-toast" });
                } else {

                    toast.error(t("?????????? ?????? ???????????? ?????????????? ???? ??????????"), { toastId: "login-toast", updateId: "login-toast" });
                }
            } else if (res.status == 'success') {
                toast.success(t("???????? ?????????????? ????????????????"), { toastId: "login-toast", updateId: "login-toast" });

                mutateUser(res.user);

                if (isModal) {
                    router.reload();
                } else {
                    globalContext.login(res.user);

                    reset(defaultValues);

                    if (closeModal)
                        closeModal();
                }


            }

            setIsLoading(false);
        } catch (ex) {

        }
    };

    const onRestore = async data => {
        try {
            setIsLoading(true);

            if (step == 2) {
                let res = await post(`user/restore`, data);

                if (res.status === 'error') {
                    if (res.code == 1) {
                        toast.error(t("?????????? ???? ??????????????????"), { toastId: "login-toast", updateId: "login-toast" });
                    } else if (res.code == 2) {
                        toast.error(t("???????????????????????? ???? ????????????"), { toastId: "login-toast", updateId: "login-toast" });
                    } else {
                        toast.error(t("?????????? ???? ??????????????????"), { toastId: "login-toast", updateId: "login-toast" });
                    }
                } else if (res.status == 'success') {
                    toast.info((data.username.indexOf("@") > -1 ? t("????????????????????, ?????????????????????? ??????????") : t("????????????????????, ?????????????????????? ?????????? ????????????????")) + ": " + data.username, { toastId: "login-toast", updateId: "login-toast" });
                    setTimeLeft(180);
                    setStep(3);
                }
            } else if (step == 3) {
                let res = await post(`user/restore-confirm`, (data));

                if (res.status == "error") {
                    toast.error(t("???? ?????????? ???????????????????????? ?????? ??????????????????????????, ?????????????????? ??????????????"))
                } else {
                    toast.success(t("?????????????? ?????????? ????????????"));
                    setStep(4);
                }
            } else if (step == 4) {
                let res = await post(`user/save-restore`, (data));

                if (res.status == "error") {
                    toast.error(t("???????????? ?????? ?????????????????????????? ????????"))
                } else {
                    toast.success(t("?????????? ???????????? ?????????????? ????????????????"));
                    setStep(1);
                }
            }

            setIsLoading(false);
        } catch (ex) {
            console.log(ex);
        }
    };

    useEffect(() => {
        if (!timeLeft) return;

        const intervalId = setInterval(() => {
            if (step == 3)
                setTimeLeft(timeLeft - 1);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [timeLeft, step]);

    const [showPassword, setShowPassword] = useState(false);

    const socialLogin = async (data) => {
        try {
            setIsLoading(true);

            let { data: res } = await axios.post('/api/social', data);

            if (res.status === 'error') {
                if (res.code == 1) {
                    toast.error(t("???????????????? ???? ????????????"), { toastId: "login-toast", updateId: "login-toast" });
                } else {
                    toast.error(t("?????????????????????? ???? ??????????????"), { toastId: "login-toast", updateId: "login-toast" });
                }
            } else if (res.status == 'success') {
                toast.success(t("???????? ?????????????? ????????????????"), { toastId: "login-toast", updateId: "login-toast" });

                mutateUser(res.user);

                if (isModal) {
                    router.reload();
                } else {
                    globalContext.login(res.user);

                    reset(defaultValues);

                    if (closeModal)
                        closeModal();
                }
            }

            setIsLoading(false);
        } catch (ex) {

        }
    }

    const responseGoogle = (response) => {
        if (response.error) return;

        const full_name = response.profileObj.name;
        const email = response.profileObj.email;
        const source_id = response.googleId;
        const token = response.tokenId;

        socialLogin({
            full_name,
            email,
            token,
            source_id,
            source: "google"
        });
    }

    const { signIn, loaded: googleLoaded } = useGoogleLogin({
        onSuccess: responseGoogle,
        clientId: "750066182581-7ke0eamdhhad9u890e4v9bs81ht5i1qh.apps.googleusercontent.com",
        cookiePolicy: "single_host_origin",
        onFailure: responseGoogle,
    });

    const responseFacebook = (response) => {
        if (!response.name) return;

        const full_name = response.name;
        const email = response.email;
        const source_id = response.id;
        const token = response.id;
        const expire = response.data_access_expiration_time;

        socialLogin({
            full_name,
            email,
            token,
            source_id,
            source: "facebook",
            expire
        });
    }

    console.log(errors);

    return (
        <div className="rizanova-login transition-all transform">
            {closeModal && <a role="button" className="close" onClick={closeModal}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#222" fillRule="evenodd" d="M12 10.75L3.25 2 2 3.25 10.75 12 2 20.75 3.25 22 12 13.25 20.75 22 22 20.75 13.25 12 22 3.25 20.75 2z" /></svg>
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
            {step == 1 ? (
                <>
                    <div className="d-flex justify-content-center w-100">
                        <h3>{t("?????????????? ?????? ??????????????????????????????????")}</h3>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group">
                            <div>
                                <input type="text" {...register("username", { required: true })} className={errors.username ? 'has-error' : ''} placeholder={t("?????????????? ?????????? ???????????????? ?????? ??????????") + "*"} />

                                {errors.username && errors.username.message.length > 0 && <p className="error-block">{errors.username.message}</p>}
                            </div>
                        </div>

                        <div className="form-group mb-1 position-relative">
                            <input type={showPassword ? 'text' : "password"} {...register("password", { required: true })} className={errors.password ? 'has-error' : ''} placeholder={t("?????????????? ????????????")} />

                            <a role="button" className={"eye " + (showPassword ? 'active' : '')} onClick={() => setShowPassword(!showPassword)}>
                                {/* Eye svg */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="14" viewBox="0 0 20 14">
                                    <path d="M10.0007 0.75C5.83398 0.75 2.27565 3.34167 0.833984 7C2.27565 10.6583 5.83398 13.25 10.0007 13.25C14.1673 13.25 17.7256 10.6583 19.1673 7C17.7256 3.34167 14.1673 0.75 10.0007 0.75ZM10.0007 11.1667C7.70065 11.1667 5.83398 9.3 5.83398 7C5.83398 4.7 7.70065 2.83333 10.0007 2.83333C12.3006 2.83333 14.1673 4.7 14.1673 7C14.1673 9.3 12.3006 11.1667 10.0007 11.1667ZM10.0007 4.5C8.61732 4.5 7.50065 5.61667 7.50065 7C7.50065 8.38333 8.61732 9.5 10.0007 9.5C11.384 9.5 12.5007 8.38333 12.5007 7C12.5007 5.61667 11.384 4.5 10.0007 4.5Z" />
                                </svg>
                            </a>
                        </div>

                        <div>
                            <a role="button" className="remember-me" onClick={() => setStep(2)}>{t("???? ?????????? ????????????")}</a>
                        </div>

                        <div>
                            <button type="submit" className="submit" disabled={isLoading}>{
                                isLoading ? <i className="fa fa-spinner rotating"></i> : t("??????????")
                            }</button>
                        </div>

                        <div>
                            {isModal ? (
                                <a role="button" className="another-link" onClick={showRegister}>
                                    {t("????????????????????????????????????")}
                                </a>
                            ) : (
                                <Link href="/signup">
                                    <a className="another-link">
                                        {t("????????????????????????????????????")}
                                    </a>
                                </Link>
                            )}

                        </div>

                        <div>
                            <p className="login-social-text">
                                {t("?????????? ?? ??????????????")}
                            </p>
                            <div className="d-flex justify-content-center">
                                <a role="button" className="me-3 social-login-btn" onClick={() => googleLoaded && signIn()}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                                        <path d="M16.0004 6.18675C19.0048 6.18675 21.0315 7.48452 22.187 8.56895L26.7026 4.16009C23.9293 1.58233 20.3204 0.00012207 16.0004 0.00012207C9.74259 0.00012207 4.33814 3.59121 1.70703 8.81784L6.88037 12.8356C8.17814 8.97784 11.7693 6.18675 16.0004 6.18675Z" fill="#EA4335" />
                                        <path d="M31.36 16.3552C31.36 15.0396 31.2533 14.0797 31.0222 13.0841H16V19.0218H24.8178C24.64 20.4974 23.68 22.7196 21.5467 24.2129L26.5956 28.124C29.6178 25.3329 31.36 21.2263 31.36 16.3552Z" fill="#4285F4" />
                                        <path d="M6.89778 19.1651C6.56 18.1695 6.36445 17.1029 6.36445 16.0007C6.36445 14.8984 6.56 13.8318 6.88 12.8362L1.70667 8.81848C0.622222 10.9874 0 13.4229 0 16.0007C0 18.5784 0.622222 21.014 1.70667 23.1828L6.89778 19.1651Z" fill="#FBBC05" />
                                        <path d="M16.0002 32.0001C20.3202 32.0001 23.9468 30.5779 26.5957 28.1246L21.5468 24.2135C20.1957 25.1557 18.3824 25.8135 16.0002 25.8135C11.7691 25.8135 8.17794 23.0224 6.89794 19.1647L1.72461 23.1824C4.35572 28.4091 9.74239 32.0001 16.0002 32.0001Z" fill="#34A853" />
                                    </svg>
                                </a>
                                <FacebookLogin
                                    appId={typeof window != "undefined" && window.location.hostname === "localhost" ? "433473258174999" : "612715569763311"}
                                    callback={responseFacebook}
                                    fields="name,email,picture"
                                    autoLoad={false}
                                    render={renderProps => (
                                        <a onClick={renderProps.onClick} role="button" className="social-login-btn">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                                                <path d="M32 16C32 7.16253 24.8375 0 16 0C7.16253 0 0 7.16253 0 16C0 23.9875 5.85 30.6063 13.5 31.8063V20.625H9.43747V16H13.5V12.475C13.5 8.4656 15.8875 6.25 19.5437 6.25C21.2937 6.25 23.125 6.5625 23.125 6.5625V10.5H21.1063C19.1187 10.5 18.5 11.7344 18.5 13V16H22.9375L22.2281 20.625H18.5V31.8063C26.15 30.6063 32 23.9875 32 16Z" fill="#1877F2" />
                                                <path d="M22.2282 20.625L22.9375 16H18.5V13C18.5 11.7344 19.1188 10.5 21.1063 10.5H23.125V6.5625C23.125 6.5625 21.2938 6.25 19.5438 6.25C15.8876 6.25 13.5 8.4656 13.5 12.475V16H9.4375V20.625H13.5V31.8063C14.3156 31.9344 15.15 32 16 32C16.85 32 17.6844 31.9344 18.5 31.8063V20.625H22.2282Z" fill="white" />
                                            </svg>
                                        </a>
                                    )}
                                />

                            </div>
                        </div>
                    </form>
                </>
            ) : (
                <>
                    <div className="d-flex justify-content-center w-100">
                        <h3>{t("???????????????????????????? ????????????")}</h3>
                    </div>

                    <form onSubmit={restoreHandleSubmit(onRestore)}>
                        {step == 2 ? (
                            <>
                                <div className="form-group">
                                    <div>
                                        <input type="text" {...restoreRegister("username", { required: true })} className={restoreErrors.username ? 'has-error' : ''} placeholder={t("?????????????? ?????????? ???????????????? ?????? ??????????") + "*"} />

                                        {restoreErrors.username && restoreErrors.username.message.length > 0 && <p className="error-block">{restoreErrors.username.message}</p>}
                                    </div>
                                </div>

                                <div>
                                    <button type="submit" className="submit" disabled={isLoading}>{
                                        isLoading ? <i className="fa fa-spinner rotating"></i> : t("??????????")
                                    }</button>
                                </div>
                            </>) : (step == 3 ? (
                                <>
                                    <div className="form-group">
                                        <div>
                                            <input type='text' autoComplete='off' {...restoreRegister("code", { required: true })} className={restoreErrors.code ? 'has-error' : ''} placeholder={t("?????????????? ???????????????????? ??????")} />
                                        </div>
                                    </div>

                                    <div className='mb-1'>
                                        {timeLeft > 0 ? (
                                            <a role="button" className="remember-me">{t("?????????????????? ?????? ???????????????? ?????????? ??????????")} {moment.utc(timeLeft * 1000).format("mm:ss")}</a>
                                        ) : (
                                            <a role="button" className="remember-me" onClick={async () => {
                                                let res = await post(`user/send-again?restore=1`, arrayToFormData({ id: user.id }));

                                                if (res.status == "success") {
                                                    setTimeLeft(180);
                                                    toast.info(t("?????????????????? ?????? ??????????????????"))
                                                }

                                            }}>{t("?????????????????? ?????? ????????????????")}</a>
                                        )}
                                    </div>


                                    <div>
                                        <button type="submit" className="submit" disabled={isLoading}>{
                                            isLoading ? <i className="fa fa-spinner rotating"></i> : (step == 2 ? t("??????????") : t("??????????????????????"))
                                        }</button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="form-group position-relative mb-0">
                                        <input type={showPassword ? 'text' : "password"} {...restoreRegister("password", {
                                            required: true,
                                            minLength: {
                                                value: 8,
                                                message: t("???????????? ???????????? ???????????????? ???? ?????????? ?????? ???? 8 ????????????????")
                                            }
                                        })} className={restoreErrors.password ? 'has-error' : ''} placeholder={t("?????????????? ?????????? ????????????") + "*"} />

                                        <a role="button" className={"eye " + (showPassword ? 'active' : '')} onClick={() => setShowPassword(!showPassword)}>
                                            {/* Eye svg */}
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="14" viewBox="0 0 20 14">
                                                <path d="M10.0007 0.75C5.83398 0.75 2.27565 3.34167 0.833984 7C2.27565 10.6583 5.83398 13.25 10.0007 13.25C14.1673 13.25 17.7256 10.6583 19.1673 7C17.7256 3.34167 14.1673 0.75 10.0007 0.75ZM10.0007 11.1667C7.70065 11.1667 5.83398 9.3 5.83398 7C5.83398 4.7 7.70065 2.83333 10.0007 2.83333C12.3006 2.83333 14.1673 4.7 14.1673 7C14.1673 9.3 12.3006 11.1667 10.0007 11.1667ZM10.0007 4.5C8.61732 4.5 7.50065 5.61667 7.50065 7C7.50065 8.38333 8.61732 9.5 10.0007 9.5C11.384 9.5 12.5007 8.38333 12.5007 7C12.5007 5.61667 11.384 4.5 10.0007 4.5Z" />
                                            </svg>
                                        </a>
                                    </div>
                                    {restoreErrors.password && restoreErrors.password.message.length > 0 && <p className="error-block">{restoreErrors.password.message}</p>}
                                    <div className="form-group mb-0 mt-3 position-relative">
                                        <input type={showPassword ? 'text' : "password"} {...restoreRegister("repeat_password", {
                                            required: true,
                                            validate: value => value === restorePassword.current || t("???????????? ???? ??????????????????")
                                        })} className={restoreErrors.repeat_password ? 'has-error' : ''} placeholder={t("?????????????????? ????????????") + "*"} />
                                        <a role="button" className={"eye " + (showPassword ? 'active' : '')} onClick={() => setShowPassword(!showPassword)}>
                                            {/* Eye svg */}
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="14" viewBox="0 0 20 14">
                                                <path d="M10.0007 0.75C5.83398 0.75 2.27565 3.34167 0.833984 7C2.27565 10.6583 5.83398 13.25 10.0007 13.25C14.1673 13.25 17.7256 10.6583 19.1673 7C17.7256 3.34167 14.1673 0.75 10.0007 0.75ZM10.0007 11.1667C7.70065 11.1667 5.83398 9.3 5.83398 7C5.83398 4.7 7.70065 2.83333 10.0007 2.83333C12.3006 2.83333 14.1673 4.7 14.1673 7C14.1673 9.3 12.3006 11.1667 10.0007 11.1667ZM10.0007 4.5C8.61732 4.5 7.50065 5.61667 7.50065 7C7.50065 8.38333 8.61732 9.5 10.0007 9.5C11.384 9.5 12.5007 8.38333 12.5007 7C12.5007 5.61667 11.384 4.5 10.0007 4.5Z" />
                                            </svg>
                                        </a>
                                    </div>
                                    {restoreErrors.repeat_password && restoreErrors.repeat_password.message.length > 0 && <p className="error-block">{restoreErrors.repeat_password.message}</p>}

                                    <div>
                                        <button type="submit" className="submit" disabled={isLoading}>{
                                            isLoading ? <i className="fa fa-spinner rotating"></i> : t("??????????????????")
                                        }</button>
                                    </div>
                                </>
                            ))}
                    </form>
                </>
            )}

        </div>
    )
}