
/**
 * 
 * Formats ISO date string to Indian Readable Date string.
 *  
 * @param isoDate
*/
export function formatDate(isoDate: string) {
    const segms = isoDate.split("-");
    return `${segms[2]}-${segms[1]}-${segms[0]}`;
}

/**
 * 
 * Formats hh:mm:ss to hh:mm.
 *  
 * @param time
*/
export function formatTime(time: string) {
    const segms = time.split(":");
    return `${segms[0]}:${segms[1]}`;
}
