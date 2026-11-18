import Image from 'next/image';

import { isAllowedImageUrl } from '@/utils/isAllowedImageUrl';

interface ArticleContentProps {
  content: string;
  image?: string | null;
}

const ArticleContent = ({ content, image }: ArticleContentProps) => {
  return (
    <div className="text-text-primary text-md leading-7 whitespace-pre-wrap md:text-lg">
      {content}
      {isAllowedImageUrl(image) && (
        <div className="mt-4 flex justify-start">
          <Image
            src={image}
            alt="게시글 첨부 이미지"
            className="h-auto max-h-[400px] w-auto object-contain"
            width={500}
            height={500}
          />
        </div>
      )}
    </div>
  );
};

export default ArticleContent;
