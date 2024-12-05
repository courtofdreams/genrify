import axios from "axios";

export type GenreDiscoverRequest = {
    [k: string]: {
        listeningCount: number,
        genres: string[],
        popularity: number,
        follower: number
    }
}

export const useMoodyAPI = () => {
  const baseURL = "http://127.0.0.1:5000";

  const getGenreRecommendation = (request: GenreDiscoverRequest) => {
    const url = `${baseURL}/recommend-genre`
    return axios.post(url, request);
  };

  return {
    getGenreRecommendation
  };
};
