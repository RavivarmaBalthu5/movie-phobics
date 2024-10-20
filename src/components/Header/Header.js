import React from 'react';
import '../../css/Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const Header = ({ toggleSearch, onTitleClick }) => {
    return (
        <header className="header">
            <div className="header-content" onClick={onTitleClick}>
                <h2>MOVIE PHOBICS</h2>
            </div>
            <div className="header-right">
                <FontAwesomeIcon className='icon' icon={faUser} size="2x" />
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
