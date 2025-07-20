function getJwtOrThrow() {
  const token = localStorage.getItem("jwt");
  if (!token) throw new Error("토큰 없음");
  return token;
}

export function withJwt<TParams, TResult>(
  fn: (token: string, params: TParams) => TResult,
) {
  return (params: TParams) => {
    const token = getJwtOrThrow();
    return fn(token, params);
  };
}
