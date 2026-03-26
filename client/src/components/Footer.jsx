import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 mt-12 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} MedShop. All rights reserved.
            </p>
            <p className="text-gray-400 text-xs mt-1">
              This is a read-only viewer for internal inventory availability.
            </p>
          </div>
          <div className="flex gap-4 text-sm text-gray-500">
            {/* <Link to="/admin" className="hover:text-primary transition-colors">Admin Portal</Link> */}
            <span className="hidden md:inline">&bull;</span>
            <Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
