import axios from "axios";

export const useSpotifyAPI = () => {
  const clientId = "5ef5f6c6680c4ce2981f3a925d85920d";
  let redirectUri = "http://localhost:3000/callback";
  if(process.env.NODE_ENV === 'production'){
    redirectUri = "https://genrify-music.vercel.app/callback";
  }

  const generateRandomString = (length: number) => {
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
  };

  const sha256 = async (plain: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return window.crypto.subtle.digest("SHA-256", data);
  };

  const base64encode = (input: ArrayBuffer) => {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  };

  const authentication = async () => {
    const codeVerifier = generateRandomString(64);
    const hashed = await sha256(codeVerifier);
    window.localStorage.setItem("code_verifier", codeVerifier);
    const codeChallenge = base64encode(hashed);

    const scope =
      "user-read-private user-read-email user-read-playback-position user-top-read user-read-recently-played user-read-currently-playing user-library-read";
    const authUrl = new URL("https://accounts.spotify.com/authorize");

    // generated in the previous step
    window.localStorage.setItem("code_verifier", codeVerifier);

    const params = {
      response_type: "code",
      client_id: clientId,
      scope,
      code_challenge_method: "S256",
      code_challenge: codeChallenge,
      redirect_uri: redirectUri,
    };

    authUrl.search = new URLSearchParams(params).toString();
    window.location.href = authUrl.toString();
  };

  const fetchAccessToken = async (code: string) => {
    const codeVerifier = localStorage.getItem("code_verifier") || "";
    const params = {
      client_id: clientId,
      grant_type: "authorization_code",
      code: code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    };

    const authOptions = {
      url: "https://accounts.spotify.com/api/token",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(params),
    };

    return axios.post(authOptions.url, authOptions.body, {
      headers: authOptions.headers,
    });
  };

  const getRecentPlay = (spotifyAccessToken: string, tokenType: string) => {
    const url = "https://api.spotify.com/v1/me/player/recently-played";


    return axios.get(url, {
      headers: {
        Authorization: `${tokenType} ${spotifyAccessToken}`,
      },
    });
  };

  const getMe = (spotifyAccessToken: string, tokenType: string) => {
    const url = "https://api.spotify.com/v1/me";


    return axios.get(url, {
      headers: {
        Authorization: `${tokenType} ${spotifyAccessToken}`,
      },
    });
  };


  const getSeveralAudioFeatures = (spotifyAccessToken: string, tokenType: string, ids: string[]) => {
    const url = `https://api.spotify.com/v1/audio-features?ids=${ids.join(",")}`;


    return axios.get(url, {
      headers: {
        Authorization: `${tokenType} ${spotifyAccessToken}`,
      },
    });
  };

  const getSeveralArtist = (spotifyAccessToken: string, tokenType: string, ids: string[]) => {
    const url = `https://api.spotify.com/v1/artists?ids=${ids.join(",")}`;


    return axios.get(url, {
      headers: {
        Authorization: `${tokenType} ${spotifyAccessToken}`,
      },
    });
  };

  const getTopArtists = (spotifyAccessToken: string, tokenType: string) => {
    const url = "https://api.spotify.com/v1/me/top/artists";


    return axios.get(url, {
      headers: {
        Authorization: `${tokenType} ${spotifyAccessToken}`,
      },
    });
  };

  const getTopTracks = (spotifyAccessToken: string, tokenType: string) => {
    const url = "https://api.spotify.com/v1/me/top/tracks";


    return axios.get(url, {
      headers: {
        Authorization: `${tokenType} ${spotifyAccessToken}`,
      },
    });
  };

  const searchItemByGenres = (spotifyAccessToken: string, tokenType: string, genre: string[]) => {
    const url = `https://api.spotify.com/v1/search?q=genre:${encodeURIComponent(genre.join(","))}&type=track`;


    return axios.get(url, {
      headers: {
        Authorization: `${tokenType} ${spotifyAccessToken}`,
      },
    });
  };

  return {
    authentication,
    fetchAccessToken,
    getRecentPlay,
    getSeveralAudioFeatures,
    getSeveralArtist,
    searchItemByGenres,
    getTopArtists,
    getTopTracks,
    getMe
  };
};
