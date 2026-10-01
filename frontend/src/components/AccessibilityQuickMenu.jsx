import { useState, useEffect } from 'react'

export function AccessibilityQuickMenu() {
    const [menuOpen, setMenuOpen] = useState(false)
    const [highContrast, setHighContrast] = useState(() => {
        const saved = localStorage.getItem('high-contrast')
        return saved === 'true'
    })

    
}