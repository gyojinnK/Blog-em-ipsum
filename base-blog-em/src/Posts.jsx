import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// useQueryClient: 상위 컴포넌트에서 제공되는 QueryClient를 가져와 사용할 수 있는 hook

import { fetchPosts, deletePost, updatePost } from "./api";
import { PostDetail } from "./PostDetail";
const maxPostPage = 10;

export function Posts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    // mutationFn은 queryFn과 다르게 인자를 넘길 수 있음
    mutationFn: (postId) => deletePost(postId),
  });
  // deleteMutation.mutate

  const updateMutation = useMutation({
    mutationFn: (postId) => updatePost(postId),
  });
  // updateMutation.mutate

  useEffect(() => {
    if (currentPage < maxPostPage) {
      const nextPage = currentPage + 1;
      queryClient.prefetchQuery({
        queryKey: ["posts", nextPage],
        queryFn: () => fetchPosts(nextPage),
      });
    }
  }, [currentPage, queryClient]);

  // replace with useQuery
  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["posts", currentPage], // 쿼리 키는 항상 배열!
    queryFn: () => fetchPosts(currentPage), // 데이터를 가져오기 위한 함수
    staleTime: 2000, // 2s
  });

  if (isLoading) {
    // isFetching
    // 비동기 쿼리가 아직 해결되지 않았다는 것을 말한다.
    // 아직 fetch가 완료되지 않았지만, Axios 호출이나 GraphQL 호출 같은 다른 종류의 데이터를 가져오는 작업일 수 있다.
    // isFetching은 캐시된 데이터에 상관없이 쿼리 함수가 실행 중이라면 true를 반환한다.
    // isLoading은 isFetching의 하위 집합!
    return <h3>Loading...</h3>;
  }
  if (isError) {
    // react-query는 기본적으로 3번 시도 후
    // error라고 판단
    return (
      <>
        <h3>Oops, Error...</h3>
        <p>{error.toString()}</p>
      </>
    );
  }

  return (
    <>
      <ul>
        {data.map((post) => (
          <li
            key={post.id}
            className="post-title"
            onClick={() => {
              deleteMutation.reset();
              updateMutation.reset();
              setSelectedPost(post);
            }}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button
          disabled={currentPage <= 1}
          onClick={() => {
            setCurrentPage((prev) => prev - 1);
          }}
        >
          Previous page
        </button>
        <span>Page {currentPage}</span>
        <button
          disabled={currentPage >= maxPostPage}
          onClick={() => {
            setCurrentPage((prev) => prev + 1);
          }}
        >
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && (
        <PostDetail
          post={selectedPost}
          deleteMutation={deleteMutation}
          updateMutation={updateMutation}
        />
      )}
    </>
  );
}
