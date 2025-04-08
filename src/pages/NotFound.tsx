
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-farmlink-light">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4 text-farmlink-secondary">404</h1>
        <p className="text-xl text-gray-600 mb-8">
          Oops! We couldn't find the page you were looking for.
        </p>
        <div className="w-16 h-1 bg-farmlink-primary mx-auto mb-8"></div>
        <p className="mb-8 text-gray-600">
          The page might have been moved, deleted, or never existed.
        </p>
        <Link to="/" className="btn-primary inline-flex items-center">
          <ArrowLeft size={18} className="mr-2" />
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
