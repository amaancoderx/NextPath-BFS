"use client";

import Image from "next/image";

export default function BuyMeCoffeeImageButton() {
    return (
        <a
            href="https://www.buymeacoffee.com"
            target="_blank"
            rel="noopener noreferrer"
        >
            <Image
                src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
                alt="Buy Me A Coffee"
                width={120}
                height={34}
                className="h-8 w-auto"
                unoptimized
            />
        </a>
    );
}
