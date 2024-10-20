import React, { useEffect, useState } from 'react';
import '../../css/Footer.css';
import { fetchGitVersion } from '../../services/movieService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { GITHUB_URL_ISSUES } from '../../utils/configs';

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
                <p>For any issues, please report here : <a href={GITHUB_URL_ISSUES} target='_blank' rel="noreferrer">
                    <FontAwesomeIcon className='icon' icon={faGithub} />
                </a>
                </p>
            </div>
        </footer>
    );
};

export default Footer;
