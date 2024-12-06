/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import { useEffect, useState } from "react";
import { useSpotifyAPI } from "../useSpotifyAPI";
import axios from "axios";

export default function Callback() {

    const { fetchAccessToken } = useSpotifyAPI();
    const [isFetching, setFetching] = useState<boolean>(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        if(code != null){
            setFetching(true);
            fetchAccessToken(code).then((response: axios.AxiosResponse<any, any>)=>{
                const spotifyToken = {
                    access_token:  response.data.access_token,
                    expires_in: response.data.expires_in,
                    token_type: response.data.token_type
                }
                localStorage.setItem('spotify_tokens', JSON.stringify(spotifyToken));
                localStorage.setItem('spotify_code', code);

                // Note: Change this to actual website
                window.location.href = 'http://localhost:3000/dashboard'
            })
            .catch((_err: any) =>{
                alert('Something went wrong, please try again')
            })
            .finally(()=>{
                setFetching(false);
            })
        }else {
            alert('Something went wrong, please try again')
        }
        
    }, []);

    return (
        <div className="bg-gray-900 grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                {isFetching ? 'Loading....': 'Nothing to show here!'}
            </main>
        </div>
    );
}