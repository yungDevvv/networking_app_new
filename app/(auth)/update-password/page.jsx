"use client"

import { updateRecoveryPassword } from '@/lib/appwrite/server/appwrite';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function Page() {
    // const t = useTranslations();
    // const searchParams = useSearchParams();
    // const router = useRouter();

    // const [password, setPassword] = useState('');
    // const [confirmPassword, setConfirmPassword] = useState('');
    // const [successMessage, setSuccessMessage] = useState('');
    // const [errorMessage, setErrorMessage] = useState('');
    // const [isLoading, setIsLoading] = useState(false);

    // const userId = searchParams?.get('userId');
    // const secret = searchParams?.get('secret');

    // if (!userId || !secret) {
    //     return (
    //         <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    //             <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
    //                 {/* <h2 className="text-2xl font-semibold text-center mb-6">{t('invalid_recovery_link')}</h2> */}
    //                 <p className="text-center text-sm text-red-600">
    //                     {/* {t('invalid_recovery_link_description')} */}
    //                 </p>
    //                 <div className="text-center mt-6">
    //                     <a href="/login" className="text-indigo-600 hover:text-indigo-700">Takaisin kirjautumiseen</a>
    //                 </div>
    //             </div>
    //         </div>
    //     );
    // }

    // const handleUpdatePassword = async (e) => {
    //     e.preventDefault();
    //     setIsLoading(true);
    //     setErrorMessage("");
    //     setSuccessMessage("");

    //     try {
    //         if (!password || !confirmPassword) {
    //             throw new Error(t('password_fields_required'));
    //         }

    //         if (password !== confirmPassword) {
    //             throw new Error(t('passwords_not_match'));
    //         }

    //         if (password.length < 8) {
    //             throw new Error(t('password_min_length'));
    //         }

    //         await updateRecoveryPassword(secret, userId, password);
    //         setSuccessMessage(t('password_update_success'));
    //         setTimeout(() => {
    //             router.push('/login');
    //         }, 2000);

    //     } catch (error) {
    //         console.error('Error updating password:', error);
    //         setErrorMessage(error.message || t('password_update_error'));
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            {/* <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-2xl font-semibold text-center mb-6">{t('update_password')}</h2>
                <form onSubmit={handleUpdatePassword} className="space-y-4">
                    {errorMessage && (
                        <p className="text-center text-sm text-red-600">
                            Virhe: {errorMessage}
                        </p>
                    )}
                    {successMessage && (
                        <p className="text-center text-sm text-green-500">
                            {successMessage}
                        </p>
                    )}
                    <div className="form-group">
                        <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">{t('new_password')}</label>
                        <input
                            id="new-password"
                            name="new-password"
                            type="password"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder={t('enter_new_password')}
                            required
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">{t('confirm_password')}</label>
                        <input
                            id="confirm-password"
                            name="confirm-password"
                            type="password"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder={t('confirm_new_password')}
                            required
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    <button
                        type="submit"
                        className={`w-full bg-indigo-600 text-white py-2 px-4 rounded-md transition-colors ${
                            isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'
                        }`}
                        disabled={isLoading}
                    >
                        {isLoading ? t('updating_password') : t('update_password_button')}
                    </button>
                </form>
                <div className="text-center mt-6">
                    <a href="/login" className="text-indigo-600 hover:text-indigo-700">{t('back_to_login')}</a>
                </div>
            </div> */}
        </div>
    );
}
