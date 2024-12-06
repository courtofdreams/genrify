/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

"use client"

import { useEffect, useState } from 'react';
import styles from '../Main.module.css';
import { useSpotifyAPI } from '../useSpotifyAPI';
import axios from 'axios';
import Track, { TrackItem } from './Track';
import { GenreDiscoverRequest, useMoodyAPI } from '../useMoodyAPI';

type SpotifyTokens = {
    access_token: string,
    expires_in: number,
    token_type: string
}

type CurrentTrackItem = {
    [k: string]: TrackItem;
}

const STORAGE_NAME = 'spotify_tokens';

export default function Playlist() {

    const { fetchAccessToken, getRecentPlay, getSeveralArtist, searchItemByGenres } = useSpotifyAPI();
    const { getGenreRecommendation } = useMoodyAPI();
    const [isUnauthorizeAccess, setUnauthorizeAccess] = useState<boolean>(false);
    const [spotifyTokens, setSpotifyTokens] = useState<SpotifyTokens>();
    const [recentTrackItems, setCurrentTrackItems] = useState<CurrentTrackItem>({});
    const [songCountByArtist, setSongCountByArtist] = useState<any>({});
    const [recommendGenres, setRecommendGenres] = useState<string[]>([]);
    const [recommendTracksByGenre, setRecommendTracksByGenre] = useState<TrackItem[]>([]);


    const loadTokens = () => {
        const items = localStorage.getItem(STORAGE_NAME);
        if (items) {
            setSpotifyTokens(JSON.parse(items));
        }
    }


    const getSpotifySeveralAudioFeatures = () => {
        if (!spotifyTokens) return;
        if (Object.keys(recentTrackItems).length <= 0) return;


        const ids = Object.keys(songCountByArtist);

        getSeveralArtist(spotifyTokens.access_token, spotifyTokens.token_type, ids)
            .then((response) => {
                fetchGenreRecommendation(response.data.artists);
            })
            .catch((e) => {
                console.log(e);
                alert("Error, Something went wrong");
            })
    }

    const updateRecentPlay = () => {
        if (!spotifyTokens) return;

        getRecentPlay(spotifyTokens.access_token, spotifyTokens.token_type)
            .then((response) => {
                const trackItems: CurrentTrackItem = {};
                const songCounts: any = {};

                response.data.items.forEach((track: any) => {
                    if (track.track.id && trackItems[track.track.id]) {
                        trackItems[track.track.id].listenCount = trackItems[track.track.id].listenCount++;
                    } else {
                        trackItems[track.track.id] = {
                            trackName: track.track.name,
                            artistNames: track.track.artists?.map((artist: any) => artist.name),
                            imageUrl: track.track.album.images[0]?.url,
                            listenCount: 1,
                            artists: track.track.artists,
                            id: track.track.id
                        }
                    }
                });
                Object.keys(trackItems).forEach((id: string) => {
                    trackItems[id].artists.forEach((artist: any) => {
                        if (songCounts[artist.id]) {
                            songCounts[artist.id] = songCounts[artist.id] += trackItems[id].listenCount;
                        } else {
                            songCounts[artist.id] = trackItems[id].listenCount;
                        }
                    })

                });

                setSongCountByArtist(songCounts);
                setCurrentTrackItems(trackItems);
            })
            .catch(() => {
                alert("Error, Something went wrong");
            })
    }

    const fetchGenreRecommendation = (artists: any[]) => {
        let request = {} as GenreDiscoverRequest;
        artists.forEach((artist: any) => {
            request = {
                ...request,
                [artist.id]: {
                    listeningCount: songCountByArtist[artist.id],
                    genres: artist.genres,
                    popularity: artist.popularity,
                    follower: artist.followers.total
                }
            }
        })

        getGenreRecommendation(request)
            .then((res) => {
                fetchTrackRecommendation(res.data.genreRecommendation);
            })
            .catch((err) => {
                console.log(err);
            })

    }

    const fetchTrackRecommendation = (genres: string[]) => {
        if (!spotifyTokens) return;

        searchItemByGenres(spotifyTokens.access_token, spotifyTokens.token_type, genres)
            .then((response) => {
                const tracks: TrackItem[] = [];
                response.data.tracks.items.forEach((track: any) => {
                    tracks.push({
                        trackName: track.name,
                        artistNames: track.artists?.map((artist: any) => artist.name),
                        imageUrl: track.album.images[0]?.url,
                        listenCount: 0,
                        artists: track.artists,
                        id: track.id
                    });

                });
                setRecommendGenres(genres);
                setRecommendTracksByGenre(tracks);
            })
            .catch((err) => {
                console.log(err);
            })

    }

    const startFetchTokenInterval = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        if (code != null && spotifyTokens) {
            setInterval(() => {
                fetchAccessToken(code).then((response: axios.AxiosResponse<any, any>) => {
                    const spotifyToken = {
                        access_token: response.data.access_token,
                        expires_in: response.data.expires_in,
                        token_type: response.data.token_type
                    }
                    localStorage.setItem('spotify_tokens', JSON.stringify(spotifyToken));
                    // Note: Change this to actual website
                    window.location.href = '/dashboard'
                })
                    .catch((_err: any) => {
                        setUnauthorizeAccess(true);
                    })
                    .finally(() => {
                        // setFetching(false);
                    })
            }, spotifyTokens?.expires_in * 1_000);
        } else {
            setUnauthorizeAccess(true);
        }
    }

    useEffect(() => {
        getSpotifySeveralAudioFeatures();

    }, [recentTrackItems]);

    useEffect(() => {
        updateRecentPlay();

    }, [spotifyTokens]);

    useEffect(() => {
        loadTokens();
        // startFetchTokenInterval();

    }, []);




    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                <div className={styles.main}>
                    <div className={styles.introWrap}>
                        <div className={styles.noise}></div>
                        <div className={`${styles.noise} ${styles.noiseMoving}`}></div>
                        <div className={styles.play} data-splitting>Genrify</div>
                    </div>
                    {/* <button onClick={getGenreRecommendation}>Genre Recommendation</button> */}

                    {!isUnauthorizeAccess ?
                        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-2 font-[family-name:var(--font-geist-sans)]">
                            <div className="text-l font-extrabold text-gradient animate-glow">Base on your recent plays, you should discover more from genre: {recommendGenres.join(",")}</div>
                            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start mt-5">
                                <div className="grid grid-cols-3 gap-4 w-full max-w-3xl">
                                    {recommendTracksByGenre.map((item: TrackItem) =>
                                        <Track key={item.id} item={item}></Track>)
                                    }
                                </div>
                            </main>
                        </div> :
                        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-2 font-[family-name:var(--font-geist-sans)]">
                            <div className="text-l font-extrabold text-gradient animate-glow"> Unauthorized Access </div>
                        </div>
                    }
                </div>
            </main>
        </div>
    );
}