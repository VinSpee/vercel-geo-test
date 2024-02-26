import { component$ } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import { geolocation } from "@vercel/edge";

export const useLocationLoader = routeLoader$((event) => {
  const location = geolocation(event)
  return location;
})

export default component$(() => {
  const locationLoader = useLocationLoader();
  return (
    <div>
      <h1>Your location</h1>
    <pre>
    <code>
      {JSON.stringify(locationLoader.value, null, 2)}
    </code>
    </pre>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
