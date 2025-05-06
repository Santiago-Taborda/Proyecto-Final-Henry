
const StarRating = ({ rating, onChange }: { rating: number, onChange: (rating: number) => void }) => {
    const stars = [1, 2, 3, 4, 5]; // Representa las estrellas del 1 al 5

    return (
        <div className="flex">
            {stars.map((star) => (
                <svg
                    key={star}
                    xmlns="http://www.w3.org/2000/svg"
                    className={`w-6 h-6 cursor-pointer ${star <= rating ? 'text-yellow-500' : 'text-gray-400'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    onClick={() => onChange(star)}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 17.27l4.09 2.18-1.1-4.78L20 9.24l-4.91-.42L12 2 8.91 8.82 4 9.24l3.01 5.43-1.1 4.78L12 17.27z"
                    />
                </svg>
            ))}
        </div>
    );
};

export default StarRating;
