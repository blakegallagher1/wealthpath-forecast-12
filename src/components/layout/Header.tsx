
import { ThemeToggle } from "@/components/theme-toggle";

const Header = () => {
  return (
    <header className="bg-white border-b border-neutral-200">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="text-xl font-semibold">Personal Retirement Calculator</div>
          </div>
          
          <div className="flex items-center">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
