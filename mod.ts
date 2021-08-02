import {
	rest,
	sendMessage,
} from 'https://deno.land/x/discordeno@12.0.1/mod.ts';
import { serve, json } from 'https://deno.land/x/sift@0.3.5/mod.ts';
import { NaticoEmbed } from 'https://deno.land/x/natico@2.3.0-rc.1/src/util/Embed.ts';
import { GithubHooks } from './types.ts';
rest.token = `Bot ${Deno.env.get('TOKEN')!}`;
const channels = [818158216156413973n, 871713062120484885n];
const parseJson = (text: string) => {
	try {
		return JSON.parse(text);
	} catch (e) {
		return undefined;
	}
};
const templateEmbed = () =>
	new NaticoEmbed()
		.setFooter(
			'Aethor',
			'https://cdn.discordapp.com/avatars/870383692403593226/910b4e1f4e19d745dd080930044f8afc.png?size=2048'
		)
		.setTimestamp();

const makeIssueEmbed = (c: GithubHooks) => {
	const embed = templateEmbed()
		.setAuthor(c.sender.login, c.sender.avatar_url, c.sender.html_url)
		.setTitle(
			`[${c.repository.full_name}] Issue opened #${c.issue?.number} ${c.issue?.title}`,
			c.issue?.html_url
		)
		.setDescription(`${c.issue?.body}`);
	if (c.issue?.comments !== 0)
		embed.setTitle(
			`[${c.repository.full_name}] New comment on issue #${c.issue?.number}: ${c.issue?.title}`,
			c.issue?.html_url
		);
	return embed;
};
const makeCommitEmbed = (c: GithubHooks) => {
	const embed = templateEmbed()
		.setTitle(
			`[${c.repository.full_name}] ${c.commits?.length || 1} new commit`,
			c.compare
		)
		.setDescription(
			`${c.commits
				?.map(
					(x) =>
						`[\`${x.id?.slice(0, 7)}\`](${x.url}) ${x.message} - ${
							x.author.name
						}`
				)
				?.join('\n')}`
		)
		.setAuthor(c.sender.login, c.sender.avatar_url, c.sender.html_url);
	return embed;
};

const makeForkEmbed = (c: GithubHooks) => {
	const embed = templateEmbed()
		.setTitle(
			`[${c.repository.full_name}] Fork created: ${c.forkee?.full_name}`,
			c.forkee?.html_url
		)

		.setAuthor(
			c.forkee?.owner?.login as any,
			c.forkee?.owner.avatar_url,
			c.forkee?.owner.html_url
		);
	return embed;
};

const makeReleaseEmbed = (c: any) => {
	const embed = templateEmbed()
		.setTitle(
			`[${c.repository.full_name}] New release published: ${c.release?.name}`,
			c.release?.html_url
		)
		.setAuthor(c.sender.login, c.sender.avatar_url, c.sender.html_url);
	return embed;
};
//TODO: ADD RELEASE TYPES
const makeEmbed = (c: any) => {
	return c.issue
		? makeIssueEmbed(c)
		: c.commits
		? makeCommitEmbed(c)
		: c.forkee
		? makeForkEmbed(c)
		: c.release
		? makeReleaseEmbed(c)
		: undefined;
};

serve({
	'/': async (req: Request) => {
		const js: GithubHooks = parseJson(await req.text());
		if (!js)
			return json({
				success: false,
				message: 'Theres nothing here',
			});

		try {
			const em = makeEmbed(js);
			if (em)
				for (const channel of channels)
					await sendMessage(channel, {
						embeds: [em],
					});
			return json({
				success: 'true',
			});
		} catch (e) {
			console.error(e);
			return json({
				success: 'false',
				error: `${e}`,
			});
		}
	},
});