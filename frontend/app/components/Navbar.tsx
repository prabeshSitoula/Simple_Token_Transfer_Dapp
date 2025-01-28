export default function Navbar() {
  return (
    <nav className="bg-gray-100 p-4 shadow-md flex justify-between items-center">
      <div className="w-1" /> {/* Spacer */}
      <h1 className="text-2xl font-bold text-gray-800 ">SimpleToken DApp</h1>
      <img
        src="token.jpeg"
        alt="Token Transfer"
        className="h-16 w-16 object-contain"
      />
    </nav>
  );
}
