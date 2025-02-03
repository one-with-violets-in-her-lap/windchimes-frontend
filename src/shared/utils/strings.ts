export function truncateText(text: string, maxLength: number) {
    const TRUNCATED_TEXT_INDICATOR = '...'
    if (text.length > maxLength) {
        return (
            text.slice(0, maxLength - TRUNCATED_TEXT_INDICATOR.length) +
            TRUNCATED_TEXT_INDICATOR
        )
    } else {
        return text
    }
}
