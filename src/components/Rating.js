import React from 'react';
import '../css/Rating.css';

const Rating = ({ rating }) => {
    const percentage = (rating / 10) * 100;

    const radius = 20;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    const getBarColor = () => {
        if (percentage === 0) return 'grey';
        if (percentage < 30) return 'red';
        if (percentage >= 30 && percentage <= 70) return 'yellow';
        if (percentage > 70) return 'green';
    };

    return (
        <div className="circular-rating-container">
            <svg
                className="circular-rating"
                width="120"
                height="120"
                viewBox="0 0 120 120"
            >
                <circle
                    className="circle-background"
                    cx="60"
                    cy="60"
                    r={10}
                    strokeWidth="35"
                    fill="#012031"
                />
                <circle
                    className="circle-progress"
                    cx="60"
                    cy="60"
                    r={radius}
                    strokeWidth="4"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    stroke={getBarColor()}
                    fill="none"
                />
            </svg>
            <div className="rating-text">
                {percentage.toFixed(0)}%
            </div>
        </div>
    );
};

export default Rating;
