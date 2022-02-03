import React, { useContext, useEffect, useState, Fragment } from 'react';
import { useForm } from "react-hook-form";
import { useTranslation } from 'next-i18next';
import { post } from '../../utils/request';
import { toast } from 'react-toastify';
import { GlobalContext } from '../context';
import { Dialog, Transition } from '@headlessui/react';
import LoginForm from '../forms/LoginForm';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        padding: "0",
        background: 'transparent',
        border: 0
    },
    overlay: {
        background: 'rgba(4, 4, 4, 0.8)',
    }
};

export default function LoginModal({ isOpen, setIsOpen, showRegister }) {
    const globalContext = useContext(GlobalContext);

    const closeModal = () => setIsOpen(false);

    const { t, i18n } = useTranslation();

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog
                as="div"
                className="fixed inset-0 z-3333 overflow-y-auto"
                onClose={closeModal}
            >
                <div className="min-h-screen d-flex align-items-center justify-content-center">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0" style={customStyles.overlay} />
                    </Transition.Child>

                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <div>
                            <LoginForm closeModal={closeModal} showRegister={showRegister} isModal={true}/>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>

    )
}