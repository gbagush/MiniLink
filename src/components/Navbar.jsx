'use client';

import React, { useState, useEffect } from 'react';

export default function NavBar() {
    const [scrolling, setScrolling] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
        if (window.scrollY > 0) {
            setScrolling(true);
        } else {
            setScrolling(false);
        }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
        window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const navbarClass = scrolling ? 'bg-white' : 'bg-gray-50';

    return (
        <nav className={`${navbarClass} fixed top-0 w-full z-10`}>
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <div className="container mx-auto px-12">
                    <a href="#" className="flex items-center">
                        <img src="/logo.png" className="h-14 mr-3" alt="Logo" />
                    </a>
                </div>
            </div>
        </nav>
    );
}