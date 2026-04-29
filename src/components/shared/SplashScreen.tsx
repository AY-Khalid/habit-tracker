export default function SplashScreen() {
  return (
    <div
      data-testid="splash-screen"
      className="flex flex-col items-center justify-center min-h-screen bg-indigo-700"
    >
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-2">
          Habit Tracker
        </h1>
        <p className="text-indigo-200 text-lg">
          Build better habits, one day at a time
        </p>
        {/* Loading spinner */}
        <div className="mt-8 flex justify-center">
          <div className="w-8 h-8 border-4 border-white border-t-transparent 
                          rounded-full animate-spin" />
        </div>
      </div>
    </div>
  );
}