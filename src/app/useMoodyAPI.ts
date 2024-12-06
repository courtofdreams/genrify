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
  const baseURL = "https://en9samg3kv.us-east-2.awsapprunner.com";

  const getGenreRecommendation = (request: GenreDiscoverRequest) => {
    const url = `${baseURL}/recommend-genre`
    return axios.post(url, request);
  };

  return {
    getGenreRecommendation
  };
};
