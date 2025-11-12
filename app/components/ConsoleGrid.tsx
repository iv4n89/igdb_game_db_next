'use client';

import { Console } from "../types";
import ConsoleCard from "./ConsoleCard";

interface Props {
    consoles: Console[];
}

export default function ConsoleGrid({consoles}: Props) {
    return (
        <section className="container mx-auto px-4 pb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {
                    consoles.map((console) => (
                        <ConsoleCard key={console.id} console={console} />
                    ))
                }
            </div>
        </section>
    )
}
