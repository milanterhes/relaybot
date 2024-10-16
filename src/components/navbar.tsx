import React from "react";
import AuthDropdown from "./auth-dropdown";

const Navbar = () => {
  return (
    <nav className="bg-background border-b">
      <div className="container mx-auto sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold">Relaybot</span>
            </div>
          </div>
          <div className="flex items-center">
            <AuthDropdown />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
