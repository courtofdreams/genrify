"use client";

import { useEffect } from 'react';
import { useSpotifyAPI } from '../useSpotifyAPI';
import styles from './Login.module.css';

export default function Login() {

    const { authentication } = useSpotifyAPI();

    const onClickLogin = () => {
        authentication();
    }

    useEffect(() => {
        localStorage.removeItem('code_verifier');
        localStorage.removeItem('spotify_tokens');
        localStorage.removeItem('spotify_code');
    }, []);

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                <div className={styles.main}>
                    <div className={styles.introWrap}>
                        <div className={styles.noise}></div>
                        <div className={`${styles.noise} ${styles.noiseMoving}`}></div>
                        <div className={styles.play} data-splitting>Genrify</div>
                        <div className={styles.time}>--:--</div>
                        <div className={styles.login}>
                            <button onClick={onClickLogin} className={styles.loginBtn}>Log in with Spotify</button>
                            <p className="mt-3">Please login to get access to  spotify content.</p>
                            <p>You will automatically be redirected to this page after login.</p>
                        </div>
                        <div className={styles.recordSpeed}>SLP 0:00:00</div>
                    </div>
                </div>
            </main>
        </div>
    );
}