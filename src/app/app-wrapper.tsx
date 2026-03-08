"use client";

import { Onborda, OnbordaProvider } from "onborda";
import { getOnboardingSteps } from "./utils/onboarding-steps";
import TourCard from "./components/onboarding/tour-card";
import { useEffect, useState } from "react";

export function AppWrapper({ children }: { children: React.ReactNode }) {
    const [hydrated, setHydrated] = useState(false);
    const steps = getOnboardingSteps();

    useEffect(() => {
        const timer = setTimeout(() => setHydrated(true), 100);
        return () => clearTimeout(timer);
    }, []);

    return hydrated ? (
        <>
            <OnbordaProvider>
                <Onborda
                    steps={steps}
                    shadowRgb="50, 50, 50"
                    shadowOpacity="0.6"
                    cardComponent={TourCard}
                >
                    {children}
                </Onborda>
            </OnbordaProvider>
        </>
    ) : null;
}
