// components/FormButton.js
export default function FormButton({  isLoading, loadingText = 'Loading...', children }) {
  return (
    <button
      type="submit"
      className={`text-white bg-teal-600 py-1.5 px-4 rounded-lg font-bold w-full ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
      disabled={isLoading} // Also disables button in loading state
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <svg
            className="animate-spin h-5 w-5 mr-2 text-white"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
          {loadingText}
        </div>
      ) : (
        children
      )}
    </button>
  );
}