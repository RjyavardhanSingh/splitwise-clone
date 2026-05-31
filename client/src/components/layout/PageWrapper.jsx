export default function PageWrapper({ children }) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {children}
    </div>
  );
}
