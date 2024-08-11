/**
 * converts seconds duration into a `MINUTES:SECONDS` string
 * @returns time string in `MINUTES:SECONDS` format
 */
export function getFormattedTimeFromSeconds(seconds: number) {
    const minutes = String(Math.floor(seconds / 60)).padStart(2, '0')

    const remainingSeconds = String(Math.floor(seconds % 60)).padStart(2, '0')

    return `${minutes}:${remainingSeconds}`
}
