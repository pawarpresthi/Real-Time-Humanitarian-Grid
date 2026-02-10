'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './login.module.css';

export default function NGOLogin() {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });

            if (res.ok) {
                const data = await res.json();
                localStorage.setItem('ngo_auth', 'true');
                localStorage.setItem('ngo_name', data.orgName);
                router.push('/ngo');
            } else {
                const data = await res.json();
                setError(data.error || 'Login failed');
            }
        } catch (e) {
            setError('Connection error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginCard}>
                <div className={styles.logoArea}>
                    <p className={styles.logoSubtitle}>Volunteer Portal</p>
                    <h1 className={styles.logoTitle}>Suraksha Signal</h1>
                </div>

                {error && <div className={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Username</label>
                        <input
                            type="text"
                            className={styles.input}
                            placeholder="Enter username"
                            value={credentials.username}
                            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Password</label>
                        <input
                            type="password"
                            className={styles.input}
                            placeholder="••••••••"
                            value={credentials.password}
                            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                            required
                        />
                    </div>
                    <button type="submit" className={styles.loginButton} disabled={loading}>
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>

                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', textAlign: 'center', marginTop: '1.5rem' }}>
                        Don't have an account? <Link href="/ngo/signup" style={{ color: '#10b981', fontWeight: 'bold' }}>Sign Up</Link>
                    </p>

                    <p style={{ color: '#64748b', fontSize: '0.75rem', textAlign: 'center', marginTop: '1rem' }}>
                        Default Demo: ngo_admin / suraksha2024
                    </p>
                </form>
            </div>
        </div>
    );
}
