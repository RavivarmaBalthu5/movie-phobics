import React, { useEffect, useState } from 'react';
import '../../css/Footer.css';
import { fetchGitVersion } from '../../services/movieService';

const Footer = () => {
    const [version, setVersion] = useState('1.0.0');
    useEffect(() => {
        const getVersion = async () => {
            try {
                setVersion(await fetchGitVersion());
            } catch (e) {
                console.error(e);
            }
        };

        getVersion();
    }, []);
    return (
        <footer className="footer">
            <div className="footer-details">
                <p>© 2024 Movie Phobics. All rights reserved. {version}</p>
            </div>
        </footer>
    );
};

export default Footer;
