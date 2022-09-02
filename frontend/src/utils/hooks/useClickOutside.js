import { useState, useEffect, useCallback } from 'react';

export function useClickOutside(menuRef) {
    const [openMenu, setOpenMenu] = useState(false);

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
    const toggle = useCallback(() => {
        console.log(openMenu);
        setOpenMenu(!openMenu);
    }, [])
    return([openMenu, toggle]);
}