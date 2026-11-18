/**
 * 백엔드가 허용하는 입력 길이.
 * 넘으면 400이 아니라 500(Internal Server Error)을 돌려주므로 클라이언트와 Server Action에서 먼저 막는다.
 */
export const TASK_NAME_MAX_LENGTH = 30;
export const TASK_DESCRIPTION_MAX_LENGTH = 255;
export const TASK_COMMENT_MAX_LENGTH = 255;
