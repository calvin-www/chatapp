import { NextUIProvider } from '@nextui-org/react'
import React from "react";
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body>
        <NextUIProvider>
            {children}
        </NextUIProvider>
        </body>
        </html>
    )
}