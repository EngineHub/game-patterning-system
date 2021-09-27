import React, {useState} from "react";
import {Navbar} from "react-bulma-components";
import logo from "../img/logo.png";
import {MinecraftVersionSelector} from "./MinecraftVersionSelector";

const AppNavbar: React.FC = () => {
    const [open, setOpen] = useState(false);
    return <Navbar role="navigation" aria-label="main navigation" active={open}>
        <Navbar.Brand>
            <Navbar.Item href="/">
                <img src={logo} alt="GPS"/>
            </Navbar.Item>
            <Navbar.Burger
                onClick={(): void => setOpen(x => !x)}
                aria-label="menu"
                aria-expanded={open}
            />
        </Navbar.Brand>
        <Navbar.Menu>
            <Navbar.Container align="left">
                <Navbar.Item renderAs="span" className="is-size-4 font-family-audiowide">
                    Game Patterning System
                </Navbar.Item>
            </Navbar.Container>
            <Navbar.Container align="right">
                <Navbar.Item renderAs="div">
                    <MinecraftVersionSelector/>
                </Navbar.Item>
            </Navbar.Container>
        </Navbar.Menu>
    </Navbar>;
};
export default AppNavbar;
