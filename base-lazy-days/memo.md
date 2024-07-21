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

# Summary

- query-client 파일을 따로 분리하기 (코드 분리)
  - 확장성을 위해서 앱 컴포넌트가 아닌 자체 파일로 관리하는 것이 이득
- Custom hook을 만들어 모듈화
  - 데이터가 두 개 이상의 컴포넌트에 사용되는 경우를 대비하여 코드를 모듈식으로 유지할 수 있음 (next.js의 action파일과 유사한 개념)
- `loading` 컴포넌트의 중앙 집중화
  - `useIsFetching`: 현재 불러오는 퀴리 수를 반환하는 hook
- error handling의 중앙 집중화
  - `onError` 콜백을 사용하여 에러 발생 시 토스트 UI 제공
    - `onError` 콜백은 새 쿼리 캐시를 생성하고 거기에 `onError` 콜백을 정의하여 queryClient 옵션에 정의

---

# Options for pre-populating data

|        /        |     where to use     | data from | added to cache |
| :-------------: | :------------------: | :-------: | :------------: |
|  prefetchQuery  | `queryClient` method |  server   |       O        |
|  setQueryData   | `queryClient` method |  client   |       O        |
| placeholderData |  `useQuery` option   |  client   |       X        |
|   initialData   |  `useQuery` option   |  client   |       O        |

# Deep dive to Prefetching

- prefetch next page
  - 사용자가 현재 페이지를 보고 있는 동안 다음 페이지를 미리 가져옴
  - 사용자가 다음 페이지 버튼을 클릭할 때까지 기다릴 필요가 없도록 함

## PrefetchQuery

- `PrefetchQuery`는 일회성
- fetch Custom hook에서 함께 작성
  - 같은 쿼리 함수와 쿼리 키를 사용하기 때문!
- Home 컴포넌트에서 만들어둔 Prefetch hook을 호출하는 것이 핵심
  - 데이터가 캐시에 미리 로드되도록!
  - 캐시 시간이 끝나기 전에 사용자가 해당 데이터를 이용하는한, 캐시된 데이터를 표시할 수 있으므로, 개발자가 서버 호출을 할 때까지 사용자가 기다릴 필요가 없음!

# Summary

- `Pre-populating` data options

  - `pre-fetch`, `setQueryData`, `placeholderData`, `initialData`

- 캐시를 미리 채우기 위한, `Pre-fetch`
  - 컴포넌트가 렌더링 되었을 떄
  - 페이지를 업데이트할 때, 다음 페이지를 미리 채우기
- 쿼리 키를 종속성 배열로 취급하기
  - 쿼리가 데이터를 다시 가져오지 않거나 예상한 시점에 새 데이터를 가져오지 않는 상황을 예방

---

# Filtering with the select option

select option을 이용한 filter가 유용한 이유

- 리액트 쿼리는 실제로 이를 최적화하기 때문(불필요한 계산을 줄임)
- 상세 동작

  - 리액트 쿼리는 select 함수의 삼중 등호 비교를 수행
  - 데이터가 마지막으로 데이터를 검색했을 때와 동일하고 select 함수가 동일한 경우 select 함수를 다시 실행시키지 않음 -> 최적화

- 이는 select 함수를 위한 안정적인 함수가 필요하다는 의미
  - 매번 변경되는 익명 함수를 사용할 수 없음
    - 삼중 등호 비교가 실패하게 될 것이기 때문
      > 이때, 익명 함수에서 안정적인 함수를 만들고 싶다면
      > `useCallback` 함수 사용

# Re-fetching

## `Refetching은 왜? 그리고 언제 사용하는가?

- 일반적으로 백그라운드 prefetching을 사용하먄 오래된 데이터를 서버에서 업데이트할 수 있다.
- 기본적으로 오래된 쿼리는 특정 조건에 따라 백그라운드에서 자동으로 리페치
  - 쿼리의 새 인스턴스가 마운트될 때 -> 해당 키가 포함된 쿼리가 처음으로 호출될 때
  - 리액트 컴포넌트를 마운트할 때마다 쿼리 호출
  - 윈도우에 초점이 다시 맞춰질 때
  - 네트워크가 다시 연결된 경우, 오래된 데이터가 업데이트되었는지 확인을 위해서.
  - 구성된 `refetchInterval`이 경과한 경우
    - 이는 사용자 작업이 없는 경우에도 데이터가 최신 상태로 유지되도록 서버를 주기적으로 리페치하여 데이터를 가져오려는 경우

## Refetching 방법

- `refetchOnMount`, `refetchOnWindowFocus`, `refetchOnReconnect`, `refetchIntaval`

- 명령형으로 refetch (in `useQuery`)

## Suppressing Re-fetch (리페치 억제)

- stale time 늘리기
  - 캐시 데이터가 오래된(stale) 경우에만 리페치를 트리거하기 때문
- boolean 옵션인 `refetchOnMount`, `refetchOnWindowFocus`, `refetchOnReconnect` 중 하나 또는 모두 끄기

> 리페치 억제는 자주 변경되지 않고 약간 오래되어도 사용자에게 큰 영향을 미치지 않는 데이터에 대해서만 수행해야함.
> 네트워크 호출을 효과적으로 줄이는가? _스스로 판단하기_

---

# Global Re-fetching

> 전역에서 리페치 옵션을 관리한다. 필요에 따라 개인화된 옵션을 추가로 설정할 수 있다.

## refetching 옵션을 전역에서 관리하고 적용 방법

- mutation 수행한 후 데이터를 무효화 -> 리페치 트리거
- Global 옵션은 `src/react-query/queryClient.ts`

# Polling과 Auto Refetching

## refetchInterval

# Summary

## 필터링을 위한 select option

- 리액트 쿼리 캐싱을 활용하고 데이터를 다시 필터링하지 않으려면, 삼중 등식 테스트에서 살아남을 수 있는 함수여야 한다.
- 그래서 함수가 안정적인지 확인하기 위해 리액트 `useCallback`을 사용
  ```js
  const selectFn = useCallback(
    (unfilteredStaff: Staff[]) => {
      if (filter === "all") return unfilteredStaff;
      return filterByTreatment(unfilteredStaff, filter);
    },
    [filter]
  );
  ```

## Re-fetch 옵션과 Suppressing Re-fetch 옵션

- 해당 옵션들은 전역적으로 추가한 다음, 특정 useQueries 및 prefetch 쿼리 호출에서 Overloading

```js
// 전역 queryClient에 옵션 설정
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 600000, // 10분
      gcTime: 900000, // 15분
      refetchOnWindowFocus: false,
    },
  },
  ...
});
```

```js
// 특정 useQueries 및 prefetch 쿼리 호출에서 Overloading
const commonOptions = {
  staleTime: 0,
  gcTime: 30000, // 5분(기본값)
};
...
  const { data: appointments = fallback } = useQuery({
    queryKey: [queryKeys.appointments, monthYear.year, monthYear.month],
    queryFn: () => getAppointments(monthYear.year, monthYear.month),
    select: (data) => selectFn(data, showAll),
    refetchOnWindowFocus: true,
    refetchInterval: 60000, // 1분
    ...commonOptions,
  });
...
```

## 폴링

`refetchInterval` 옵션

> 서버에서 데이터가 변경되었을 경우를 대비해 일정 간격으로 데이터를 리페치

---

# JWT Authentication

- JWT(Json Web Token)
  - 동작 방식
    - 사용자 이름, 비밀번호를 서버로 전송
    - 사용자 인증 정보가 데이터베이스에서 있는 정보와 일치하는지 확인
    - 일치한다면 서버가 Token을 반환함
    - 클라이언트는 서버에서 반환받은 Token을 이용하여 로그인을 요구하는 서버의 자원을 요청할 때마다 요청과 함께 헤더에 토큰을 보내어 서버에서 이 클라이언트가 인증된 것임을 알 수 있게 함
  - 보안
    - 서버가 토큰을 생성할 때 사용자 이름이나 사용자 ID와 같은 정보를 인코딩하여 포함시킴
    - 인증된 Token이 서버로 다시 전송될 때 이를 디코딩하여 데이터가 일치하는지 확인함
    - 서버에 SECRET_KEY가 필요한 이유
  - Token은 사용자 겍체에 저장
    - 실습 내용에서는 `local-storage`에 저장하여 사용
      > `local-storage`에 저장하면 사용자가 페이지를 새로고침해도 로그아웃되지 않음

# Auth hooks

인증 훅을 사용하여 리액트 쿼리와 인증 시스템에 대한 실습 진행

- `useLoginData`

  - `AuthContext` 값 반환
  - 사용자 ID, 사용자 Token, clearLoginData, setLoginData

- `useAuthActions`

  - signin, signout, signup

- `useUser`
  - 서버에서 사용자 데이터를 반환
  - user, updateUserData, clearUserData

# Hooks using Hooks

--Image--

- useUser는 useLoginData를 통해 어떤 사용자가 로그인했는지 알아야 한다.
- 그래서 서버에서 해당 사용자의 데이터를 요청할 수 있다.
- 데이터를 요청할 때 사용자가 로그인했다는 것을 증명하기 위해 사용자 토큰이 필요하다.
- useAuthActions는 쿼리 캐시에서 사용자 데이터를 업데이트하거나 삭제해야 한다.
  - 로그인할 때 업데이트, 로그아웃할 때 삭제
- 그리고 useAuthActions는 인증 컨텍스트에 로그인 데이터를 설정하거나 삭제하는 역할도 수행한다.

## 왜 사용자 ID와 Token을 두 번이나 저장해야 하는가?

위 이미지를 보면 사용자 ID와 Token은 인증 컨텍스트와 쿼리 캐시에 모두 저장된다.
이는 로그인하거나 로그아웃할 때 두 곳 모두에서 업데이트해야 함을 의미한다.

- _Reason_
  1. 쿼리 캐시에 로그인한 사용자를 저장하는 것이 혼란스러움
  - useQuery는 쿼리를 수행하기 위해 쿼리 캐시에서 사용자 ID 같은 데이터가 필요
  - 즉, 쿼리를 수행하기 위해 쿼리에서 데이터가 필요
    > 이는 코드를 혼란스럽고 이해하기 어렵게 만드는 순환적인 요소
  2. 로그인한 사용자는 서버 상태가 아니라 클라이언트 상태
  - 서버 데이터가 JWT Token과 사용자 ID를 포함하는 것은 부수적인 요소이며 사용자 이름과 주소 같은 다른 모든 사용자 데이터와는 별개
    > 클라이언트에서 로그인한 사용자와 Token을 별도로 저장하는 것이 더 합리적

# Summary

## useUser

- 서버로부터 사용자 프로필 데이터를 유지하는 것
- 사용자 데이터를 캐시하고 새로 고침하는 useQuert 호출
- 무한대 `staleTime`을 설정하여 캐시에서 데이터가 만료되지 않는 한 일반적인 새로고침 트리거가 데이터를 다시 가져오지 않도록 함
- `setQueryData`를 사용하여 서버에서 받은 데이터를 바탕으로 로그인할 때 정보를 설정함
- `removeQueries`를 사용하여 사용자가 로그아웃했을 때 캐시에서 해당 쿼리를 지워 사용자 정보가 남지 않게 함
- 쿼리 함수가 서버로부터 데이터를 가져올 수 있도록 `userId`와 `userToken`이 필요했고 이는 `useLoginData`를 통해 얻었음
- `useLoginData`는 클라이언트 state 즉, 클라이언트에 로그인한 사용자의 상태를 유지
- 종속 쿼리를 만들기 위해서 `useQuery`의 `enabled`옵션을 사용

```js
export function useUser() {
  const queryClient = useQueryClient();

  // get details on the userId
  const { userId, userToken } = useLoginData();
  // TODO: call useQuery to update user data from server
  const { data: user } = useQuery({
    // enabled 조건이 충족하지 않으면 해당 쿼리 함수는 실행되지 않는다.
    // userId가 null 즉, 사용자가 로그인하거나 로그아웃할 때 useQuery는 쿼리가 활성화되었는지를 확인한다.
    // 활성화된 상태라면 데이터를 가져오고
    // 활성화되지 않았다면 데이터를 가져오는 것에 신경 쓰지 않는다.
    enabled: !!userId,
    queryKey: generateUserKey(userId, userToken),
    queryFn: () => getUser(userId, userToken),
    staleTime: Infinity,
    // 이 데이터는 사용자가 스스로 업데이트할 경우에만 변경
  });

  // meant to be called from useAuth
  function updateUser(newUser: User): void {
    queryClient.setQueryData(
      generateUserKey(newUser.id, newUser.token),
      newUser
    );
  }

  // meant to be called from useAuth
  function clearUser() {
    queryClient.removeQueries({ queryKey: [queryKeys.user] });
  }

  return { user, updateUser, clearUser };
}
```

# Global Mutation Handling

- 전역 에러 핸들링과 로딩 중앙 집중화와 동일한 방식으로 설정

```js
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 600000, // 10분
      gcTime: 900000, // 15분
      refetchOnWindowFocus: false,
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      const title = createTitle(error.message, "query");
      errorHandler(title);
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      const title = createTitle(error.message, "mutation");
      errorHandler(title);
    },
  }),
});
```

# useMutation

- `useQuery`와 유사
- 차이점
  - no cache data
  - no retries
  - no refetch
  - no `isLoading` vs `isFetching`
  - 반환 객체에서 mutation을 실행하는데 실제 사용하는 mutate 함수를 반환한다.
  - `onMutate` callback

## useMutation 사용

```js
export function useReserveAppointment() {
  const { userId } = useLoginData();

  const toast = useCustomToast();

  const { mutate } = useMutation({
    // mutationFn에 인자를 설정하면 mutate 함수의 인자가 된다.
    // ex) () => mutate(appointmentData)
    mutationFn: (appointment: Appointment) =>
      setAppointmentUser(appointment, userId),
    onSuccess: () => {
      toast({ title: "You have reserved an appointment!", status: "success" });
    },
  });

  return mutate;
}
```

## invalidateQueries

- 예약을 통해 예약 데이터를 변이할 때 해당 데이터의 캐시를 무효화할 수 있다.
- 이를 통해 사용자가 페이지를 새로고침할 필요없이 반영된 내용을 바로 확인할 수 있다.
- 효과
  - 쿼리를 오래된 것으로 표현한다.
  - 쿼리가 현재 렌더링되고 있다면 재요청을 트리거한다. (쿼리를 사용하는 컴포넌트가 렌더링되고 있다면)
- 일반적인 순서
  > `mutate` -> `onSuccess` -> `invalidateQueries` -> active query -> `refetch` > `invalidateQueries`로 관련 쿼리들를 무효화시키면 재요청을 유발하게되어 새로고침 없이 데이터가 업데이트 된다.

## Query Filters

`Query Filters`는 한 번에 여러 쿼리에 영향을 줄 수 있는 `queryClient` 메소드에 적용된다.

- `removeQueries`, `invalidateQueries`, `cancelQueries`, etc...
- 위 모든 메소드는 `query filter` 인자를 받는다.
  - query key (부분 일치를 포함)
    - 부분 일치는 쿼리 키의 시작 부분이어야 한다.
  - type : `active`, `inactive` or `all`
  - stale status, `isFetching` status

## Update cache from Mutation Response

- `usePatchUser` 커스텀 훅
  - 사용자를 업데이트하는 데 사용할 메소드
- `useUser`의 `updateUser`를 사용
  - `queryClient` 메소드인 `setQueryData`를 사용하여 쿼리 캐시 업데이트

# Optimistic Updates

- 낙관적 업데이트는 서버로부터 응답을 받기도 전에 UI에 표시되는 데이터를 업데이트하는 것

  - mutation이 성공할 것이라고 낙관하므로 변이가 성공한 것처럼 데이터를 보여준다.
    - UI를 업데이트하되 캐시를 업데이트하지 않는 것

- 리액트 쿼리에는 UI뿐만 아니라 실제 쿼리 캐시도 업데이트하는 옵션을 제공한다.
  - 진행 중인 모든 쿼리를 취소해야 하므로 서버에서 오는 모든 데이터가 캐시의 업데이트를 덮어쓰지 않도록 해야 한다.
  - 업데이트가 실패할 경우를 대비해 이전 데이터를 저장해야 하며 업데이트 이전 상태로 데이터를 롤백해야 한다.
  - 또한, 이 롤백을 명시적으로 처리해야 한다.
  - 롤백 데이터로 캐시를 업데이트할 호출을 직접 만드러야 한다.
- 데이터가 많은 다른 컴포넌트에서 표시되는 경우 이 모든 작업을 수행하는 것이 가치가 있을 수 있다.
  - ex) 예를 들어 사용자의 이메일이 네비게이션 바 사용자 프로필에 표시되고 페이지의 다른 곳에서도 표시된다면 캐시를 업데이트하기 위해서 모든 데이터를 업데이트할 수 있다.

```js
export function usePatchUser() {
  const { user } = useUser();
  const queryClient = useQueryClient();

  const { mutate: patchUser } = useMutation({
    mutationKey: [MUTATION_KEY],
    mutationFn: (newData: User) => patchUserOnServer(newData, user),
    onSuccess: () => {
      toast({ title: "user updated!", status: "success" });
    },
    // onSettled = onSuccess + onError
    // mutation이 끝나면 성공이든 오류든 상관없이 실행된다.
    onSettled: () => {
      // invalidateQueries가 완료되고 서버에서 새로운 데이터를 받을 때까지
      // mutation이 진행 중인 상태를 유지하기 위해 Promise를 반환해야 함 (return 명시!)
      return queryClient.invalidateQueries({
        queryKey: [queryKeys.user],
      });
    },
  });

  return patchUser;
}
```

## UI

- 컴포넌트 내에서 `useMutationState` 훅을 사용하여 서버에 mutation을 요청하는 데이터 즉, mutation 데이터를 얻을 수 있다.
  - mutation 데이터가 무엇인지 식별할 수 있도록 mutation key를 사용
  - mutation이 진행 중인 동안 페이지에 mutation된 데이터를 표시하고 mutation이 해결된 후에는 쿼리를 무효화
    - mutation 후에는 항상 쿼리를 무효화하는 것이 좋은 습관!
  - mutation이 실패하면 서버에서 가장 최신 데이터 즉, mutation 이전의 오래된 데이터를 얻게 된다.

```js
...
  const pendingData = useMutationState({
    filters: { mutationKey: [MUTATION_KEY], status: "pending" },
    select: (mutation) => {
      return mutation.state.variables as User;
    },
  });

  // 보류 중인 데이터
  const pendingUser = pendingData ? pendingData[0] : null;
  ...
    <Stack textAlign="center">
      <Heading>
        Information for {pendingUser ? pendingUser.name : user?.name}
      </Heading>
    </Stack>
  ...
```

# Summary

## useMutation hook

- 사용자의 입력에 따라 나중에 데이터를 변형
- 사용할 수 있는 mutation 함수를 반환

## mutation이 발생한 후 클라이언트를 서버와 동기화

- mutation이 끝난 후 쿼리를 무효화
- mutation 후 반환된 데이터로 캐시를 명시적으로 업데이트
  - But, 쿼리 키가 변형 전과 후에 동일한 경우에만 캐시 업데이트가 작동함
- 낙관적 업데이트 (optimistic update)
  - UI
    - mutation이 진행 중일 때 react-query가 데이터를 유지
    - mutation이 해결된 후, 즉 오류가 발생했거나 성공했을 때 쿼리를 무효화
      - 어떤 경우든 쿼리를 무효화하여 서버로부터 가장 최신의 데이터를 받음
  - Cache Update

---

# Test

## Testing Mutations

- mutation 테스트는 쿼리 테스트보다 다소 어려운 경향이 있다.

  - Mock Service Worker를 사용하는 경우에는 더욱!
    - 이는 MSW가 실제로 mutation을 통해 변경되는 서버를 모방하지 않기 때문!
    - 따라서 서버에서 mutation의 결과를 테스트하려면 실제 테스트 서버가 필요 (단순히 MSW만으로는 부족)
    - 이번 섹션에서는 mutation 실행 후 성공적인 Toast 메시지가 나타나는지 확인하는 것으로 대체

- 쿼리 테스트와 마찬가지로 컴초넌트를 클라이언트 속성을 가진 제공자로 감싸야 할 것

  - 테스트를 수행할 때 우리가 렌더링하고 실행하는 동작
    - `useMutation`, `invalidateQueries`
    - 이 둘은 모두 `provider`와 `client`를 요구함

- mutation Trigger

  - ex) appointment mutation을 트리거하기 위해 appointment를 클릭
  - +) 테스트가 끝날 때 Toast를 닫는 것도 중요!
    - Toast 상태를 깨끗하게 유지하는 데 도움이 된다.
  - 테스트 함수 중에 Toast 사라짐이 일어나도록 해야하며 테스트 종료 후에는 일어나지 않아야 함
    - 다른 테스트에 영향이 가지 않도록

- Mocking User Login
  - 사용자 로그인 모방
  - 예약(appointment)를 테스트하려면 예약이 가능해야함
    - 로그인한 사용자 필요
  - 테스트에서 로그인한 사용자가 있다고 확신시키는 방법
    - `useLoginData` 훅에서 반환값을 `모의`
      1. `null`이 아닌 사용자 속성을 가진 객체를 가진 값을 반환
      2. 컴포넌트들이 `useUser`를 호출할 때 반환 객체에 null이 아닌 사용자가 있으므로 로그인한 사용자가 있는 것처럼 행동하게 된다.

# Testing Custom Hooks

- `renderHook` 메소드 in '@testing-library/react'
  - 훅을 사용하는 컴포넌트를 렌더링하느 것이 일반적으로 바람직함
- 이 앱에서는 `useAppointments`가 유일하게 어느 정도 복잡성을 지닌 hook
  - 이를 훅이 아닌 컴포넌트를 렌더링해서 테스트
- 사용자 상호작용과 DOM을 관찰하는 방식의 테스트로 진행
  - 개별 쿼리 클라이언트를 포함한 `provider` Wrapper를 생성

# Summary

## 사용자 상호작용을 테스트하는 것이 내부 구현보다 더 바람직환 관행

> 대부분의 경우 사용자가 보는 것을 테스트하고 리액트 쿼리 자체를 특별히 테스트하지 않는 경우가 많음

## Mock Service Worker

> 네트워크 호출을 시뮬레이션하기 위해 MSW 사용을 추천

## 컴포넌트와 Hook은 쿼리 Provider 안에 포함되어야 한다.

- 테스트의 간섭을 막기위해 각 테스트에서 새로운 쿼리 클라이언트 이용

```js
export const createQueryClientWrapper = () => {
  // 여기서도 테스트와 클라이언트 간의 상호작용을 방지하기 위함으로 새로운 쿼리 클라이언트를 생성
  const queryClient = generateQueryClient();
  return ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

// 각 테스트에 unique한 쿼리 클라이언트를 생성하는 함수
const generateQueryClient = () => {
  queryClientOptions.defaultOptions.queries.retry = false;
  return new QueryClient(queryClientOptions);

  // What we do?
  // 1. 생산 환경의 쿼리 클라이언트에서 queryClientOptions 추가. 이는 Toast를 던지는 'on error' 핸들러를 가짐
  // 2. 재시도 때문에 테스트가 시간 초과되지 않도록 retry를 'false'로 설정
};

// reference: https://testing-library.com/docs/react-testing-library/setup#custom-render
function customRender(ui: ReactElement, client?: QueryClient) {
  const queryClient = client ?? generateQueryClient();

  return RtlRender(
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>{ui}</MemoryRouter>
      </QueryClientProvider>
    </ChakraProvider>
  );
}
```

```js
test("filter staff", async () => {
  const { result } = renderHook(() => useStaff(), {
    wrapper: createQueryClientWrapper(),
  });
  ...
```

- 쿼리 클라이언트가 프로덕션 환경의 기본 설정을 사용하게 하는 것이 바람직함

```js
export const queryClientOptions: QueryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 600000, // 10분
      gcTime: 900000, // 15분
      refetchOnWindowFocus: false,
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      const title = createTitle(error.message, "query");
      errorHandler(title);
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      const title = createTitle(error.message, "mutation");
      errorHandler(title);
    },
  }),
};

export const queryClient = new QueryClient(queryClientOptions);
```

- `error` 테스트에서는 리액트 쿼리의 기본 설정인 `3번의 재시도`를 억제하도록 설정해야함.

```js
// 테스트가 error 동작을 기다리는 동안 시간 초과되지 않도록 억제
queryClientOptions.defaultOptions.queries.retry = false;
```
