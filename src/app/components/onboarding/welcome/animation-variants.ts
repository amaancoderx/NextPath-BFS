// Animation variants
export const buttonVariants = {
    initial: { scale: 0.95, opacity: 0 },
    animate: {
        scale: 1,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 10,
        },
    },
    hover: {
        scale: 1.03,
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 10,
        },
    },
    tap: {
        scale: 0.97,
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 10,
        },
    },
};

export const contentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.3,
        },
    },
    exit: {
        opacity: 0,
        y: -10,
        transition: { duration: 0.2 },
    },
};
