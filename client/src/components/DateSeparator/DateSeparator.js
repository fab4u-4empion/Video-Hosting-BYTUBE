export const DateSeparator = ({date, index, array, className}) => {
    const previewDate = index > 0 ? array[index - 1]['view_date'] : ""

    return (
        <>
            {date !== previewDate && <div className={className}>{new Date(Date.parse(date)).toLocaleString("ru-RU", {day: "numeric", month: "long", year: "numeric"})}</div>}
        </>
    )
}