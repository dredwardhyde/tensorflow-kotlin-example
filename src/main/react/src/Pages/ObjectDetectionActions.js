import * as url from "../Common/Url";

export function detectObjects(data, onSuccess) {
    let isOk = false;
    return function (dispatch, getState) {
        const headers = new Headers()
        headers.append("type", "formData");
        const formData = new FormData()
        formData.append("file", data)
        fetch(url.DETECT_OBJECTS, {
            method: "post",
            headers,
            body: formData,
            credentials: "include",
        }).then((response) => {
            isOk = response.ok
            return response.text()
        }).then((text) => {
            if (isOk) {
                if (onSuccess) onSuccess(text)
            }
        }).catch((error) => {
            console.error(error)
        })
    }
}