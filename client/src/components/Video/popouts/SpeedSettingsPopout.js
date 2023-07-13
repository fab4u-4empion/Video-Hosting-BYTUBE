import {SettingsSectionPopout} from "../SettingsSectionPopout/SettingsSectionPopout";
import {VideoPopoutSelectableItem} from "../VideoPopout/popoutItem/VideoPopoutSelectableItem";
export const SpeedSettingsPopout = ({show, options, onBack, selectedOption, onSelectOption}) => {
    return (
        <SettingsSectionPopout
            show={show}
            title={"Скорость"}
            width={150}
            onBack={onBack}
        >
            {options.map(o =>
                <VideoPopoutSelectableItem
                    value={o.label}
                    selected={o.key === selectedOption.key}
                    onClick={() => onSelectOption(o)}
                    key={o.key}
                />
            )}
        </SettingsSectionPopout>
    )
}