import {Avatar} from "../../Avatar/Avatar";
import "./comment.css"
import {baseURLs} from "../../../api/api";

export const Comment = ({comment}) => {
    return (
        <div key={comment['c_id']} className="comment">
            <Avatar size={40} src={`${baseURLs.user}/avatar?id=${comment['u_id']}`}/>
            <div>
                <div className="comment-info">
                    <div className="comment-user-name">{comment['u_name']}</div>
                    <div className="comment-date">
                        {comment['c_date'] ? new Date(Date.parse(comment['c_date'])).toLocaleString("ru-RU", {day: "numeric", month: "short", year: "numeric"}) : "сейчас"}
                    </div>
                </div>
                <div className="comment-text">{comment['c_text']}</div>
            </div>
        </div>
    )
}