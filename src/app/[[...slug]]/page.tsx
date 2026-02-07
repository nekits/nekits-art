import { Metadata } from "next";
import { works } from "@/data/works";
import Gallery from "./Gallery";

function getWork(slug?: string[]) {
  if (!slug || slug.length === 0) return works[0];
  return works.find((w) => w.id === slug[0]) || works[0];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const work = getWork(slug);
  const title = `nekits@art — ${work.title}`;
  const description =
    work.ogDescription || `${work.series} — ${work.technique}. ${work.context}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      ...(work.ogImage && {
        images: [
          {
            url: work.ogImage,
            width: 2752,
            height: 1536,
            alt: title,
          },
        ],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(work.ogImage && { images: [work.ogImage] }),
    },
  };
}

export function generateStaticParams() {
  return [
    { slug: [] },
    ...works.map((w) => ({ slug: [w.id] })),
  ];
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const work = getWork(slug);
  return <Gallery initialWorkId={work.id} />;
}
