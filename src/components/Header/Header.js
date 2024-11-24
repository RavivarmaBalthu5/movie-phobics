import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../css/Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import logo from '../../assets/moviephobics.png';

const Header = ({ toggleSearch, setSearchQuery }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const isHomePage = location.pathname === '/';
    const onTitleClick = () => {
        setSearchQuery('');
        navigate('/');
    };

    return (
        <header className="header">
            <div className="header-content" onClick={onTitleClick}>
                <img src={logo} alt="moviephobics logo" className="logo" />
                <h2>MOVIE PHOBICS</h2>
            </div>
            <div className="header-right">
                <FontAwesomeIcon
                    className="icon"
                    icon={faSearch}
                    size="2x"
                    onClick={isHomePage ? toggleSearch : null}
                    style={{ cursor: isHomePage ? 'pointer' : 'not-allowed', opacity: isHomePage ? 1 : 0.5 }}
                />
            </div>
        </header>
    );
};

export default Header;
