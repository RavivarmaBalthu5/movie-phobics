import React from 'react';
import '../../css/Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import logo from '../../assets/moviephobics.png';

const Header = ({ toggleSearch, onTitleClick }) => {
    return (
        <header className="header">
            <div className="header-content" onClick={onTitleClick}>
                <img src={logo} alt="moviephobics logo" className='logo' />
                <h2>MOVIE PHOBICS</h2>
            </div>
            <div className="header-right">
                <FontAwesomeIcon
                    className='icon'
                    icon={faSearch}
                    size="2x"
                    onClick={toggleSearch}
                />
            </div>
        </header>
    );
};

export default Header;
