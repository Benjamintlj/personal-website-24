import React from 'react'

interface CloseButtonProps {
    onClick: () => void
}

export const CloseButton: React.FC<CloseButtonProps> = ({
    onClick,
    className,
}) => {
    return (
        <button
            onClick={onClick}
            className={`absolute top-4 right-4 text-white bg-black bg-opacity-50 backdrop-blur-md rounded-full w-8 h-8 flex items-center justify-center ${className}`}
        >
            &times;
        </button>
    )
}
