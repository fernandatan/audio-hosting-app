// HamburgerMenu.js
import React from 'react';
import { slide as Menu } from 'react-burger-menu';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import './hamburgerMenu.css';

const HamburgerMenu = ({ links }: any) => {
  return (
    <Menu 
      right 
      customBurgerIcon={<MenuIcon style={{ color: '#fff' }} />} 
      customCrossIcon={<CloseIcon style={{ color: '#fff' }} />} 
      pageWrapId={"page-wrap"} 
      outerContainerId={"outer-container"}
      styles={{
        bmMenuWrap: {
          width: '30%',
          background: '#333',
        },
        bmBurgerButton: {
          position: 'fixed',
          width: '36px',
          height: '36px',
          right: '36px',
          top: '36px',
        },
        bmBurgerBars: {
          background: '#fff',
        },
      }}
    >
      {links.map((link: any, index: any) => (
        <a key={index} id={link.id} className="menu-item" href={link.href}>
          {link.text}
        </a>
      ))}
    </Menu>
  );
};

export default HamburgerMenu;
