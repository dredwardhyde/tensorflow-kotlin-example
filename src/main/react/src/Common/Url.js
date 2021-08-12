const cp = getContextPath();

export const DETECT_OBJECTS = cp + "detectObjects";

export function getContextPath() {
    return (
        window.location.pathname.substring(0, window.location.pathname.lastIndexOf("/")) + "/"
    );
}
