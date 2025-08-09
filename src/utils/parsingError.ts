export default function (
  e: any,
  defaultMessage?: string,
): Error | TypeError {
  const error =
    e instanceof Error || e instanceof TypeError
      ? e
      : new Error(defaultMessage || 'An unknown error');

  return error;
}
