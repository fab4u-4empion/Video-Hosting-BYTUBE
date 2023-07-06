import "./commentForm.css"
import {useUserContextProvider} from "../../../context/userContext";
import {Avatar} from "../../Avatar/Avatar";
import {Button} from "../../Button/Button";
import {useEffect, useLayoutEffect, useRef, useState} from "react";

export const CommentForm = ({defaultText = "", onChange, actionTitle, action, actionDisabled, onCancel, defaultActive = false}) => {
    const {user} = useUserContextProvider()

    const inputRef = useRef(null)

    const [active, setActive] = useState(defaultActive)
    const [text, setText] = useState(defaultText)
    const [limitReached, setLimitReached] = useState(false)

    const commentTextChangeHandler = () => {
        setText(inputRef.current.value)
        setLimitReached(inputRef.current.value.length > 1000)
        inputRef.current.style.height = "auto";
        if (inputRef.current.scrollHeight > 40)
            inputRef.current.style.height = (inputRef.current.scrollHeight) + "px"
        else
            inputRef.current.style.height = "25px"
    }

    const commentCancel = () => {
        if (onCancel) {
            onCancel()
        } else {
            setText("")
            setActive(false)
            inputRef.current.style.height = "25px"
        }
    }

    const actionHandler = () => {
        action(commentCancel)
    }

    useEffect(() => {
        onChange(text)
    }, [text])

    useEffect(() => {
        commentTextChangeHandler()
    }, [])

    return (
        <div className="comment-form">
            <Avatar size={40} src={`https://localhost:3000/api/v1/user/avatar?id=${user['u_id']}`}/>
            <div>
                <textarea
                    rows={1}
                    value={text}
                    placeholder="Введите комментарий"
                    className="comment-form-input"
                    onChange={commentTextChangeHandler}
                    onClick={() => setActive(true)}
                    ref={inputRef}
                    disabled={actionDisabled}
                />
                {active &&
                    <div className="comment-form-active-bar">
                        <div className="comment-form-limit">{text.length} / 1000</div>
                        <div className="comment-form-buttons">
                            <Button onClick={commentCancel} disabled={actionDisabled} size="small" mode="secondary">Отмена</Button>
                            <Button onClick={actionHandler} disabled={text === "" || limitReached || actionDisabled} size="small">{actionTitle}</Button>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}