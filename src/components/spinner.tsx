export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="size-8 animate-spin rounded-full border-3 border-emerald-500 border-t-transparent"></div>
    </div>
  );
}
