
const GenreLoading: React.FC = () => {
    return <div className="card h-48 w-48 mr-4 cursor-pointer">
        <div className="content">
            <div className="front bg-gray-800 text-white space-y-2.5 animate-pulse max-w-lg  pt-9">
                <div className="flex flex-col items-center justify-center w-full">
                    <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-1"></div>
                    <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-64 mb-1"></div>
                    <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-24"></div>

                </div>
            </div>
        </div>
    </div>;
}

export default GenreLoading;