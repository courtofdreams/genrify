export type GenreType = {
    name: string;
    textColor: string;
    bgColor: string;
    font: string;
}

type GenreProps = {
    genre: GenreType
}

const GenreSuggestion: React.FC<GenreProps> = ({ genre }) => {
    const openSpotify = () => {
        window.open(`https://open.spotify.com/search/${genre.name}`);
    }
    return <div className="card h-48 w-48 mr-4 cursor-pointer" onClick={openSpotify}>
        <div className={`content ${genre.font}`}>
            <div className={`front ${genre.textColor} bg-white`}>
                {genre.name}
            </div>
            <div className={`back ${genre.bgColor} text-white`}>
                {genre.name}
            </div>
        </div>
    </div>;
}

export default GenreSuggestion;

// font-press-start