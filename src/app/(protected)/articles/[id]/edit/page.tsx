import { notFound } from 'next/navigation';

import { getArticleDetailServer } from '@/apis/article/server';
import { getMyProfileServer } from '@/apis/user/server';
import { handleServerApiError } from '@/lib/auth/session';
import { ApiError } from '@/lib/error';
import { stringIdSchema } from '@/schemas/common.schema';

import ArticlePageShell from '../../_components/ArticlePageShell';
import EditorClient from '../../write/_components/EditorClient';

interface EditArticlePageProps {
  params: Promise<{ id: string }>;
}

const EditArticlePage = async ({ params }: EditArticlePageProps) => {
  const parsedId = stringIdSchema.safeParse((await params).id);

  if (!parsedId.success) {
    notFound();
  }

  const [article, profile] = await Promise.all([
    getArticleDetailServer(parsedId.data),
    getMyProfileServer(),
  ]).catch((error: unknown) => {
    if (error instanceof ApiError && error.status === 404) notFound();
    return handleServerApiError(error);
  });

  // 작성자 본인만 수정할 수 있다.
  if (String(profile.id) !== String(article.writer.id)) {
    notFound();
  }

  return (
    <ArticlePageShell narrow>
      <h1 className="mb-8 text-xl font-semibold md:text-2xl">게시글 수정</h1>
      <EditorClient
        mode="edit"
        articleId={parsedId.data}
        defaultValues={{
          title: article.title,
          content: article.content,
          image: article.image ?? null,
        }}
      />
    </ArticlePageShell>
  );
};

export default EditArticlePage;
