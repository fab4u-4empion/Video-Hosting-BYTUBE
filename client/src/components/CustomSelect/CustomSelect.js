import "./customSelect.css"
import {Icon24Cancel, Icon24ChevronDown, Icon24Done} from "@vkontakte/icons";
import {useEffect, useState} from "react";

export const CustomSelect = ({className, placeholder, options, onChange, cleanable = false}) => {
    const [opened, setOpened] = useState(false)
    const [focused, setFocused] = useState(false)
    const [value, setValue] = useState(null)

    const onSelectClick = (e) => {
        if (e.target.closest(".custom-select-container")) {
            setOpened(prev => !prev)
            setFocused(true)
            e.stopPropagation()
        } else {
            setFocused(false)
            setOpened(false)
        }
    }

    const onSelectOption = (option) => {
        onChange(option ? option.value : null)
        setValue(option)
    }

    const onClearValue = (e) => {
        onSelectOption(null)
        e.stopPropagation()
    }

    useEffect(() => {
        window.addEventListener("click", onSelectClick)
        return () => window.removeEventListener("click", onSelectClick)
    }, [])

    return (
        <div className={"custom-select-container"}>
            <div className={`custom-select-wrapper ${focused ? "focused" : ""} ${opened ? "opened" : ""}`}>
                <div className={`custom-select-content ${className ?? ""}`}>
                    {placeholder && !value && <div className={"custom-select-placeholder"}>{placeholder}</div>}
                    {value && <div className={"custom-select-value"}>{value.label}</div>}
                    <div className={"custom-select-buttons"}>
                        {value && cleanable && <div className={"custom-select-clear"} onClick={onClearValue}><Icon24Cancel/></div>}
                        <div className={`custom-select-arrow ${opened ? "opened" : ""}`}><Icon24ChevronDown/></div>
                    </div>
                </div>
            </div>
            {opened &&
                <div className={"custom-select-options"}>
                    {options.map(option =>
                        <div key={option.key} className={"custom-select-option"} onClick={() => onSelectOption(option)}>
                            <div>{option.label}</div>
                            {value?.key === option.key && <div className={"custom-select-selected-icon"}><Icon24Done/></div>}
                        </div>
                    )}
                </div>
            }
        </div>
    )
}