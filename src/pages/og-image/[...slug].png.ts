import RobotoMonoBold from "@/assets/roboto-mono-700.ttf";
import RobotoMono from "@/assets/roboto-mono-regular.ttf";
import { getAllPosts } from "@/data/post";
import { siteConfig } from "@/site.config";
import { getFormattedDate } from "@/utils/date";
import { Resvg } from "@resvg/resvg-js";
import type { APIContext, InferGetStaticPropsType } from "astro";
import satori, { type SatoriOptions } from "satori";
import { html } from "satori-html";

const ogOptions: SatoriOptions = {
	// debug: true,
	fonts: [
		{
			data: Buffer.from(RobotoMono),
			name: "Roboto Mono",
			style: "normal",
			weight: 400,
		},
		{
			data: Buffer.from(RobotoMonoBold),
			name: "Roboto Mono",
			style: "normal",
			weight: 700,
		},
	],
	height: 630,
	width: 1200,
};

const markup = (title: string, pubDate: string) =>
	html`<div tw="flex flex-col w-full h-full bg-[#1e1e2e] text-[#cdd6f4]">
		<div tw="flex flex-col flex-1 w-full p-10 justify-center">
			<p tw="text-2xl mb-6">${pubDate}</p>
			<h1 tw="text-6xl font-bold leading-snug text-white">${title}</h1>
		</div>
		<div tw="flex items-center justify-between w-full p-10 border-t border-[#89b4fa] text-xl">
			<div tw="flex items-center">
				<svg xmlns="http://www.w3.org/2000/svg" width="60" height="65" viewBox="0 0 500 500"><g transform="scale(1.98)"><rect width="252.6" height="252.6" y="12" fill="#89b4fa" rx="37.9" ry="37.9" transform="translate(0 -12)"/><path fill="#cdd6f4" d="M89 145c-10-6-19-13-26-19l-15 16c-11 13-15 25-10 31 3 5 12 8 24 8 10 0 21-2 32-5l-5-31m126-66c-3-4-12-7-24-7-10 0-21 2-33 5 3 9 5 19 6 30 9 6 18 13 25 20 23-21 31-39 26-48" vector-effect="non-scaling-stroke"/><path fill="#cdd6f4" d="M94 76c-11-3-22-4-32-4-12 0-21 2-24 7-6 8 2 27 25 47 7 7 16 13 26 19a256 228 0 0 1-1-19 204 204 0 0 1 6-50m111 66-16-16-25-19a256 228 0 0 1 1 19 256 229 0 0 1-1 19c-1 12-3 22-6 31 12 3 23 5 33 5 12 0 21-3 24-8 4-6 0-18-10-31" vector-effect="non-scaling-stroke"/><path fill="#cdd6f4" d="M126 145c-11 0-21-8-21-19s10-19 21-19c12 0 21 9 21 19s-9 19-21 19m38-38c-1-11-3-22-6-31-8-27-21-42-32-42-10 0-24 15-32 42l-5 31a256 229 0 0 0-1 19 204 204 0 0 0 6 50c8 27 22 43 32 43 11 0 24-16 32-43 3-9 5-19 6-31a257 229 0 0 0 1-19l-1-19" vector-effect="non-scaling-stroke"/><path fill="#1e1e2e" d="M222 177c-6 9-20 11-31 11-25 0-58-9-89-26-26-13-48-30-61-47-13-16-17-30-11-40 6-9 21-11 32-11 24 0 57 10 88 26 26 14 48 31 62 48 13 16 16 30 10 39m-4-43c-15-17-37-35-64-49-32-17-66-27-92-27-19 0-32 5-38 14-8 12-4 28 11 46 14 18 37 36 64 50 32 17 66 27 92 27 18 0 31-5 38-15 7-11 3-28-11-46" vector-effect="non-scaling-stroke"/><path fill="#1e1e2e" d="M211 115c-14 16-35 33-61 47-31 16-64 26-88 26-11 0-26-2-32-11s-2-24 11-39c13-17 35-34 61-48 31-16 64-26 88-26 11 0 25 2 32 11 6 9 2 24-11 40m17-43c-7-9-20-14-38-14-26 0-59 10-92 27-26 14-49 31-63 49-15 18-19 34-11 46 6 9 19 14 38 14 26 0 59-10 91-27 27-14 50-31 64-49s18-34 11-46" vector-effect="non-scaling-stroke"/><path fill="#1e1e2e" d="M126 104c-13 0-24 10-24 22s11 22 24 22c14 0 25-10 25-22s-11-22-25-22" vector-effect="non-scaling-stroke"/><path fill="#1e1e2e" d="M126 226c-25 0-47-46-47-100s22-99 47-99 47 45 47 99-21 100-47 100m0-206c-30 0-54 47-54 106 0 60 24 106 54 106 31 0 54-46 54-106S157 20 126 20" vector-effect="non-scaling-stroke"/></g></svg>
				<p tw="ml-3 font-semibold">${siteConfig.title}</p>
			</div>
			<p>by ${siteConfig.author}</p>
		</div>
	</div>`;

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export async function GET(context: APIContext) {
	const { pubDate, title } = context.props as Props;

	const postDate = getFormattedDate(pubDate, {
		month: "long",
		weekday: "long",
	});
	const svg = await satori(markup(title, postDate), ogOptions);
	const png = new Resvg(svg).render().asPng();
	return new Response(png, {
		headers: {
			"Cache-Control": "public, max-age=31536000, immutable",
			"Content-Type": "image/png",
		},
	});
}

export async function getStaticPaths() {
	const posts = await getAllPosts();
	return posts
		.filter(({ data }) => !data.ogImage)
		.map((post) => ({
			params: { slug: post.id },
			props: {
				pubDate: post.data.updatedDate ?? post.data.publishDate,
				title: post.data.title,
			},
		}));
}
