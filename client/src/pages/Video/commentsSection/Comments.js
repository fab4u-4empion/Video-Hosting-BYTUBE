import {Spinner} from "../../../components/Spinner/Spinner";
import {pluralComments} from "../../../utils/pluralRules";
import {CommentForm} from "../../../components/Comments/CommentForm/CommentForm";
import {Comment} from "../../../components/Comments/Comment/Comment";
import {API} from "../../../api/api";
import {Snackbar} from "../../../components/Snackbar/Snackbar";
import {useEffect, useState} from "react";
import {useUserContextProvider} from "../../../context/userContext";

export const Comments = ({videoId}) => {
    const {user} = useUserContextProvider()
    const [fetching, setFetching] = useState(true)
    const [comments, setComments] = useState(null)
    const [commentText, setCommentText] = useState("")
    const [commentSending, setCommentSending] = useState(false)
    const [snackbar, setSnackbar] = useState(null)
    const sendComment = (cancelForm) => {
        setCommentSending(true)
        API.videos
            .request({
                method: "post",
                url: "/comments",
                data: {
                    text: commentText,
                    video: videoId
                },
                withCredentials: true
            })
            .then(response => {
                setComments(prev => [response.data, ...prev])
                setCommentSending(false)
                cancelForm()
            })
    }

    const deleteComment = (id, errorCallback) => {
        API.videos
            .request({
                method: "delete",
                url: "/comments",
                withCredentials: true,
                params: {
                    c_id: id
                }
            })
            .then(response => {
                setSnackbar(<Snackbar onClose={() => setSnackbar(null)}>Комментарий удален</Snackbar>)
                setComments(comments.filter(c => c['c_id'] !== id))
            })
            .catch(() => {
                setSnackbar(<Snackbar onClose={() => setSnackbar(null)}>Ошибка запроса</Snackbar>)
                errorCallback()
            })
    }

    const editComment = (id, text, callback) => {
        API.videos
            .request({
                method: "put",
                url: "/comments",
                withCredentials: true,
                data: {
                    c_id: id,
                    c_text: text
                }
            })
            .then(response => {
                setComments(prev => {
                    prev.splice(prev.findIndex(c => c['c_id'] === id), 1, response.data)
                    return [...prev]
                })
            })
            .catch(() => {
                setSnackbar(<Snackbar onClose={() => setSnackbar(null)}>Ошибка запроса</Snackbar>)
            })
            .finally(() => callback())
    }

    useEffect(() => {
        API.videos
            .request({
                method: "get",
                url: "/comments",
                params: {
                    v_id: videoId
                }
            })
            .then(response => {
                setFetching(false)
                setComments(response.data)
            })
    }, [])

    const commentTextChangeHandler = (newText) => {
        setCommentText(newText)
    }

    return (
        <div className="video-page-comments">
            {fetching && <div className="page-centred-content"><Spinner size={30} color="gray"/></div>}
            {snackbar}
            {!fetching &&
                <>
                    <div className="video-page-comments-header">{pluralComments(comments.length)}</div>
                    {user &&
                        <div className={"video-page-comment-form"}>
                            <CommentForm
                                onChange={commentTextChangeHandler}
                                defaultText={commentText}
                                action={sendComment}
                                actionTitle={"Оставить комментарий"}
                                actionDisabled={commentSending}
                            />
                        </div>
                    }
                    <div>
                        {comments.map(comment =>
                            <Comment
                                comment={comment}
                                key={comment['c_id']}
                                onDelete={deleteComment}
                                onEdit={editComment}
                            />
                        )}
                    </div>
                </>
            }
        </div>
    )
}