"use client";

import './Header.scss';
import React, {useEffect, useState} from 'react';
import HomeIcon from '/public/icons/home.svg';
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
            <div className='Header__menu'>
                <Link href="/">
                    <HomeIcon className="Header__icon"/>
                </Link>
                <Link href="/lamps">
                    Oświetlenie
                </Link>
                <Link href="/pomodoro">
                    Pomodoro
                </Link>
                <Link href="/university">
                    Temperatura
                </Link>
                <Link href="/todo">
                    To Do
                </Link>
                <Link href="/university">
                    Universytet
                </Link>
            </div>

            <div className='Header__datetime'>
                <p><strong>{dateTime.toLocaleTimeString().slice(0, 5)}</strong></p>
            </div>

        </header>
    );
}
