'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import styles from './page.module.css';

// Dynamic import for Leaflet map (SSR fix)
const Map = dynamic(() => import('@/components/Map'), {
    ssr: false,
    loading: () => <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Map...</div>
});

const defaultCenter = [26.8467, 80.9462]; // Lucknow

export default function NGODashboard() {
    const [requests, setRequests] = useState([]);
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [points, setPoints] = useState(0);
    const [notification, setNotification] = useState(null);
    const [mapCenter, setMapCenter] = useState(defaultCenter);

    const router = useRouter();

    useEffect(() => {
        const isAuth = localStorage.getItem('ngo_auth');
        if (!isAuth) {
            router.push('/ngo/login');
        } else {
            fetchData();
            const interval = setInterval(fetchData, 10000); // Poll every 10s
            return () => clearInterval(interval);
        }
    }, []);

    const fetchData = async () => {
        try {
            const [reqRes, resRes] = await Promise.all([
                fetch('/api/requests'),
                fetch('/api/resources')
            ]);

            if (reqRes.ok) {
                const data = await reqRes.json();
                setRequests(data.filter(r => r.status !== 'Completed'));
            }
            if (resRes.ok) {
                const data = await resRes.json();
                setResources(data);
            }
        } catch (e) {
            console.error("Failed to fetch data", e);
        } finally {
            setLoading(false);
        }
    };

    const handleMatch = (req, isResource = false) => {
        if (isResource) return;
        setSelectedRequest(req);
        if (req.coords) {
            setMapCenter([req.coords.lat, req.coords.lng]);
        }
    };

    const confirmDelivery = async () => {
        try {
            await fetch('/api/requests/complete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: selectedRequest._id || selectedRequest.id })
            });

            setRequests(prev => prev.filter(r => (r._id || r.id) !== (selectedRequest._id || selectedRequest.id)));
            setPoints(prev => prev + 50);
            setNotification(`Help Sent to ${selectedRequest.name}! +50 Points`);
            setSelectedRequest(null);
            setTimeout(() => setNotification(null), 3000);
        } catch (e) {
            console.error("Failed to complete request", e);
        }
    };

    const startGoogleMeet = async () => {
        try {
            const res = await fetch('/api/meet', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    summary: `Assessment: ${selectedRequest.name}`,
                    description: `Emergency Need: ${selectedRequest.needs.join(', ')}`
                })
            });

            const data = await res.json();
            if (data.meetLink) {
                window.open(data.meetLink, '_blank');
            } else {
                window.open('https://meet.google.com/new', '_blank');
            }
        } catch (e) {
            console.error(e);
            window.open('https://meet.google.com/new', '_blank');
        }
    };

    return (
        <div className={styles.dashboard}>
            {/* Sidebar */}
            <div className={styles.sidebar}>
                <div className={styles.header}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h1 className={styles.title} style={{ color: 'white', margin: 0, fontSize: '1.5rem', fontWeight: '800' }}>Suraksha Signal</h1>
                        <button
                            onClick={() => {
                                localStorage.removeItem('ngo_auth');
                                router.push('/ngo/login');
                            }}
                            style={{ background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem', cursor: 'pointer' }}
                        >
                            Logout
                        </button>
                    </div>
                    <div className={styles.subtitle} style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: '600' }}>
                        {typeof window !== 'undefined' ? localStorage.getItem('ngo_name') : 'NGO Portal'}
                    </div>

                    <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid rgba(16, 185, 129, 0.2)', marginTop: '1rem' }}>
                        <p style={{ color: '#10b981', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '0.25rem' }}>Impact Score</p>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white', lineHeight: '1' }}>{points}</p>
                    </div>
                </div>

                <div className={styles.requestList}>
                    {loading ? <p>Loading data...</p> : requests.length === 0 ? <p style={{ color: '#64748b', textAlign: 'center', marginTop: '2rem' }}>All Clear. No active alerts.</p> : requests.map(req => (
                        <div
                            key={req._id || req.id}
                            className={styles.requestCard}
                            onClick={() => handleMatch(req)}
                        >
                            <div className={styles.cardHeader}>
                                <span style={{ fontWeight: 600, color: 'white' }}>{req.name}</span>
                                <span className={`${styles.priorityBadge} ${(req.urgency === 'High' || req.urgency === 'Critical') ? styles.priorityHigh :
                                    req.urgency === 'Medium' ? styles.priorityMedium : styles.priorityStandard
                                    }`}>
                                    {req.urgency}
                                </span>
                            </div>
                            <div className={styles.cardDetails}>
                                <p>Needs: {req.needs_translated || (req.needs && req.needs.length > 0 ? req.needs.join(', ') : 'General Aid')}</p>
                                <p>Loc: {req.location_translated || req.location}</p>
                                {req.aiReason && (
                                    <p style={{ fontSize: '0.75rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', marginTop: '0.5rem' }}>
                                        AI: {req.aiReason}
                                    </p>
                                )}
                                {req.reportCount > 1 && (
                                    <p style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 'bold', marginTop: '0.25rem' }}>
                                        ⚠️ Verified by {req.reportCount} reports
                                    </p>
                                )}
                                <p style={{ fontSize: '0.7em', marginTop: '0.5rem' }}>{new Date(req.timestamp).toLocaleTimeString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Map Area */}
            <div className={styles.mainContent}>
                {notification && (
                    <div className={styles.pointsPopup}>
                        {notification}
                    </div>
                )}

                <div className={styles.mapContainer}>
                    <Map
                        requests={requests}
                        resources={resources}
                        onMarkerClick={handleMatch}
                        center={mapCenter}
                    />
                </div>

                {selectedRequest && (
                    <div className={styles.modal}>
                        <h2 className={styles.title} style={{ marginBottom: '1rem', color: 'white', fontSize: '1.5rem' }}>Match Resource</h2>
                        <div style={{ margin: '1rem 0', padding: '1rem', background: '#334155', borderRadius: '0.5rem', border: '1px solid #475569' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase' }}>Beneficiary</span>
                                <span style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '0.8rem' }}>{selectedRequest.urgency.toUpperCase()} PRIORITY</span>
                            </div>
                            <p style={{ color: 'white', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '0.25rem' }}>{selectedRequest.name}</p>
                            <p style={{ color: '#cbd5e1' }}>Needs: {selectedRequest.needs.join(', ')}</p>
                            <p style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>📍 {selectedRequest.location}</p>
                        </div>

                        <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid rgba(16, 185, 129, 0.2)', marginBottom: '1rem' }}>
                            <p style={{ color: '#10b981', fontSize: '0.9rem', fontWeight: 'bold' }}>
                                ✓ Optimized Resource Matched
                            </p>
                            <p style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>Distance: 1.2 KM • ETA: 10 Mins</p>
                        </div>

                        <button className={styles.meetBtn} onClick={startGoogleMeet}>
                            <svg style={{ marginRight: '8px' }} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M23 7L16 12L23 17V7Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M14 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H14C15.1046 19 16 18.1046 16 17V7C16 5.89543 15.1046 5 14 5Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Video Assessment
                        </button>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <button className={styles.actionBtn} onClick={confirmDelivery} style={{ background: '#10b981' }}>
                                Confirm Dispatch
                            </button>
                            <button
                                className={styles.actionBtn}
                                style={{ background: 'transparent', border: '1px solid #94a3b8', color: '#94a3b8' }}
                                onClick={() => setSelectedRequest(null)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
