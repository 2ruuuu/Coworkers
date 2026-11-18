import ArticlePageShell from '../_components/ArticlePageShell';
import EditorClient from './_components/EditorClient';

const WriteArticlePage = () => {
  return (
    <ArticlePageShell narrow>
      <h1 className="mb-8 text-xl font-semibold md:text-2xl">게시글 쓰기</h1>
      <EditorClient mode="write" defaultValues={{ title: '', content: '', image: null }} />
    </ArticlePageShell>
  );
};

export default WriteArticlePage;
