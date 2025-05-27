import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-6">Welcome to Your Study Dashboard</h1>
      <Link to="/auth" className="bg-blue-600 text-white px-4 py-2 rounded">
        Login / Signup
      </Link>
    </div>
  );
}
