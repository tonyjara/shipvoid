import Head from "next/head";
import React from "react";
import { usePathname } from "next/navigation";
import { siteData } from "@/lib/Constants/SiteData";

interface props {
  title?: string;
  description?: string;
  imageSrc?: string;
  date?: Date;
  id?: string;
}

/** This component is by default on the layout, you can use this same compoonent on any page to overwrite the meta tags */
const MetaTagsComponent = ({
  id,
  title,
  description,
  imageSrc,
  date,
}: props) => {
  const pathname = usePathname();
  const origin = typeof window === "undefined" ? "" : window.location.origin;
  const WEB_URL =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : siteData.prodUrl;

  const imageUrl = origin + (imageSrc ?? siteData.ogCoverImage);

  const metaKey = (key: string) => (id ? key + id : key);

  const metaDescription = (description ?? siteData.description).substring(
    0,
    150,
  );

  const myTitle = title ?? siteData.appName;
  const currentUrl = `${WEB_URL}${pathname}`;
  const domain = siteData.prodUrl;
  const author = siteData.author;

  return (
    <Head>
      <link rel="canonical" href={currentUrl} key={metaKey("canonical")} />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1"
        key={metaKey("viewport")}
      />

      <title key={metaKey("title")}>{myTitle}</title>

      <meta name="author" content={author} key={metaKey("author")} />
      <meta
        name="description"
        content={metaDescription}
        key={metaKey("description")}
      />
      <meta name="theme-color" content="#46AC42" />
      <meta
        name="image"
        property="og:image"
        content={imageUrl}
        key={metaKey("image")}
      />
      <meta property="og:image:alt" content={metaDescription} />

      {/* <!-- Facebook Meta Tags --> */}
      <meta
        name="url"
        property="og:url"
        content={currentUrl}
        key={metaKey("fb-url")}
      />
      <meta
        name="type"
        property="og:type"
        content="website"
        key={metaKey("fb-type")}
      />
      <meta
        name="title"
        property="og:title"
        content={myTitle}
        key={metaKey("fb-title")}
      />
      <meta
        name="description"
        property="og:description"
        content={metaDescription}
        key={metaKey("fb-description")}
      />

      {/* <!-- Twitter Meta Tags --> */}
      <meta
        name="twitter:card"
        content="summary_large_image"
        key={metaKey("twitter-card")}
      />
      <meta name="twitter:domain" content={domain} key={metaKey("domain")} />
      <meta
        name="twitter:url"
        content={currentUrl}
        key={metaKey("twitter-url")}
      />
      <meta
        name="twitter:title"
        content={myTitle}
        key={metaKey("twitter-title")}
      />
      <meta
        name="twitter:description"
        content={metaDescription}
        key={metaKey("twtitter-desc")}
      />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content={metaDescription} />

      {/* <!-- LinkedIn Meta Tags --> */}
      <meta
        name="publish_date"
        property="og:publish_date"
        content={date?.toISOString() ?? new Date().toISOString()}
        key={metaKey("pubdate")}
      />

      {/* Favicon links */}
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
      <meta name="msapplication-TileColor" content="#da532c" />
      <meta name="theme-color" content="#ffffff" />
    </Head>
  );
};

export default MetaTagsComponent;
