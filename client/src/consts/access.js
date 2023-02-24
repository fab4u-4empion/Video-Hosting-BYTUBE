import {Icon24LinkedOutline, Icon24LockOutline, Icon24Users3Outline} from "@vkontakte/icons";

const styles = {
    display: "flex",
    columnGap: 5,
    alignItems: "center",
    justifyContent: "center"
}

export const ACCESS_STATUSES = {
    close: <div style={styles}><Icon24LockOutline/><div>Закрытый доступ</div></div>,
    open: <div style={styles}><Icon24Users3Outline/><div>Общий доступ</div></div>,
    link: <div style={styles}><Icon24LinkedOutline/><div>Доступ оп ссылке</div></div>
}