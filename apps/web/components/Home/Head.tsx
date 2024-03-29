import NextHead from "next/head";

export const Head = () => {
  return (
    <NextHead>
      <title>kakei</title>
      <link
        rel="icon"
        href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💸</text></svg>"
      />
      <meta
        name="viewport"
        content="width=device-width,initial-scale=1.0,maximum-scale=1.0"
      />
      <meta name="robots" content="noindex" />
    </NextHead>
  );
};
