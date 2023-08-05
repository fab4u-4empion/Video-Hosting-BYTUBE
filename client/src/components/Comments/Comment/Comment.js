import {Avatar} from "../../Avatar/Avatar";
import "./comment.css"
import {API, baseURLs} from "../../../api/api";
import {useUserContextProvider} from "../../../context/userContext";
import {IconButton} from "../../IconButton/IconButton";
import {
    Icon24ChevronDown,
    Icon24DeleteOutlineAndroid,
    Icon24MoreVertical,
    Icon28EditOutline,
} from "@vkontakte/icons";
import {useCallback, useEffect, useRef, useState} from "react";
import {ActionSheet} from "../../ActionSheet/ActionSheet";
import {ActionSheetItem} from "../../ActionSheet/ActionSheetItem/ActionSheetItem";
import {ConfirmModal} from "../../ConfirmModal/ConfirmModal";
import {Spinner} from "../../Spinner/Spinner";
import {CommentForm} from "../CommentForm/CommentForm";
import {Button} from "../../Button/Button";
import {pluralAnswers, pluralComments} from "../../../utils/pluralRules";
import {Snackbar} from "../../Snackbar/Snackbar";

export const Comment = ({comment, onDelete, onEdit, isAnswer = false}) => {
    const {user} = useUserContextProvider()
    const [commentInfo, setCommentInfo] = useState(comment)
    const [popout, setPopout] = useState(null)
    const [modal, setModal] = useState(null)
    const [waitingAction, setWaitingAction] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [commentText, setCommentText] = useState(commentInfo['c_text'])
    const [answerMode, setAnswerMode] = useState(false)
    const [answersOpened, setAnswersOpened] = useState(false)
    const [waitingAnswer, setWaitingAnswer] = useState(false)
    const [answerText, setAnswerText] = useState("")
    const [currentAnswers, setCurrentAnswers] = useState([])
    const [answers, setAnswers] = useState([])
    const [snackbar, setSnackbar] = useState(null)
    const [fetchingAnswers, setFetchingAnswers] = useState(false)

    const actionsButtonRer = useRef(null)

    const deleteComment = () => {
        setWaitingAction(true)
        setModal(null)
        API.videos
            .request({
                method: "delete",
                url: "/comments",
                withCredentials: true,
                params: {
                    c_id: commentInfo['c_id']
                }
            })
            .then(() => {
                onDelete(commentInfo['c_id'])
            })
            .catch(() => {
                setSnackbar(<Snackbar onClose={() => setSnackbar(null)}>Ошибка запроса</Snackbar>)
                setWaitingAction(false)
            })
    }

    const deleteCommentHandler = (id) => {
        setSnackbar(<Snackbar onClose={() => setSnackbar(null)}>Комментарий удален</Snackbar>)
        setCurrentAnswers(currentAnswers.filter(c => c['c_id'] !== id))
        setAnswers(answers.filter(c => c['c_id'] !== id))
    }

    const editCommentHandler = (newComment) => {
        setCurrentAnswers(prev => {
            const index = prev.findIndex(c => c['c_id'] === newComment['c_id'])
            if (index > -1) {
                prev.splice(index, 1, newComment)
                return [...prev]
            }
            return prev
        })
        setAnswers(prev => {
            const index = prev.findIndex(c => c['c_id'] === newComment['c_id'])
            if (index > -1) {
                prev.splice(index, 1, newComment)
                return [...prev]
            }
            return prev
        })
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
        setPopout(null)
        setEditMode(true)
    }

    const answerComment = () => {
        setWaitingAnswer(true)
        API.videos
            .request({
                method: "post",
                url: "/comments",
                data: {
                    text: answerText,
                    video: commentInfo['c_video_id'],
                    parent: commentInfo['c_id']
                },
                withCredentials: true
            })
            .then(response => {
                setCurrentAnswers(prev => [...prev, response.data])
                setWaitingAnswer(false)
                setAnswerMode(false)
            })
            .catch(() => {
                setSnackbar(<Snackbar onClose={() => setSnackbar(null)}>Ошибка запроса</Snackbar>)
            })
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

    const editComment = () => {
        setWaitingAction(true)
        API.videos
            .request({
                method: "put",
                url: "/comments",
                withCredentials: true,
                data: {
                    c_id: comment['c_id'],
                    c_text: commentText
                }
            })
            .then(response => {
                setCommentInfo({
                    ...commentInfo,
                    c_is_edited: response.data['c_is_edited'],
                    c_text: response.data['c_text']
                })
                setEditMode(false)
            })
            .catch(() => {
                setSnackbar(<Snackbar onClose={() => setSnackbar(null)}>Ошибка запроса</Snackbar>)
            })
            .finally(() => {
                setWaitingAction(false)
            })
    }

    const onOpenAnswers = useCallback(() => {
        setAnswersOpened(prev => !prev)
        if (answers.length === 0 && !fetchingAnswers) {
            setFetchingAnswers(true)
            API.videos
                .request({
                    method: "get",
                    url: "/comments/answers",
                    params: {
                        c_id: comment['c_id'],
                        count: comment['c_answers_count']
                    }
                })
                .then(response => {
                    setFetchingAnswers(false)
                    setAnswers(response.data)
                })
        }
    }, [answers, answersOpened])

    return (
        <div
            key={commentInfo['c_id']}
            className="comment"
        >
            {editMode &&
                <CommentForm
                    onChange={commentTextChangeHandler}
                    defaultText={commentText}
                    action={editComment}
                    actionTitle={"Сохранить"}
                    actionDisabled={waitingAction}
                    onCancel={cancelEditing}
                    defaultActive={true}
                />
            }
            {!editMode &&
                <div className={"comment-content"}>
                    <Avatar size={40} src={`${baseURLs.user}/avatar?id=${commentInfo['c_user_id']}`}/>
                    <div>
                        <div className={"comment-main"}>
                            <div className="comment-info">
                                <div className="comment-user-name">{commentInfo['u_name']}</div>
                                <div className="comment-date">
                                    {commentInfo['c_date'] &&
                                        <>
                                            {new Date(Date.parse(commentInfo['c_date'])).toLocaleString("ru-RU", {day: "numeric", month: "short", year: "numeric"})}
                                            {commentInfo['c_is_edited'] !== 0 && " (изменено)"}
                                        </>
                                    }
                                    {!commentInfo['c_date'] && "сейчас"}
                                </div>
                                {user && user['u_id'] === commentInfo['c_user_id'] && !waitingAction &&
                                    <div className={`comment-actions-button`} ref={actionsButtonRer}>
                                        <IconButton onClick={openActions}><Icon24MoreVertical/></IconButton>
                                    </div>
                                }
                            </div>
                            <div className="comment-text">{commentInfo['c_text']}</div>
                            {!isAnswer &&
                                <div className={"comment-buttons"}>
                                    <Button
                                        size={"extra-small"}
                                        mode={"secondary"}
                                        onClick={() => setAnswerMode(true)}
                                        outline={false}
                                    >
                                        Ответить
                                    </Button>
                                </div>
                            }
                            {popout}
                        </div>
                        {answerMode &&
                            <div className={"comment-answer-form"}>
                                <CommentForm
                                    actionTitle={"Ответить"}
                                    onCancel={() => setAnswerMode(false)}
                                    onChange={(value) => setAnswerText(value)}
                                    action={answerComment}
                                    actionDisabled={waitingAnswer}
                                    defaultActive={true}
                                />
                                {waitingAnswer && <div className={"page-centred-content"}><Spinner size={20} color={"dimgray"}/></div>}
                            </div>
                        }
                    </div>
                </div>
            }
            {waitingAction && <div className={"page-centred-content"}><Spinner size={20} color={"dimgray"}/></div>}
            {(currentAnswers.length > 0 || commentInfo['c_answers_count'] > 0) &&
                <div className={"comment-answers"}>
                    {commentInfo['c_answers_count'] > 0 &&
                        <Button
                            size={"small"}
                            outline={false}
                            icon={
                                <div className={`comment-answers-arrow ${answersOpened ? "opened" : ""}`}><Icon24ChevronDown/></div>
                            }
                            fit={true}
                            onClick={onOpenAnswers}
                        >
                            {pluralAnswers(comment['c_answers_count'])}
                        </Button>
                    }
                    {(currentAnswers.length !== 0 || answersOpened) &&
                        <div className={"comment-answers-list"}>
                            {answersOpened && answers.length === 0 &&
                                <div className={"page-centred-content"}><Spinner size={20} color={"dimgray"}/></div>
                            }
                            {answersOpened && answers.length !== 0 &&
                                answers.map(c =>
                                    <Comment
                                        isAnswer={true}
                                        comment={c}
                                        onDelete={deleteCommentHandler}
                                        onEdit={editCommentHandler}
                                        key={c['c_id']}
                                    />
                                )
                            }
                            {currentAnswers.map(c =>
                                <Comment
                                    isAnswer={true}
                                    comment={c}
                                    onDelete={deleteCommentHandler}
                                    onEdit={editCommentHandler}
                                    key={c['c_id']}
                                />
                            )}
                        </div>
                    }
                </div>
            }
            {modal}
            {snackbar}
        </div>
    )
}