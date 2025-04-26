import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../../css/Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUserCircle, faEnvelope, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import logo from '../../assets/moviephobics.png';

const Header = ({ toggleSearch, setSearchQuery }) => {
    const location = useLocation();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch {
                setUser(null);
            }
        } else {
            setUser(null);
        }
    }, [location]);


    const isHomePage = location.pathname === '/';
    const onTitleClick = () => {
        setSearchQuery('');
        window.location.href = "/"
    };

    const handleProfileClick = () => {
        setShowProfileMenu(!showProfileMenu);
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        window.location.href = "/"
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
                <FontAwesomeIcon
                    className="icon profile-icon"
                    icon={faUserCircle}
                    size="2x"
                    onClick={handleProfileClick}
                    style={{ cursor: 'pointer', marginLeft: '20px' }}
                />
                {showProfileMenu && user && (
                    <div className="profile-menu">
                        <div className="profile-item">
                            <FontAwesomeIcon icon={faEnvelope} className="profile-icon" />
                            <span>{user?.email}</span>
                        </div>
                        <div className="profile-item">
                            <FontAwesomeIcon icon={faUser} className="profile-icon" />
                            <span>{user?.name}</span>
                        </div>
                        <div className="profile-item logout" onClick={handleLogout}>
                            <FontAwesomeIcon icon={faSignOutAlt} className="profile-icon" />
                            <span>Logout</span>
                        </div>
                    </div>

                )}
            </div>
        </header>
    );
};

export default Header;
