

export function formatDate(isoDate: string) {
    const segms = isoDate.split("-");
    return `${segms[2]}-${segms[1]}-${segms[0]}`;
}

export function formatTime(time: string) {
    const segms = time.split(":");
    return `${segms[0]}:${segms[1]}`;
}
