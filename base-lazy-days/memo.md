# useIsFetching

소규모 앱에서는 `useQuery` 반환 객체에서 `isFetching`을 이용했다.

> reminder!
> `isLoading은 isFetching과 동일하지만 캐시된 데이터가 없다!
so~ `isFetching`은 더 큰 카테고리이고 `isLoading`은 가져오는 작은 카테고리!

## In a larger app

- 더 큰 규모의 앱에서는 로딩 스피너를 표시하는 것이 효과적! (isFetching)
- 쿼리가 데이터를 가져오는 과정에 있는 경우, 중아 집중식 로딩 스피너가 앱 컴포넌트의 일부가 될 것!

## useIsFetching

- 현재 가쟈오기 상태인 쿼리 호출의 수를 나타내는 정수를 반환하는 훅
- 0이면 가져오기 상태가 아님, 0보다 크면 가져오기 중!

> 즉, 각 커스텀 훅에 대해 `isFetching`을 사용할 필요가 없다는 뜻!

# QueryCache default onError callback

- queryClient를 설정할 때 쿼리 캐시를 추가한 다음 `onError`를 이용하여 오류 콜백을 추가
- 오류 콜백은 useQuery에서 발생하는 오류에 관계없이 전달되며 콜백 본문 내에서 오류를 처리할 수 있음

```js
const queryClient = newQueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      // _handle the error_
    },
  }),
});
```
