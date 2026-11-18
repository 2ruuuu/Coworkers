export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  ARTICLES: '/articles',
  ADD_TEAM: '/addteam',
  JOIN_TEAM: '/jointeam',
  NO_TEAM: '/no-team',
  SETTINGS: '/settings',
  MY_HISTORY: '/my-history',
  team: (groupId: number | string) => `/${groupId}`,
  editTeam: (groupId: number | string) => `/${groupId}/editteam`,
  taskList: (groupId: number | string) => `/${groupId}/tasklist`,
  article: (articleId: string) => `/articles/${articleId}`,
  editArticle: (articleId: string) => `/articles/${articleId}/edit`,
} as const;

/** pathname이 href와 같거나 그 하위 경로인지 (세그먼트 단위로 비교해 /1 과 /12를 구분한다) */
export const isActivePath = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`);
