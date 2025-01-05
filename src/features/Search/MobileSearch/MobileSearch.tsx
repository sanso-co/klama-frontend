import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useScrollLock } from "@/hooks/useScrollLock";
import { useSearch } from "@/hooks/api/search/useSearch";

import { SearchCard } from "@/components/feature/SearchCard";
import { SearchIcon } from "@/assets/icons/SearchIcon";

import styles from "./mobilesearch.module.scss";

import { DefaultView } from "@/features/Search/DefaultView";

interface Props {
    open: boolean;
    handleClose: () => void;
    handleClick: (id: number) => void;
}

export const MobileSearch = ({ open, handleClose, handleClick }: Props) => {
    const navigate = useNavigate();

    const inputRef = useRef<HTMLInputElement>(null);
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [interactionBlocked, setInteractionBlocked] = useState(false);

    const { query, setQuery, suggestions } = useSearch();

    useScrollLock(open);

    useEffect(() => {
        if (open && inputRef.current) {
            inputRef.current.focus();
        }
    }, [open]);

    useEffect(() => {
        const disableTouchMove = (event: TouchEvent) => {
            if (isInputFocused || interactionBlocked) {
                event.preventDefault();
            }
        };

        window.addEventListener("touchmove", disableTouchMove, { passive: false });

        return () => {
            window.removeEventListener("touchmove", disableTouchMove);
        };
    }, [isInputFocused, interactionBlocked]);

    const handleTouch = (event: React.TouchEvent<HTMLDivElement>) => {
        if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
            inputRef.current.blur();
        }
    };

    const handleBlur = () => {
        setIsInputFocused(false);
        setInteractionBlocked(true);

        setTimeout(() => {
            setInteractionBlocked(false);
        }, 300);
    };

    return (
        <div
            className={styles.container}
            role="dialog"
            aria-modal
            onTouchStart={interactionBlocked ? (e) => e.preventDefault() : handleTouch}
        >
            <div className={styles.barContainer}>
                <div className={styles.bar}>
                    <SearchIcon width={21} height={21} stroke={2} />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search for drama..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setIsInputFocused(true)}
                        onBlur={handleBlur}
                    />
                    <button onClick={handleClose}>Cancel</button>
                </div>
            </div>
            {suggestions.length > 0 ? (
                <div className={styles.viewContainer}>
                    {suggestions.map((drama) => (
                        <SearchCard
                            show={drama}
                            key={drama.id}
                            handleClick={() => handleClick(drama.id)}
                        />
                    ))}
                </div>
            ) : (
                <DefaultView handleClick={handleClick} />
            )}
        </div>
    );
};
