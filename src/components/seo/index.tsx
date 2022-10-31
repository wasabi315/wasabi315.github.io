import * as React from "react";

import ogImage from "../../images/og-image.png";
import { useSiteMetadata } from "../../hooks/use-site-metadata";

type Prop = {
  description?: string;
  title: string;
  children?: React.ReactNode;
};

const Seo: React.FCX<Prop> = ({ description = ``, title, children }) => {
  const siteMetadata = useSiteMetadata();
  const metaDescription = description || siteMetadata.description;
  const defaultTitle = siteMetadata?.title;
  const ogImageUrl = siteMetadata?.siteUrl + ogImage;

  return (
    <>
      <title>{`${title} | ${defaultTitle}`}</title>
      <meta name="description" content={metaDescription} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="twitter:card" content="summary" />
      <meta property="twitter:creator" content={siteMetadata?.author || ``} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={ogImageUrl} />
      <meta name="image" content={ogImageUrl} />
      {children}
    </>
  );
};

export default Seo;
