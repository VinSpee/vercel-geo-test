import { component$, Slot } from "@builder.io/qwik";
import { type RequestHandler } from "@builder.io/qwik-city";

export const onGet: RequestHandler = async ({ cacheControl }) => {
  // Control caching for this request for best performance and to reduce hosting costs:
  // https://qwik.builder.io/docs/caching/
  cacheControl({
    // Always serve a cached response by default, up to a week stale
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
    maxAge: 5,
  });
};

export default component$(() => {
  return (
    <div class="mx-auto flex h-screen flex-col">
      <div class="bg-accents-0 px-8">
        <Slot />
      </div>
      <footer class="bg-accents-1 z-20 mt-auto flex w-full items-center justify-center border-t py-10">
        <span class="text-primary">Created by</span>
        <a
          href="https://vinspee.me"
          aria-label="Vercel.com Link"
          target="_blank"
          rel="noreferrer"
          class="text-black"
        >
          VinSpee, based on vercel’s example
        </a>
      </footer>
    </div>
  );
});
