import { component$ } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead, z } from "@builder.io/qwik-city";
import { geolocation } from "@vercel/edge";
import Image from "./Geolocation Map.svg?jsx";

const CountriesSchema = z.array(
  z.object({
    cca2: z.string(),
    currencies: z.record(
      z.string(),
      z.object({ name: z.string(), symbol: z.string() }),
    ),
    languages: z.record(z.string(), z.string()),
    flag: z.string().emoji(),
  }),
);

export const useLocationLoader = routeLoader$(async (event) => {
  const countries = await import("../lib/countries.json").then((res) =>
    CountriesSchema.parse(res.default),
  );
  const geo = geolocation(event);
  const country = geo.country || "XX";
  const city = geo.city || "Unknown";
  const region = geo.region || "XX";
  console.log("viewer location", geo);
  console.log(
    "useLocationLoader: headers",
    Object.fromEntries([...new Headers(event.headers).entries()]),
  );

  const countryInfo = countries.find((x) => x.cca2 === country);

  const currencyCode = Object.keys(countryInfo?.currencies ?? [])[0];
  const currency = countryInfo?.currencies[currencyCode];
  const languages = Object.values(countryInfo?.languages ?? []).join(", ");

  return {
    country: country,
    city: city,
    region: region,
    currencyCode: currencyCode,
    currencySymbol: currency?.symbol,
    name: currency?.name,
    languages: languages,
    flag: countryInfo?.flag,
  };
});

export default component$(() => {
  const locationLoader = useLocationLoader();
  return (
    <div class="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-2">
      <div class="fixed inset-0 overflow-hidden bg-[#f8fafb] opacity-75">
        <Image aria-label="World Map" />
      </div>
      <main class="z-10 flex flex-1 flex-col items-center px-4 pt-8 text-center sm:px-20 sm:pt-20">
        <h1 class="text-3xl font-bold sm:text-5xl">Geolocation</h1>
        <p class="mt-4 text-lg text-gray-700 sm:text-xl">
          Show localized content based on headers
        </p>
        <a
          class="text-md mt-4 flex items-center text-blue-500 hover:underline sm:text-lg"
          href="https://vercel.com/docs/edge-network/headers#request-headers?utm_source=geo-ip-demo&utm_campaign=geo-ip-demo"
          target="_blank"
          rel="noreferrer"
        >
          View Documentation
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            stroke="currentColor"
            class="ml-1"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            fill="none"
            shape-rendering="geometricPrecision"
          >
            <path d="M5 12h14" />
            <path d="M12 5l7 7-7 7" />
          </svg>
        </a>
        <section class="mt-16 w-full rounded-lg border border-gray-300 bg-white shadow-lg transition hover:shadow-2xl">
          <div class="items-between flex justify-center border-b p-4">
            <div class="self-center">
              <img
                alt={`${locationLoader.value.country} flag`}
                class="rounded-full"
                src={`https://flagcdn.com/96x72/${locationLoader.value.country.toLowerCase()}.png`}
                width={32}
                height={32}
              />
            </div>
            <div class="ml-4 mr-auto text-left">
              <h4 class="font-semibold">{locationLoader.value.name}</h4>
              <h5 class="text-gray-700">{locationLoader.value.city}</h5>
            </div>
            <p class="self-center text-gray-700">
              {locationLoader.value.country}
            </p>
          </div>
          <div class="items-between flex justify-center border-b bg-gray-50 p-4">
            <h4 class="mr-auto text-left font-semibold">Languages</h4>
            <div class="self-center">
              <p class="text-gray-700">{locationLoader.value.languages}</p>
            </div>
          </div>
          <div class="items-between flex justify-center border-b bg-gray-50 p-4">
            <h4 class="mr-auto text-left font-semibold">Currency</h4>
            <p class="text-gray-700">{`${locationLoader.value.currencyCode} ${locationLoader.value.currencySymbol}`}</p>
          </div>
          <div class="flexborder-b rounded-b-lg bg-gray-50 p-4">
            <h4 class="text-left font-semibold">Geolocation Headers</h4>
            <div class="mt-4 rounded-lg bg-black px-4 py-2 text-left font-mono text-sm leading-6 text-white">
              <p>
                <strong>{"x-vercel-ip-city: "}</strong>
                {locationLoader.value.city}
              </p>
              <p>
                <strong>{"x-vercel-ip-country-region: "}</strong>
                {locationLoader.value.region}
              </p>
              <p>
                <strong>{"x-vercel-ip-country: "}</strong>
                {locationLoader.value.country}
              </p>
              <p>
                <strong>{"x-vercel-ip-flag: "}</strong>
                {locationLoader.value.flag}
              </p>
            </div>
          </div>
        </section>
      </main>
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
