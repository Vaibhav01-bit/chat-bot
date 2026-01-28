/**
 * Security Utilities for Input Sanitization
 * Prevents XSS attacks and path traversal vulnerabilities
 */

/**
 * Sanitize user input to prevent XSS attacks
 * Removes potentially dangerous HTML/script tags
 */
export const sanitizeInput = (input: string): string => {
    if (!input) return '';

    // Remove HTML tags
    const withoutTags = input.replace(/<[^>]*>/g, '');

    // Remove script tags and content
    const withoutScripts = withoutTags.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    // Escape special characters
    return withoutScripts
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
};

/**
 * Validate and sanitize filename
 * Prevents path traversal attacks
 */
export const sanitizeFilename = (filename: string): string => {
    if (!filename) return '';

    // Remove path separators and dangerous characters
    return filename
        .replace(/[\/\\]/g, '')
        .replace(/\.\./g, '')
        .replace(/[^a-zA-Z0-9._-]/g, '_')
        .substring(0, 255); // Limit filename length
};

/**
 * Validate file type
 */
export const isValidImageType = (fileType: string, allowedTypes: readonly string[]): boolean => {
    return allowedTypes.includes(fileType);
};

/**
 * Validate file size
 */
export const isValidFileSize = (fileSize: number, maxSizeMB: number): boolean => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return fileSize <= maxSizeBytes;
};

/**
 * File upload validation constants
 */
export const FILE_UPLOAD_LIMITS = {
    STATUS_IMAGE: {
        MAX_SIZE_MB: 10,
        ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'] as const
    },
    AVATAR_IMAGE: {
        MAX_SIZE_MB: 5,
        ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'] as const
    }
} as const;
