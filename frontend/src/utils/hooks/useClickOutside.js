import { useState, useEffect, useRef } from 'react';

export function useClickOutside() {
    const [openMenu, setOpenMenu] = useState({})
    const menuRef = useRef();

    useEffect(() => {
        let handler = (e) => {
            if (!menuRef.current.contains(e.target)) {
                setOpenMenu(false);
            }
        };
        document.addEventListener("click", handler);

        return () => {
            document.removeEventListener("click", handler);
        }
    })
}