function getJwtOrThrow() {
  const token = localStorage.getItem("jwt");
  if (!token) throw new Error("토큰 없음");
  return token;
}

function withJwt<TParams extends any[], TResult>(
  fn: (token: string, ...args: TParams) => TResult,
) {
  return (...args: TParams) => {
    const token = getJwtOrThrow();
    return fn(token, ...args);
  };
}

export { withJwt };
