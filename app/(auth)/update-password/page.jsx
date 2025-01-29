"use client"

// import { updateRecoveryPassword } from '@/lib/appwrite/server/appwrite';
// import { Loader2 } from 'lucide-react';
// import { useSearchParams, useRouter } from 'next/navigation';
// import { useState } from 'react';

export default function Page() {
    // const searchParams = useSearchParams();
    // const router = useRouter();

    // const [password, setPassword] = useState('');
    // const [confirmPassword, setConfirmPassword] = useState('');
    // const [successMessage, setSuccessMessage] = useState('');
    // const [errorMessage, setErrorMessage] = useState('');
    // const [isLoading, setIsLoading] = useState(false);

    // const userId = searchParams?.get('userId');
    // const secret = searchParams?.get('secret');
    // const anonym = searchParams?.get('anonym');

    // if (!userId || !secret) {
    //     return (
    //         <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    //             <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
    //                 <h2 className="text-2xl font-semibold text-center mb-6">Virheellinen palautuslinkki</h2>
    //                 <p className="text-center text-sm text-red-600">
    //                     Yritä uudelleen!
    //                 </p>
    //                 <div className="text-center mt-6">
    //                     <a href="/login" className="text-indigo-600 hover:text-indigo-700">Takaisin kirjautumiseen</a>
    //                 </div>
    //             </div>
    //         </div>
    //     );
    // }
    // const handleAnonymUpdatePassword = async (e) => {
    //     e.preventDefault();
    //     setIsLoading(true);
    //     setErrorMessage("");
    //     setSuccessMessage("");

    //     try {
    //         if (!password || !confirmPassword) {
    //             throw new Error("Salasanat ovat pakollisia");
    //         }

    //         if (password !== confirmPassword) {
    //             throw new Error("Salasanat eivät täsmää");
    //         }

    //         if (password.length < 8) {
    //             throw new Error("Salasana on liian lyhyt");
    //         }

    //         await updateRecoveryPassword(secret, userId, password, anonym);

    //         setSuccessMessage("Salasana on päivitetty onnistuneesti.");

    //         setTimeout(() => {
    //             router.push('/login');
    //         }, 2000);

    //     } catch (error) {
    //         console.log('Error updating password:', error);
    //         setErrorMessage(error.message || "Tapahtui virhe");
    //     } finally {
    //         setIsLoading(false);
    //     }

    // }
    // const handleUpdatePassword = async (e) => {
    //     e.preventDefault();
    //     setIsLoading(true);
    //     setErrorMessage("");
    //     setSuccessMessage("");

    //     try {
    //         if (!password || !confirmPassword) {
    //             throw new Error("Salasanat ovat pakollisia");
    //         }

    //         if (password !== confirmPassword) {
    //             throw new Error("Salasanat eivät täsmää");
    //         }

    //         if (password.length < 8) {
    //             throw new Error("Salasana on liian lyhyt");
    //         }

    //         await updateRecoveryPassword(secret, userId, password);
    //         setSuccessMessage("Salasana on muokattu");
    //         setTimeout(() => {
    //             router.push('/dashboard');
    //         }, 2000);

    //     } catch (error) {
    //         console.log('Error updating password:', error);
    //         setErrorMessage(error.message || "Tapahtui virhe");
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    return (
        <div></div>
        // <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        //     <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        //         <h2 className="text-2xl font-semibold text-center mb-6">Salasanan uusiminen</h2>
        //         <form onSubmit={anonym ? handleAnonymUpdatePassword : handleUpdatePassword} className="space-y-4">
        //             {errorMessage && (
        //                 <p className="text-center text-sm text-red-600">
        //                     Virhe: {errorMessage}
        //                 </p>
        //             )}
        //             {successMessage && (
        //                 <p className="text-center text-sm text-green-500">
        //                     {successMessage}
        //                 </p>
        //             )}
        //             <div className="form-group">
        //                 <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">Kirjoita uusi salasana</label>
        //                 <input
        //                     id="new-password"
        //                     name="new-password"
        //                     type="password"
        //                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        //                     placeholder={"Kirjoita uusi salasana"}
        //                     required
        //                     onChange={(e) => setPassword(e.target.value)}
        //                     disabled={isLoading}
        //                 />
        //             </div>
        //             <div className="form-group">
        //                 <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">Vahvista salasana</label>
        //                 <input
        //                     id="confirm-password"
        //                     name="confirm-password"
        //                     type="password"
        //                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        //                     placeholder={"Vahvista uusi salasana"}
        //                     required
        //                     onChange={(e) => setConfirmPassword(e.target.value)}
        //                     disabled={isLoading}
        //                 />
        //             </div>
        //             <button
        //                 type="submit"
        //                 className={`w-full bg-indigo-600 text-white py-2 px-4 rounded-md transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'}`}
        //                 disabled={isLoading}
        //             >
        //                 Päivitä
        //             </button>
        //         </form>
        //         <div className="text-center mt-6">
        //             <a href="/login" className="text-indigo-600 hover:text-indigo-700">Takaisin kirjautumiseen</a>
        //         </div>
        //     </div>
        // </div>
    )
}
