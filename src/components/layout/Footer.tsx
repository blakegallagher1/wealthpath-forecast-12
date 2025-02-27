
const Footer = () => {
  return (
    <footer className="w-full bg-white border-t border-neutral-200 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-neutral-500">
            © {new Date().getFullYear()} WealthPath Retirement Calculator
          </p>
          <div className="text-sm text-neutral-500">
            <span>This calculator is for educational purposes only.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
