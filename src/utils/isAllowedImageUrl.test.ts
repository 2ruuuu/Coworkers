import { describe, expect, it } from 'vitest';

import { isAllowedImageUrl } from './isAllowedImageUrl';

describe('isAllowedImageUrl', () => {
  it('허용된 호스트의 https 이미지만 허용한다', () => {
    expect(
      isAllowedImageUrl('https://sprint-fe-project.s3.ap-northeast-2.amazonaws.com/a.png'),
    ).toBe(true);
    expect(isAllowedImageUrl('https://abc.cloudfront.net/a.png')).toBe(true);
    expect(isAllowedImageUrl('https://evil.example.com/a.png')).toBe(false);
    expect(isAllowedImageUrl('http://abc.cloudfront.net/a.png')).toBe(false);
  });

  it('하위 도메인 와일드카드는 점(.) 경계를 지킨다', () => {
    expect(isAllowedImageUrl('https://evilcloudfront.net/a.png')).toBe(false);
  });

  it('blob/data/내부 경로는 허용하고 빈 값은 거절한다', () => {
    expect(isAllowedImageUrl('blob:http://localhost/1')).toBe(true);
    expect(isAllowedImageUrl('/profile.svg')).toBe(true);
    expect(isAllowedImageUrl(null)).toBe(false);
    expect(isAllowedImageUrl('not a url')).toBe(false);
  });
});
