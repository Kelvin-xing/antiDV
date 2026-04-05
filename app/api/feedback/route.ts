import type { NextRequest } from 'next/server'

/**
 * Feedback API — Vercel-compatible.
 * Uses in-memory Map + /tmp fallback for persistence within a single instance.
 * Admin page polls GET for updates.
 */

export interface FeedbackEntry {
  id: string
  userHash: string
  conversationId: string
  conversationName: string
  chatList: any[]
  updatedAt: number
}

// In-memory store (survives across requests within the same serverless instance)
const store = new Map<string, FeedbackEntry>()

// Attempt /tmp persistence for cold-start recovery
const TMP_FILE = '/tmp/xiaoAn_feedback.json'

function loadFromTmp() {
  if (store.size > 0) return // already loaded
  try {
    const fs = require('fs')
    if (fs.existsSync(TMP_FILE)) {
      const entries: FeedbackEntry[] = JSON.parse(fs.readFileSync(TMP_FILE, 'utf-8'))
      entries.forEach(e => store.set(e.id, e))
    }
  } catch { /* /tmp read failed — start freshimport type { NextRequest } from 'next/server'

/**
 * Feedback API — Vercel-compatible.
 *y.
/**
 * Feedback API — Vercel-compatible.
 _FI *,  * Uses in-memory Map + /tmp fallback c * Admin page polls GET for updates.
 */

export interface FeedbackEntry {
  i u */

export interface FeedbackEntryue
e: N  id: string
  userHash: string b  userHash: r  conversationId: c  conversarHash, conversa  chatList: any[]
  updat c  updatedAt: num

    if (!conversationIdconst store = new Map<string, FeedbackEntry>()

// Attempt /tmp persistence for , 
// Attempt /tmp persistence for cold-start r${uconst TMP_FILE = '/tmp/xiaoAn_feedback.json'

funcnt
function loadFromTmp() {
  if (store.size      if (store.size > 0) r'a  try {
    const fs = require('fs')
    if (sa    come    if (fs.existsSync(TM??的      const entries: FeedbackEntrda      entries.forEac   }

    store.set(entryId, entry)
    saveToTmp()

    return Re    }
  } catch { /* /tmp read failed — sta)  
    
/**
 * Feedback API — Vercel-compatible.
 *y.
/**
 * Feedback API — Vercel-compatible.
s f * a *y.
/**
 * Feedback API — Vercel-cam/*
ex *rt _FI *,  * Uses in-memory Map + /tmp es */

export interface FeedbackEntry {
  i u */

export interface FeedbackEntryue
e  
econ  i u */

export interface Feedge
exporte')e: N  id: string
  userHash: stay  userHash: strue  updat c  updatedAt: num

    if (!conversationIdconst store = new Map<string, FeedbackEntry


    if (!conversationId({

// Attempt /tmp persistence for , 
// Attempt /tmp persistence for 
  // Attempt /tmp persistence for ceturn Response.json({ error: err.message }, { status: 500 })
  }
}
