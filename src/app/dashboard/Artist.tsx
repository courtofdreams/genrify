/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

export type ArtistType = {
    name: string;
    id: string;
    imageUrl?: string;
    followers: number;
    popularity: number;
    genres: string[];
}

type ArtistProps = {
    artist: ArtistType
}

const Artist: React.FC<ArtistProps> = ({ artist }) => {
    return <div className="mt-1 flex flex-col p-2 hover:shodow-lg rounded-2xl cursor-pointer transition ease-in duration-500  transform hover:scale-105">
        <div className="flex items-center justify-between">
            <div className="flex items-center mr-auto">
                <div className="inline-flex w-12 h-12">
                    <img src={artist.imageUrl} alt="aji" className=" relative p-1 w-12 h-12 object-cover rounded-2xl" />
                    <span className="absolute w-12 h-12 inline-flex border-2 rounded-2xl border-gray-600 opacity-75"></span>
                    <span></span>
                </div>

                <div className="flex flex-col ml-1 min-w-0">
                    <div className="font-medium leading-none text-gray-100">{artist.name}</div>
                    <p className="text-sm text-gray-500 leading-none mt-1 text-ellipsis">{artist.genres.join(",")}</p>
                </div>
            </div>
        </div>
    </div>;
}

export default Artist;