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

export function capitalizeText(text: string) {
    if (text.length === 0) {
        return ''
    }

    const lowerCaseText = text.toLowerCase()
    return lowerCaseText[0].toUpperCase() + lowerCaseText.slice(1)
}
