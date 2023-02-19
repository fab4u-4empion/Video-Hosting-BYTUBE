import "./spinner.css"

export const Spinner = ({size = 20, color = "#000"}) => {
    return (
        <div style={{width: size, height: size, borderColor: color}}  className="spinner"></div>
    )
}