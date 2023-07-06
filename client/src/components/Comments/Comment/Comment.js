import {Avatar} from "../../Avatar/Avatar";
import "./comment.css"
import {API, baseURLs} from "../../../api/api";
import {useUserContextProvider} from "../../../context/userContext";
import {IconButton} from "../../IconButton/IconButton";
import {Icon24DeleteOutlineAndroid, Icon24MoreVertical, Icon28EditOutline} from "@vkontakte/icons";
import {useEffect, useRef, useState} from "react";
import {ActionSheet} from "../../ActionSheet/ActionSheet";
import {ActionSheetItem} from "../../ActionSheet/ActionSheetItem/ActionSheetItem";
import {ConfirmModal} from "../../ConfirmModal/ConfirmModal";
import {Spinner} from "../../Spinner/Spinner";
import {CommentForm} from "../CommentForm/CommentForm";

export const Comment = ({comment, onDelete, onEdit}) => {
    const {user} = useUserContextProvider()
    const [popout, setPopout] = useState(null)
    const [modal, setModal] = useState(null)
    const [waitingAction, setWaitingAction] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [commentText, setCommentText] = useState(comment['c_text'])

    const actionsButtonRer = useRef(null)

    const deleteComment = () => {
        setWaitingAction(true)
        setModal(null)
        onDelete(comment['c_id'], deleteErrorCallback)
    }

    const deleteErrorCallback = () => {
        setWaitingAction(false)
    }

    const editCallback = () => {
        setEditMode(false)
        setWaitingAction(false)
    }

    const onDeleteComment = () => {
        setModal(
            <ConfirmModal
                onClose={() => setModal(null)}
                actionMessage={"Удалить комментарий"}
                actionName={"Удалить"}
                onAction={deleteComment}
            />
        )
    }

    const onEditComment = () => {
        setEditMode(true)
    }

    const openActions = () => {
        setPopout(
            <ActionSheet
                onClose={() => setPopout(null)}
                targetRef={actionsButtonRer}
            >
                <ActionSheetItem
                    icon={<Icon28EditOutline width={24} height={24}/>}
                    action={onEditComment}
                >
                    Редактировать
                </ActionSheetItem>
                <ActionSheetItem
                    mode={"danger"}
                    icon={<Icon24DeleteOutlineAndroid/>}
                    action={onDeleteComment}
                >
                    Удалить
                </ActionSheetItem>
            </ActionSheet>
        )
    }

    const cancelEditing = () => {
        setEditMode(false)
        setCommentText(comment['c_text'])
    }

    const commentTextChangeHandler = (newText) => {
        setCommentText(newText)
    }

    const sendComment = () => {
        setWaitingAction(true)
        onEdit(comment['c_id'], commentText, editCallback)
    }

    return (
        <div
            key={comment['c_id']}
            className="comment"
        >
            {editMode &&
                <CommentForm
                    onChange={commentTextChangeHandler}
                    defaultText={commentText}
                    action={sendComment}
                    actionTitle={"Сохранить"}
                    actionDisabled={waitingAction}
                    onCancel={cancelEditing}
                    defaultActive={true}
                />
            }
            {!editMode &&
                <div className={"comment-content"}>
                    <Avatar size={40} src={`${baseURLs.user}/avatar?id=${comment['c_user_id']}`}/>
                    <div>
                        <div className="comment-info">
                            <div className="comment-user-name">{comment['u_name']}</div>
                            <div className="comment-date">
                                {comment['c_date'] &&
                                    <>
                                        {new Date(Date.parse(comment['c_date'])).toLocaleString("ru-RU", {day: "numeric", month: "short", year: "numeric"})}
                                        {comment['c_is_edited'] !== 0 && " (изменено)"}
                                    </>
                                }
                                {!comment['c_date'] && "сейчас"}
                            </div>
                            {user['u_id'] === comment['c_user_id'] && !waitingAction &&
                                <div className={`comment-actions-button`} ref={actionsButtonRer}>
                                    <IconButton onClick={openActions}><Icon24MoreVertical/></IconButton>
                                </div>
                            }
                        </div>
                        <div className="comment-text">{comment['c_text']}</div>
                    </div>
                </div>
            }
            {waitingAction && <div className={"page-centred-content"}><Spinner size={20} color={"dimgray"}/></div>}
            {popout}
            {modal}
        </div>
    )
}