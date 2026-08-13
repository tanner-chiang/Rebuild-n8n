#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'node:fs';

const sourcePath = 'packages/frontend/@n8n/i18n/src/index.ts';
const localePath = 'packages/frontend/@n8n/i18n/src/locales/zh.json';

JSON.parse(readFileSync(localePath, 'utf8'));

let source = readFileSync(sourcePath, 'utf8');

function replaceOnce(label, before, after) {
	if (source.includes(after)) return;

	const first = source.indexOf(before);
	const last = source.lastIndexOf(before);
	if (first === -1 || first !== last) {
		throw new Error(`Cannot safely apply ${label}: expected one compatibility anchor`);
	}

	source = source.replace(before, after);
}

replaceOnce(
	'Chinese locale import',
	"import englishBaseText from './locales/en.json';",
	"import englishBaseText from './locales/en.json';\nimport chineseBaseText from './locales/zh.json';",
);
replaceOnce('default locale', "\tlocale: 'en',", "\tlocale: 'zh',");
replaceOnce(
	'Chinese locale messages',
	'\tmessages: { en: englishBaseText },',
	'\tmessages: { en: englishBaseText, zh: chineseBaseText },',
);

writeFileSync(sourcePath, source);
console.log(`Applied current n8n i18n compatibility changes to ${sourcePath}`);
