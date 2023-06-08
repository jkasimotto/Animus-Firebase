import MenuButton from "../MenuButton/MenuButton";
import { Link } from "react-router-dom";

const NavButton = ({ to, text }) => (
  <MenuButton variant="contained" component={Link} to={to}>
    {text}
  </MenuButton>
);

export default NavButton;