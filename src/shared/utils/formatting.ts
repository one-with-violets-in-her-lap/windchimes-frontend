/**
 * converts seconds duration into a `MINUTES:SECONDS` string
 * @returns time string in `MINUTES:SECONDS` format
 */
export function getFormattedTimeFromSeconds(seconds: number) {
    const time = getMinutesDurationFromSeconds(seconds)

    const minutes = String(time.minutes).padStart(2, '0')
    const remainingSeconds = String(time.seconds).padStart(2, '0')

    return `${minutes}:${remainingSeconds}`
}

/**
 * converts seconds duration into `PT{MINUTES}M{SECONDS}S` string that
 * can be used as `datetime` attribute value
 * @returns string in `PT{MINUTES}M{SECONDS}S` format
 */
export function getDateTimeAttributeFromSeconds(seconds: number) {
    let dateTimeAttribute = 'PT'

    const { minutes, seconds: remainingSeconds } =
        getMinutesDurationFromSeconds(seconds)

    if (minutes > 0) {
        dateTimeAttribute += `${minutes}M`
    }

    if (remainingSeconds > 0) {
        dateTimeAttribute += `${remainingSeconds}S`
    }

    return dateTimeAttribute
}

export function getMinutesDurationFromSeconds(seconds: number) {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)

    return {
        minutes,
        seconds: remainingSeconds,
    }
}
