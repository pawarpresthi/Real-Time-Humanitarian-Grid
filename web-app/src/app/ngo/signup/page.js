'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../login/login.module.css';

export default function NGOSignup() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        orgName: '',
        phone: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                router.push('/ngo/login?signedup=true');
            } else {
                const data = await res.json();
                setError(data.error || 'Signup failed');
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
                    <p className={styles.logoSubtitle}>Volunteer Registration</p>
                    <h1 className={styles.logoTitle}>Suraksha Signal</h1>
                </div>

                {error && <div className={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Organization/User Name</label>
                        <input
                            type="text"
                            className={styles.input}
                            placeholder="e.g., Red Cross"
                            value={formData.orgName}
                            onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Username</label>
                        <input
                            type="text"
                            className={styles.input}
                            placeholder="Pick a username"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Phone Number</label>
                        <input
                            type="tel"
                            className={styles.input}
                            placeholder="+91..."
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Password</label>
                        <input
                            type="password"
                            className={styles.input}
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>
                    <button type="submit" className={styles.loginButton} disabled={loading}>
                        {loading ? 'Creating Account...' : 'Register'}
                    </button>

                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', textAlign: 'center', marginTop: '1.5rem' }}>
                        Already have an account? <Link href="/ngo/login" style={{ color: '#10b981', fontWeight: 'bold' }}>Sign In</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
