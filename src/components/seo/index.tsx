/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import * as React from "react";
import { Helmet } from "react-helmet";

import ogImage from "../../images/og-image.png";
import { useSiteMetadata } from "../../hooks/use-site-metadata";

type Prop = {
  description?: string;
  lang?: string;
  meta?: React.ComponentProps<`meta`>[];
  title: string;
};

const Seo: React.FCX<Prop> = ({
  description = ``,
  lang = `en`,
  meta = [],
  title,
}) => {
  const siteMetadata = useSiteMetadata();
  const metaDescription = description || siteMetadata.description;
  const defaultTitle = siteMetadata?.title;
  const ogImageUrl = siteMetadata?.siteUrl + ogImage;

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      titleTemplate={defaultTitle ? `%s | ${defaultTitle}` : undefined}
      meta={[
        {
          name: `description`,
          content: metaDescription,
        },
        {
          property: `og:title`,
          content: title,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          property: `og:image`,
          content: ogImageUrl,
        },
        {
          name: `twitter:card`,
          content: `summary`,
        },
        {
          name: `twitter:creator`,
          content: siteMetadata?.author || ``,
        },
        {
          name: `twitter:title`,
          content: title,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
        {
          name: `twitter:image`,
          content: ogImageUrl,
        },
        {
          name: `image`,
          content: ogImageUrl,
        },
        ...meta,
      ]}
    />
  );
};

export default Seo;
