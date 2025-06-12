import {
  Footer,
  FooterBrand,
  FooterCopyright,
  FooterDivider,
  FooterLinkGroup,
} from "flowbite-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import type { TRootState } from "../../store/store";

const SiteFooter = () => {
  const user = useSelector((state: TRootState) => state.userSlice.user);
  return (
    <Footer container>
      <div className="w-full text-center">
        <div className="w-full justify-between sm:flex sm:items-center sm:justify-between">
          <FooterBrand
            href="https://bizcard-project.onrender.com/"
            src="/BizCard-logo.svg"
            alt="BizCard Logo"
            name="BizCard"
          />
          <FooterLinkGroup className="flex gap-4">
            <Link className="hover:underline" to="/">
              Home
            </Link>
            <Link className="hover:underline" to="/about">
              About
            </Link>
            {user && (
              <Link className="hover:underline" to="/favorites">
                Favorites
              </Link>
            )}
            {(user?.isBusiness || user?.isAdmin) && (
              <Link className="hover:underline" to="/my-cards">
                My Cards
              </Link>
            )}
            {user && (
              <Link className="hover:underline" to="/profile">
                Profile
              </Link>
            )}
            {user?.isAdmin && (
              <Link className="hover:underline" to="/admin-dashboard">
                Admin Deshboard
              </Link>
            )}
          </FooterLinkGroup>
        </div>
        <FooterDivider />
        <FooterCopyright
          href="https://bizcard-project.onrender.com/"
          by="BizCard"
          year={2025}
        />
      </div>
    </Footer>
  );
};
export default SiteFooter;
