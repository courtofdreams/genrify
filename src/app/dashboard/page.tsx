/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import { useEffect, useRef, useState } from "react";
import { useSpotifyAPI } from "../useSpotifyAPI";
import Artist, { ArtistType } from "./Artist";
import Song, { SongType } from "./Song";
import axios from "axios";
import GenreSuggestion, { GenreType } from "./GenreSuggestion";
import { GenreDiscoverRequest, useMoodyAPI } from "../useMoodyAPI";
import styles from '../Main.module.css';

const STORAGE_NAME = 'spotify_tokens';

type SpotifyTokens = {
    access_token: string,
    expires_in: number,
    token_type: string
}

type Me = {
    displayName: string,
    avatar: string
}

type CurrentTrackItem = {
    [k: string]: SongType;
}



export default function Dashboard() {

    const { getTopArtists, getRecentPlay, getTopTracks, fetchAccessToken, getSeveralArtist, getMe } = useSpotifyAPI();
    const { getGenreRecommendation } = useMoodyAPI();

    const [recommendGenres, setRecommendGenres] = useState<GenreType[]>([]);
    const [me, setMe] = useState<Me>();

    const [spotifyTokens, setSpotifyTokens] = useState<SpotifyTokens>();
    const [isUnauthorizeAccess, setUnauthorizeAccess] = useState<boolean>(false);
    const [topArtists, setTopArtists] = useState<ArtistType[]>([]);
    const [topTracks, setTopTracks] = useState<CurrentTrackItem>({});
    const [recentTrackItems, setRecentTrackItems] = useState<CurrentTrackItem>({});
    const [songCountByRecentPlay, setSongCountByRecentPlay] = useState<any>(undefined);
    const [songCountByTopTracks, setSongCountByTopTracks] = useState<any>(undefined);
    const refreshTokenInterval = useRef<NodeJS.Timeout>();

    const loadTokens = () => {
        const items = localStorage.getItem(STORAGE_NAME);
        if (items) {
            setSpotifyTokens(JSON.parse(items));
        } else {
            setUnauthorizeAccess(true);
        }
    }

    const updateTopTracks = () => {
        if (!spotifyTokens) return;

        getTopTracks(spotifyTokens.access_token, spotifyTokens.token_type)
            .then((response) => {
                const trackItems: CurrentTrackItem = {};
                const songCounts: any = {};

                response.data.items.forEach((track: any) => {
                    if (track.id && trackItems[track.id]) {
                        trackItems[track.id].listenCount = trackItems[track.id].listenCount++;
                    } else {
                        trackItems[track.id] = {
                            trackName: track.name,
                            artistNames: track.artists?.map((artist: any) => artist.name),
                            imageUrl: track.album.images[0]?.url,
                            listenCount: 1,
                            artists: track.artists,
                            id: track.id
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

                setSongCountByTopTracks(songCounts);
                setTopTracks(trackItems);
            })
            .catch(() => {
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

                setSongCountByRecentPlay(songCounts);
                setRecentTrackItems(trackItems);
            })
            .catch(() => {
                alert("Error, Something went wrong");
            })
    }

    const startFetchTokenInterval = () => {
        if (!refreshTokenInterval.current) {
            clearInterval(refreshTokenInterval.current);
        }

        const code = localStorage.getItem('spotify_code');
        if (code != null && spotifyTokens) {
            refreshTokenInterval.current = setInterval(() => {
                fetchAccessToken(code).then((response: axios.AxiosResponse<any, any>) => {
                    const spotifyToken = {
                        access_token: response.data.access_token,
                        expires_in: response.data.expires_in,
                        token_type: response.data.token_type
                    }
                    localStorage.setItem('spotify_tokens', JSON.stringify(spotifyToken));
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

    const getSpotifySeveralAudioFeatures = () => {
        if (!spotifyTokens) return;
        if (Object.keys(recentTrackItems).length <= 0) return;


        const idsTop = Object.keys(songCountByTopTracks);
        const idsRecent = Object.keys(songCountByRecentPlay);
        const ids = idsTop.concat(idsRecent)

        getSeveralArtist(spotifyTokens.access_token, spotifyTokens.token_type, ids)
            .then((response) => {
                fetchGenreRecommendation(response.data.artists);
            })
            .catch((e) => {
                console.log(e);
                alert("Error, Something went wrong");
            })
    }

    const fetchGenreRecommendation = (artists: any[]) => {
        let request = {} as GenreDiscoverRequest;
        artists.forEach((artist: any) => {
            request = {
                ...request,
                [artist.id]: {
                    listeningCount: songCountByTopTracks[artist.id] || 0 + songCountByRecentPlay[artist.id] || 0,
                    genres: artist.genres,
                    popularity: artist.popularity,
                    follower: artist.followers.total
                }
            }
        })

        topArtists.forEach((artist: ArtistType) => {
            if (!request[artist.id]) {
                request = {
                    ...request,
                    [artist.id]: {
                        listeningCount: songCountByTopTracks[artist.id] || 0 + songCountByRecentPlay[artist.id] || 0,
                        genres: artist.genres,
                        popularity: artist.popularity,
                        follower: artist.followers
                    }
                }
            }
        })

        getGenreRecommendation(request)
            .then((res) => {
                const recGenres: GenreType[] = [];
                res.data.genreRecommendation.forEach((genre: string) => {
                    recGenres.push({
                        name: genre,
                        textColor: "text-red-600",
                        bgColor: "bg-rose-700",
                        font: "",
                    })

                    setRecommendGenres(recGenres);
                });
            })
            .catch((err) => {
                console.log(err);
            })

    }

    useEffect(() => {
        if (spotifyTokens) {
            startFetchTokenInterval();
            getTopArtists(spotifyTokens?.access_token, spotifyTokens.token_type).then((response) => {
                const artists: ArtistType[] = []
                response.data.items.forEach((artist: any) => {
                    artists.push({
                        name: artist.name,
                        id: artist.id,
                        imageUrl: artist.images[0]?.url,
                        genres: artist.genres,
                        followers: artist.followers,
                        popularity: artist.popularity
                    })
                })
                setTopArtists(artists);
            });

            getMe(spotifyTokens?.access_token, spotifyTokens.token_type).then((response) => {
                if (response.data) {
                    setMe({
                        displayName: response.data.display_name,
                        avatar: response.data.images[0].url
                    })
                }
            });

            updateRecentPlay();
            updateTopTracks();
        }

        return () => {
            clearInterval(refreshTokenInterval.current);
            setRecommendGenres([]);
            setTopArtists([]);
            setTopTracks({});
            setRecentTrackItems({});
            setSongCountByRecentPlay(undefined);
            setSongCountByTopTracks(undefined);
        };

    }, [spotifyTokens]);

    useEffect(() => {
        if (songCountByTopTracks && songCountByRecentPlay) {
            getSpotifySeveralAudioFeatures();
        }

    }, [songCountByRecentPlay, songCountByTopTracks]);

    useEffect(() => {
        loadTokens();
    }, []);



    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-900">
            <div className="flex flex-row items-center w-full text-gray-100 mt-10 justify-end mr-10">
                <img className="w-10 h-10 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500" src={me?.avatar} alt="Bordered avatar" />
                <span className="ml-2 font-bold">{me?.displayName}</span>
            </div>
            <div className={styles.introWrap}>
                <div className={styles.noise}></div>
                <div className={`${styles.noise} ${styles.noiseMoving}`}></div>
                <div className={styles.play} data-splitting>Moody</div>
            </div>
            {!isUnauthorizeAccess ? <>
                <h2 className="text-gray-100 font-bold mt-10">Base on your recent plays, you should discover more on</h2>
                <div className="grid grid-cols-3 mt-10 mb-10">
                    {recommendGenres.map((genre: GenreType) => <GenreSuggestion key={genre.name} genre={genre}></GenreSuggestion>)}
                </div>
                <div className="grid grid-cols-3 mt-10 mb-10">
                    <div className="w-80 mr-4">
                        <h2 className="text-gray-100 font-bold">Recent Playlist</h2>
                        {Object.keys(recentTrackItems).map((id: string) => (
                            <Song key={id} song={recentTrackItems[id]}></Song>
                        ))}
                    </div>

                    <div className="w-80 mr-4">
                        <h2 className="text-gray-100 font-bold">Top Tracks (last 6 months)</h2>
                        {Object.keys(topTracks).map((id: string) => (
                            <Song key={id} song={topTracks[id]}></Song>
                        ))}
                    </div>

                    <div className="w-80 mr-4">
                        <h2 className="text-gray-100 font-bold">Top Artists (last 6 months)</h2>
                        {topArtists.map((artist: ArtistType) => {
                            return <Artist key={artist.id} artist={artist}></Artist>
                        })}
                    </div>
                </div>
            </> :
                <div className="flex flex-col items-center w-full text-gray-100 mt-3 justify-end mr-10">
                    Unauthorized Access!
                </div>
            }
        </div>
    )
}