import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { fetchPosts, deletePost, updatePost } from "./api";
import { PostDetail } from "./PostDetail";
const maxPostPage = 10;

export function Posts() {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedPost, setSelectedPost] = useState(null);

  // replace with useQuery
  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["posts"], // 쿼리 키는 항상 배열!
    queryFn: fetchPosts, // 데이터를 가져오기 위한 함수
  });

  if (isLoading) {
    // isFetching
    // 비동기 쿼리가 아직 해결되지 않았다는 것을 말한다.
    // 아직 fetch가 완료되지 않았지만, Axios 호출이나 GraphQL 호출 같은
    // 다른 종류의 데이터를 가져오는 작업일 수 있다.
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
            onClick={() => setSelectedPost(post)}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button disabled onClick={() => {}}>
          Previous page
        </button>
        <span>Page {currentPage + 1}</span>
        <button disabled onClick={() => {}}>
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
}
