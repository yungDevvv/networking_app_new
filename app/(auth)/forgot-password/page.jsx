"use client"

import { createAnonymousRecoveryPassword } from '@/lib/appwrite/server/appwrite';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useOrigin } from '@/hooks/use-origin';
import { Separator } from '@/components/ui/separator';

export default function Page() {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const origin = useOrigin();

    const handleSendEmailPasswordRecovery = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage("");
        setSuccessMessage("");

        try {
            await createAnonymousRecoveryPassword(email, origin + '/update-password?anonym=true');
            setSuccessMessage('Palautuslinkki on lähetetty, tarkista sähköpostiisi.');

            setTimeout(() => {
                router.push('/login');
            }, 2000);

        } catch (error) {
            console.log('Error updating password:', error);
            setErrorMessage(error.message || 'Virhe salasanan uusimisessa.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-2xl font-semibold text-center mb-6">Salasanan uusiminen</h2>
                <form onSubmit={handleSendEmailPasswordRecovery} className="space-y-4">
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
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Sähköposti</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    <button
                        type="submit"
                        className={`w-full bg-indigo-600 text-white py-2 px-4 text-center rounded-md transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'}`}
                        disabled={isLoading}
                    >
                        Lähetä
                    </button>
                </form>
                <Separator className="my-4" />
                <div className="text-center text-sm mt-4">
                    <a href="/login" className="text-indigo-600 hover:text-indigo-700">Takaisin kirjautumiseen</a>
                </div>
            </div>
        </div>
    );
}
