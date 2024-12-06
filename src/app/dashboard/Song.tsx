/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

export type SongType = {
    imageUrl?: string;
    artistNames: string[];
    trackName: string;
    listenCount: number;
    artists: any;
    id: string;
}

type SongProps = {
    song: SongType
}

const Song: React.FC<SongProps> = ({ song }) => {
    return <div className="mt-2 flex flex-col p-4 bg-gray-800 border-gray-800 shadow-md hover:shodow-lg rounded-2xl cursor-pointer transition ease-in duration-500  transform hover:scale-105">
        <div className="flex items-center justify-between">
            <div className="flex items-center mr-auto">
                <div className="inline-flex w-12 h-12">
                    <img src={song.imageUrl || 'playlist.png'} alt="aji" className=" relative p-1 w-12 h-12 object-cover rounded-2xl" />
                    <span className="absolute w-12 h-12 inline-flex border-2 rounded-2xl border-gray-600 opacity-75"></span>
                    <span></span>
                </div>

                <div className="flex flex-col ml-3 min-w-0">
                    <div className="font-medium leading-none text-gray-100 w-56 overflow-hidden truncate">{song.trackName}</div>
                    <p className="text-sm text-gray-500 leading-none mt-1 truncate">{song.artistNames}</p>
                </div>
            </div>
        </div>
    </div>;
}

export default Song;