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
        setOpenMenu(!openMenu);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return([openMenu, toggle]);
}