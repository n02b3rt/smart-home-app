"use client";

import React from "react";
import { AuthProvider, useAuth } from "@/context/AuthContext";

export default function ToDoLayout({ children }) {
    return (
        <AuthProvider>
            <Content>{children}</Content>
        </AuthProvider>
    );
}

function Content({ children }) {
    const { isLoggedIn, error } = useAuth();

    return (
        <div className="ToDoLayout">
            {!isLoggedIn && (
                <div className="ToDoLayout__notification">
                    <p>Nie jesteś zalogowany. Zaloguj się, aby zobaczyć swoje zadania.</p>
                </div>
            )}
            {error && <p className="ToDoLayout__error">{error}</p>}
            {children}
        </div>
    );
}
