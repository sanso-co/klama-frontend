import { IconType } from "./type";

export const HomeIcon = ({
    width = 24,
    height = 24,
    stroke = 1.5,
    color = "#17191F",
}: IconType) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M19.6585 9.70119L12.6585 3.57619C12.2815 3.24629 11.7185 3.24629 11.3415 3.57619L4.3415 9.70119C4.12448 9.89108 4 10.1654 4 10.4538V19C4 19.5523 4.44772 20 5 20H9C9.55228 20 10 19.5523 10 19V15C10 14.4477 10.4477 14 11 14H13C13.5523 14 14 14.4477 14 15V19C14 19.5523 14.4477 20 15 20H19C19.5523 20 20 19.5523 20 19V10.4538C20 10.1654 19.8755 9.89108 19.6585 9.70119Z"
                stroke={color}
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};
