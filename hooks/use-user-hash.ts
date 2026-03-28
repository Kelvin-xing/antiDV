'use client'
import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'xiaoAn_user_hash'

// UUID v4 格式驗證
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export const useUserHash = () => {
    const [currentHash, setCurrentHash] = useState<string | null>(null)

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY)
        setCurrentHash(stored)
    }, [])

    const generateHash = useCallback((): string => {
        const hash = crypto.randomUUID()
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
        generateHash,
        setHash,
        clearHash,
    }
}

export default useUserHash
