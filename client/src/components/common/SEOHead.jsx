import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEOHead = ({ 
  title = "Zelvora Luxury Accessories | Women's Fashion & Jewellery India", 
  description = "Shop luxury women's fashion accessories, Kundan earrings, rose gold watches, velvet potli handbags, hair accessories, & gift sets in India.",
  url = "https://zelvora.in",
  image = "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1200",
  type = "website",
  schemaData = null
}) => {
  const defaultSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Zelvora Luxury Accessories",
    "url": url,
    "logo": image,
    "sameAs": [
      "https://instagram.com/zelvoraaccessories",
      "https://facebook.com/zelvoraaccessories"
    ]
  };

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook / WhatsApp */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="Zelvora Luxury Accessories" />

      {/* Twitter Meta */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* JSON-LD Schema Markup */}
      <script type="application/ld+json">
        {JSON.stringify(schemaData || defaultSchema)}
      </script>
    </Helmet>
  );
};

export default SEOHead;
