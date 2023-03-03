export const useTimeString = duration => {
    const hours = Math.floor(duration / 3600)
    const minutes = Math.floor(duration / 60)
    const seconds = Math.floor(duration % 60)
    const components = []
    if (hours) {
        components.push(hours.toString())
        components.push(minutes.toString().padStart(2, '0'))
        components.push(seconds.toString().padStart(2, '0'))
    } else {
        components.push(minutes.toString())
        components.push(seconds.toString().padStart(2, '0'))
    }
    return components.join(":")
}