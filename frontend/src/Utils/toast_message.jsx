import { toast } from "react-toastify";

export default function showToastMessage (type , message) {
    switch (type) {
        case 'success':
            toast.success(message, {autoClose: 1000});
            break;
        case 'error':
            toast.error(message, {autoClose: 1000});
            break;
        case 'warn':
            toast.warn(message, {autoClose: 1000});
            break;
        default:
            toast.info(message, {autoClose: 1000});
            break;
    }
}