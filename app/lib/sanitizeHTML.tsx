'use client'

import createDOMPurify from "dompurify"

const DOMPurify = typeof window !== 'undefined' ? createDOMPurify(window) : null

export function sanitize(dirty: string): string {
    return DOMPurify ? DOMPurify.sanitize(dirty) : dirty;
}