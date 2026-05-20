/**
 * SECURITY FIX H-08: Safe pagination label component
 *
 * This component safely renders pagination labels that may contain
 * HTML entities (like &laquo; and &raquo;) without using dangerouslySetInnerHTML.
 *
 * Usage: Replace dangerouslySetInnerHTML={{ __html: link.label }} with:
 * <SafePaginationLabel label={link.label} />
 */
export default function SafePaginationLabel({ label }) {
    // Decode common HTML entities used in pagination
    const decodedLabel = decodeHtmlEntities(label);
    return <>{decodedLabel}</>;
}

/**
 * Safely decode HTML entities commonly found in pagination labels.
 * Only decodes specific, safe entities - does not parse arbitrary HTML.
 */
function decodeHtmlEntities(text) {
    if (!text) return '';

    // Map of safe HTML entities used in pagination
    const entityMap = {
        '&laquo;': '\u00AB',   // «
        '&raquo;': '\u00BB',   // »
        '&lt;': '<',
        '&gt;': '>',
        '&amp;': '&',
        '&nbsp;': '\u00A0',   // Non-breaking space
        '&#8230;': '\u2026',  // … ellipsis
        '&hellip;': '\u2026', // … ellipsis
    };

    let result = text;

    // Replace known safe entities
    for (const [entity, char] of Object.entries(entityMap)) {
        result = result.replace(new RegExp(entity, 'g'), char);
    }

    // Strip any remaining HTML tags as a safety measure
    result = result.replace(/<[^>]*>/g, '');

    return result;
}
