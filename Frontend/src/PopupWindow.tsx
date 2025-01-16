import "./PopupWindow.css"
import React from "react";
interface PopupWindowProps {
    message: string;
}

const PopupWindow: React.FC <PopupWindowProps> = ({message}) => {
    return (
        <div className="popupWindow">
            {message}
        </div>
    );
};

export default PopupWindow;
