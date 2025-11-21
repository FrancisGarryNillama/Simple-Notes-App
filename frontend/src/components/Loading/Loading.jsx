export default function Loading() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="flex flex-col items-center">
                <div className="w-10 h-10 border-4 border-t-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-xl font-semibold text-indigo-600">Loading TDWB - Notes...</p>
                <p className="text-sm text-gray-500 mt-1">Attempting to connect to Spring Boot API...</p>
            </div>
        </div>
    );
}
