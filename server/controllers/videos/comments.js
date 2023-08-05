import {dbPoolSync} from "../../config/config.js";
import {v4 as uuidv4} from "uuid";
import {mysqlEscape} from "../../utils/mysqlEscape.js";

export const getComments = async (req, res) => {
    const [comments] = await dbPoolSync.query(`SELECT comments.c_id, comments.c_video_id, comments.c_date, comments.c_text, comments.c_is_edited, users.u_name, comments.c_user_id, comments_answers_cache.cac_answers_count as c_answers_count FROM comments JOIN users ON comments.c_user_id=users.u_id LEFT JOIN comments_answers_cache ON cac_comment_id=c_id WHERE c_video_id="${req.query['v_id']}" AND c_comment_id is null ORDER BY c_date ASC`)
    res.json(comments)
}

export const getAnswers = async (req, res) => {
    const [comments] = await dbPoolSync.query(`SELECT comments.c_id, comments.c_video_id, comments.c_date, comments.c_text, comments.c_is_edited, users.u_name, comments.c_user_id FROM comments JOIN users ON comments.c_user_id=users.u_id WHERE c_comment_id="${req.query['c_id']}" ORDER BY c_date ASC LIMIT ${req.query['count']}`)
    res.json(comments)
}

export const saveComment = async (req, res) => {
    if (req['user']) {
        const newComment = {
            c_id: uuidv4(),
            c_text: req.body['text'],
            c_user_id: req.user['u_id'],
            c_video_id: req.body['video'],
            u_name: req.user['u_name'],
            c_date: null,
            c_comment_id: req.body["parent"]
        }
        if (newComment.c_comment_id)
            await dbPoolSync.query(`INSERT INTO comments (c_id, c_text, c_user_id, c_video_id, c_comment_id) values("${newComment.c_id}", "${mysqlEscape(newComment.c_text)}", "${newComment.c_user_id}", "${newComment.c_video_id}", "${newComment.c_comment_id}");`)
        else
            await dbPoolSync.query(`INSERT INTO comments (c_id, c_text, c_user_id, c_video_id) values("${newComment.c_id}", "${mysqlEscape(newComment.c_text)}", "${newComment.c_user_id}", "${newComment.c_video_id}");`)
        res.json(newComment)
    } else {
        res.status(401).json("Unauthorized")
    }
}

export const deleteComment = async (req, res) => {
    if (req['user']) {
        await dbPoolSync.query(`CALL delete_comment("${req.query['c_id']}")`)
        res.status(204).send()
    } else {
        res.status(401).json("Unauthorized")
    }
}

export const editComment = async (req, res) => {
    if (req['user']) {
        await dbPoolSync.query(`UPDATE comments SET c_text="${mysqlEscape(req.body['c_text'])}", c_is_edited=TRUE WHERE c_id="${req.body['c_id']}"`)
        const [result] = await dbPoolSync.query(`SELECT c_text, c_is_edited FROM comments WHERE comments.c_id="${req.body['c_id']}"`)
        res.json(result[0])
    } else {
        res.status(401).json("Unauthorized")
    }
}