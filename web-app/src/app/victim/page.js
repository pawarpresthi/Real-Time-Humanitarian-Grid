'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getTranslation } from '@/lib/translations';
import styles from './page.module.css';

function VictimForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const lang = searchParams.get('lang') || 'English';
    const t = getTranslation(lang);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        needs: [],
        location: '',
        description: '',
        coords: null
    });

    const [loading, setLoading] = useState(false);

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            setFormData(prev => ({ ...prev, needs: [...prev.needs, value] }));
        } else {
            setFormData(prev => ({ ...prev, needs: prev.needs.filter(n => n !== value) }));
        }
    };

    const handleLocation = () => {
        if (navigator.geolocation) {
            setLoading(true);
            navigator.geolocation.getCurrentPosition((position) => {
                setFormData(prev => ({
                    ...prev,
                    coords: {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    },
                    location: `Lat: ${position.coords.latitude.toFixed(4)}, Lng: ${position.coords.longitude.toFixed(4)}`
                }));
                setLoading(false);
            }, (error) => {
                console.error(error);
                alert('Could not fetch location. Please enter manually.');
                setLoading(false);
            });
        } else {
            alert('Geolocation is not supported by your browser.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, language: lang }),
            });

            if (response.ok) {
                // Redirect directly to NGO page as requested
                router.push('/ngo');
            } else {
                alert('Failed to submit request. Please try again.');
                setLoading(false);
            }
        } catch (error) {
            console.error(error);
            // Fallback
            router.push('/ngo');
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>{t.title}</h1>
                <p className={styles.subtitle}>{t.subtitle}</p>
                <p className={styles.subtitle} style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Selected Language: {lang}</p>
            </header>

            <div className={styles.formCard}>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>{t.nameLabel}</label>
                        <input
                            type="text"
                            className={styles.input}
                            placeholder={t.nameLabel}
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>{t.phoneLabel}</label>
                        <input
                            type="tel"
                            className={styles.input}
                            placeholder={t.phoneLabel}
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>{t.needLabel}</label>
                        <div className={styles.checkboxGroup}>
                            {['Food', 'Water', 'Medical', 'Shelter', 'Rescue'].map((need) => (
                                <label key={need} className={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        value={need}
                                        checked={formData.needs.includes(need)}
                                        onChange={handleCheckboxChange}
                                    />
                                    {need}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>{t.locationLabel}</label>
                        <div className={styles.locationBtn} onClick={handleLocation}>
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            {loading ? 'Fetching...' : t.locationBtn}
                        </div>
                        <input
                            type="text"
                            className={styles.input}
                            placeholder={t.manualLocation}
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            required={!formData.coords && !formData.location}
                        />
                    </div>

                    <button type="submit" className={styles.submitBtn} disabled={loading}>
                        {loading ? 'Submitting...' : t.submitBtn}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default function Page() {
    return (
        <Suspense fallback={<div style={{ color: 'white', textAlign: 'center', padding: '2rem' }}>Loading Form...</div>}>
            <VictimForm />
        </Suspense>
    );
}
