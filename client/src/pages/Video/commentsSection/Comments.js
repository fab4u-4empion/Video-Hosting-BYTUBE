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

    const deleteCommentHandler = (id) => {
        setSnackbar(<Snackbar onClose={() => setSnackbar(null)}>Комментарий удален</Snackbar>)
        setComments(comments.filter(c => c['c_id'] !== id))
    }

    const editCommentHandler = (newComment) => {
        setComments(prev => {
            prev.splice(prev.findIndex(c => c['c_id'] === newComment['c_id']), 1, newComment)
            return [...prev]
        })
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
                    <div className={"video-page-comments-list"}>
                        {comments.map(comment =>
                            <Comment
                                comment={comment}
                                key={comment['c_id']}
                                onDelete={deleteCommentHandler}
                                onEdit={editCommentHandler}
                            />
                        )}
                    </div>
                </>
            }
        </div>
    )
}