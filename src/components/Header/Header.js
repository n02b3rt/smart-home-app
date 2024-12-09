"use client";

import './Header.scss';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Header() {
    const [dateTime, setDateTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setDateTime(new Date()); // Aktualizuj czas co sekundę
        }, 1000);

        return () => clearInterval(interval); // Wyczyść interwał po odmontowaniu komponentu
    }, []);

    return (
        <header className='Header'>
            <div className='Header__logo'>
                <Link href="/">
                    <img
                        src={`/icons/home.svg`}
                        alt={`home icon`}
                        className="Header__icon"
                    />
                </Link>
            </div>
            <div className='Header__datetime'>
               <p>{dateTime.toLocaleTimeString()}</p>
                <p>{dateTime.toLocaleDateString()}</p>
            </div>
            <div className='Header__menu'>
                <Link href="/stock">
                    <img
                        src={`/icons/trending.svg`}
                        alt={`home icon`}
                        className="Header__icon"
                    />
                </Link>
                <Link href="/day-planner">
                    <img
                        src={`/icons/calendar.svg`}
                        alt={`home icon`}
                        className="Header__icon"
                    />
                </Link>
                <Link href="/todo">
                    <img
                        src={`/icons/check_circle.svg`}
                        alt={`home icon`}
                        className="Header__icon"
                    />
                </Link>
                <Link href="/university">
                <img
                        src={`/icons/school.svg`}
                        alt={`home icon`}
                        className="Header__icon"
                    />
                </Link>
            </div>
        </header>
    );
}
