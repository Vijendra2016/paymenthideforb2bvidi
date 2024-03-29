import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import { AppProvider as PolarisAppProvider } from "@shopify/polaris";
import polarisStyles from "@shopify/polaris/build/esm/styles.css";
import { boundary } from "@shopify/shopify-app-remix";

import { authenticate } from "../shopify.server";

export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export async function loader({ request }) {
  await authenticate.admin(request);

  return json({
    polarisTranslations: require(`@shopify/polaris/locales/en.json`),
    apiKey: process.env.SHOPIFY_API_KEY,
  });
}

export default function App() {
  const { polarisTranslations } = useLoaderData();
  const { apiKey } = useLoaderData();

  return (
    <>
      <script
        src="https://cdn.shopify.com/shopifycloud/app-bridge.js"
        data-api-key={apiKey}
      />
      <ui-nav-menu>
        <Link to="/app" rel="home">Home</Link>
        <Link to="/app/payment-customization/10e397ad-476a-42f8-8be5-8ce06d063641/64160022">Customization</Link>
        <Link to="/app/payment-customization/10e397ad-476a-42f8-8be5-8ce06d063641/64160022" rel="home">Customization</Link>
      </ui-nav-menu>
      <PolarisAppProvider i18n={polarisTranslations}>
        <Outlet />
      </PolarisAppProvider>
    </>
  );
}

// Shopify needs Remix to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
