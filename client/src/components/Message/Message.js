import React from 'react'
import "./Message.css";
import moment from 'moment';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import DoneIcon from '@mui/icons-material/Done';
const Message = ({seen, time, message, classs }) => {
    

    return (
        <div>
            <div className={`messageBox ${classs}`}>
                {`${message}`} {seen?(<DoneAllIcon color="primary" fontSize="inherit"/>):(classs==="right"?(<DoneIcon fontSize="inherit"/>):"")}
                <div className="messageBottom">{moment(time).format('lll')}</div>
            </div>
            
        </div>


    )

}

export default Message
