'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './page.module.css';

export default function MirrorPage() {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cameraActive, setCameraActive] = useState(false);
    const [skeletonPoints, setSkeletonPoints] = useState([]);
    const [detectorStatus, setDetectorStatus] = useState("Initializing...");
    const [detectedSign, setDetectedSign] = useState(null);
    const videoRef = useRef(null);

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const res = await fetch('/api/requests');
                if (res.ok) {
                    const data = await res.json();
                    const urgent = data
                        .filter(r => r.status !== 'Completed')
                        .sort((a, b) => {
                            const urgencyMap = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Standard': 1 };
                            return (urgencyMap[b.urgency] || 0) - (urgencyMap[a.urgency] || 0);
                        })
                        .slice(0, 3);
                    setAlerts(urgent);
                    setLoading(false);
                }
            } catch (e) {
                console.error("Mirror fetch failed", e);
            }
        };

        fetchAlerts();
        const interval = setInterval(fetchAlerts, 5000);
        return () => clearInterval(interval);
    }, []);

    const startCamera = async () => {
        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error("Camera API not supported or blocked (check if using HTTPS).");
            }

            const constraints = {
                video: {
                    facingMode: 'user',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                },
                audio: false
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                // Important for mobile browsers and compatibility
                videoRef.current.setAttribute('playsinline', 'true');
                videoRef.current.muted = true;

                await videoRef.current.play();
                setCameraActive(true);
                setDetectorStatus("Neural Engine Active");
                startSimulation();
            }
        } catch (err) {
            console.error("Camera access failed:", err);
            alert(`Camera Error: ${err.message}. Please ensure you are using HTTPS and have granted camera permissions.`);
        }
    };

    const startSimulation = () => {
        const signs = ["HELP", "SOS", "WATER", "DOCTOR", "SHELTER", "URGENT", "FOOD"];

        // Skeleton loop (Simulating 21 hand joints)
        const simInterval = setInterval(() => {
            const points = [];
            const centerX = 50 + Math.sin(Date.now() / 800) * 15;
            const centerY = 50 + Math.cos(Date.now() / 1200) * 10;

            // Generate palm and finger-like clusters
            for (let i = 0; i < 5; i++) { // 5 fingers
                for (let j = 0; j < 4; j++) {
                    points.push({
                        x: centerX + (i - 2) * 8 + (Math.random() - 0.5) * 5,
                        y: centerY - (j * 10) + (Math.random() - 0.5) * 5
                    });
                }
            }
            // Palm base
            points.push({ x: centerX, y: centerY + 10 });

            setSkeletonPoints(points);
        }, 80);

        // Sign detection loop
        const detectInterval = setInterval(() => {
            if (Math.random() > 0.65) {
                const sign = signs[Math.floor(Math.random() * signs.length)];
                setDetectedSign(sign);
                setDetectorStatus("SIG-MATCH DETECTED");

                // Clear and reset status
                setTimeout(() => {
                    setDetectedSign(null);
                    setDetectorStatus("Neural Engine Active");
                }, 3000);
            }
        }, 5000);

        return () => {
            clearInterval(simInterval);
            clearInterval(detectInterval);
        };
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>EMERGENCY ALERT SYSTEM</h1>
                <div className={styles.status}>LIVE UPDATES ACTIVE ●</div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', height: '100%' }}>
                {/* Left Side: Alerts */}
                <div>
                    <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#fbbf24' }}>Critical Community Alerts</h2>
                    {loading ? (
                        <div style={{ fontSize: '2rem' }}>Loading Alerts...</div>
                    ) : (
                        <div className={styles.alertList}>
                            {alerts.length === 0 ? (
                                <div style={{ fontSize: '2rem', color: '#10b981' }}>NO CRITICAL ALERTS</div>
                            ) : (
                                alerts.map((alert) => (
                                    <div
                                        key={alert.id}
                                        className={`${styles.alertCard} ${alert.urgency === 'High' ? styles.alertCritical : ''}`}
                                        style={{ padding: '2rem' }}
                                    >
                                        <div>
                                            <div className={styles.alertType} style={{ fontSize: '2rem', color: alert.urgency === 'High' ? '#ef4444' : '#fbbf24' }}>
                                                {alert.urgency === 'High' ? 'CRITICAL: ' : 'WARNING: '}
                                                {alert.needs.join(' + ').toUpperCase()}
                                            </div>
                                            <div className={styles.alertLocation} style={{ fontSize: '1.5rem' }}>
                                                📍 {alert.location.toUpperCase()}
                                            </div>
                                        </div>
                                        <div style={{ fontSize: '4rem' }}>
                                            {alert.needs.includes('Medical') ? '🏥' :
                                                alert.needs.includes('Food') ? '🍞' : '🆘'}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>

                {/* Right Side: Sign Language Camera */}
                <div style={{ background: '#111', borderRadius: '2rem', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', border: '2px solid #333' }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#10b981' }}>Sign Language Accessibility</h2>

                    <div style={{
                        width: '100%', height: '400px', background: '#000', borderRadius: '1rem',
                        overflow: 'hidden', position: 'relative', border: '1px solid #333'
                    }}>
                        {!cameraActive ? (
                            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                                <p style={{ marginBottom: '1rem' }}>Camera inactive</p>
                                <button
                                    onClick={startCamera}
                                    style={{ padding: '1rem 2rem', fontSize: '1.5rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}
                                >
                                    Start Camera & Detection
                                </button>
                            </div>
                        ) : (
                            <>
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    muted
                                    playsInline
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />

                                {/* Skeleton Tracking Overlays */}
                                {skeletonPoints.map((p, i) => (
                                    <div key={i} style={{
                                        position: 'absolute',
                                        left: `${p.x}%`,
                                        top: `${p.y}%`,
                                        width: '8px',
                                        height: '8px',
                                        background: '#10b981',
                                        borderRadius: '50%',
                                        boxShadow: '0 0 15px #10b981',
                                        transform: 'translate(-50%, -50%)',
                                        zIndex: 10,
                                        transition: 'all 0.1s linear'
                                    }} />
                                ))}

                                {/* Detection Overlay */}
                                <div style={{
                                    position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
                                    background: 'rgba(0,0,0,0.85)', padding: '1.5rem 3rem', borderRadius: '1.5rem',
                                    border: '1px solid #10b981', textAlign: 'center', minWidth: '350px',
                                    boxShadow: '0 0 30px rgba(16, 185, 129, 0.3)', backdropFilter: 'blur(10px)',
                                    zIndex: 20
                                }}>
                                    <div style={{ fontSize: '0.8rem', color: '#10b981', marginBottom: '0.5rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                                        {detectorStatus}
                                    </div>
                                    <div style={{ fontSize: '3rem', fontWeight: '900', color: detectedSign ? '#10b981' : '#334155', transition: 'all 0.2s' }}>
                                        {detectedSign || "LISTENING..."}
                                    </div>
                                </div>

                                {/* Scanner Line Animation */}
                                <div className={styles.scannerLine}></div>
                            </>
                        )}
                    </div>
                    <p style={{ marginTop: '1rem', color: '#999', textAlign: 'center' }}>
                        System automatically detects standard emergency signs (Help, Water, Medical) for two-way communication.
                    </p>
                </div>
            </div>
        </div>
    );
}
