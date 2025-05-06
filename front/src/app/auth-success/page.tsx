'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/authContext';
import { UserType } from '@/helpers/typeMock';

export default function AuthSuccessPage() {
    const { login } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [hasProcessed, setHasProcessed] = useState(false); // ← nuevo

    useEffect(() => {
        if (hasProcessed) return; // ← evita repetir

        const token = searchParams.get('token');
        const userString = searchParams.get('user');

        if (token && userString) {
            try {
                const user: UserType = JSON.parse(decodeURIComponent(userString));
                login(token, user).then(() => {
                    setHasProcessed(true); // ← marca como hecho
                    router.replace('/');
                });
            } catch (err) {
                console.error('Error procesando datos de Google:', err);
                setHasProcessed(true);
                router.replace('/login');
            }
        } else {
            setHasProcessed(true);
            router.replace('/login');
        }
    }, [searchParams, login, router, hasProcessed]);

    return (
        <div className="flex justify-center items-center h-screen">
            <p className="text-xl font-semibold">Procesando autenticación...</p>
        </div>
    );
}
