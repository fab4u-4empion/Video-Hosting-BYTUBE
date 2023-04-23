import {Button} from "../Button/Button";
import {useUserContextProvider} from "../../context/userContext";
import axios from "axios";

export const SubscribeButton = ({sub, chanel, onAction}) => {
    const {user} = useUserContextProvider()

    const subscribe = () => {
        axios
            .post(`https://localhost:3000/api/v1/user/subscribe?id=${chanel}`, {}, {withCredentials: true})
            .then(response => {
                onAction(response.data)
            })
            .catch(() => {
                alert("Не удалось выполнить запрос")
            })
    }

    const unsubscribe = () => {
        axios
            .post(`https://localhost:3000/api/v1/user/unsubscribe?id=${chanel}`, {}, {withCredentials: true})
            .then(response => {
                onAction(response.data)
            })
            .catch(() => {
                alert("Не удалось выполнить запрос")
            })
    }

    return (
        <>
            {user && user?.['u_id'] !== chanel &&
                <>
                    {sub ? <Button onClick={unsubscribe} mode="secondary">Отменить подписку</Button> : <Button onClick={subscribe}>Подписаться</Button>}
                </>
            }
        </>
    )
}