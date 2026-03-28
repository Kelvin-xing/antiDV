'use client'
import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'xiaoAn_user_hash'

// UUID v4 格式驗證
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

// Safari < 15.4 does not support crypto.randomUUID(); fall back to Math.random()
function generateUUID(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function')
        return crypto.randomUUID()
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0
        const v = c === 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
    })
}

export const useUserHash = () => {
    const [currentHash, setCurrentHash] = useState<string | null>(null)
    const [initialized, setInitialized] = useState(false)

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) setCurrentHash(stored)
        setInitialized(true)
    }, [])

    const generateHash = useCallback((): string => {
        const hash = generateUUID()
        localStorage.setItem(STORAGE_KEY, hash)
        setCurrentHash(hash)
        return hash
    }, [])

    const setHash = useCallback((hash: string): boolean => {
        const trimmed = hash.trim()
        if (!UUID_REGEX.test(trimmed)) { return false }
        localStorage.setItem(STORAGE_KEY, trimmed)
        setCurrentHash(trimmed)
        return true
    }, [])

    const clearHash = useCallback(() => {
        localStorage.removeItem(STORAGE_KEY)
        setCurrentHash(null)
    }, [])

    return {
        currentHash,
        initialized,
        generateHash,
        setHash,
        clearHash,
    }
}

export default useUserHash
