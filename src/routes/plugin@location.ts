import { type RequestHandler } from "@builder.io/qwik-city";

export const onGet: RequestHandler = async (event) => {
  const obj: Record<string, string> = {};
  event.request.headers.forEach((v, k) => (obj[k] = v));
  console.log(
    "plugin@location:onGet",
    Object.fromEntries([...new Headers(event.headers).entries()]),
    obj,
  );
};
