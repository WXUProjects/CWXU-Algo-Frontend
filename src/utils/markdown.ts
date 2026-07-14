import { marked } from 'marked';
import katex from 'katex';

marked.setOptions({ gfm: true, breaks: true });

const PLACEHOLDER_PREFIX = '@@MATH';
const PLACEHOLDER_SUFFIX = '@@';

type MathPiece = { display: boolean; tex: string };

/** 抽出 $...$ / $$...$$，避免 marked 破坏公式 */
function extractMath(src: string): { text: string; pieces: MathPiece[] } {
    const pieces: MathPiece[] = [];
    let text = src;

    // 先处理 $$...$$（display）
    text = text.replace(/\$\$([\s\S]+?)\$\$/g, (_, tex: string) => {
        const i = pieces.length;
        pieces.push({ display: true, tex: tex.trim() });
        return `${PLACEHOLDER_PREFIX}${i}${PLACEHOLDER_SUFFIX}`;
    });

    // 再处理 $...$（inline）；$$ 已先抽走，这里不会误伤
    text = text.replace(/\$((?:\\.|[^$\\])+?)\$/g, (_, tex: string) => {
        const i = pieces.length;
        pieces.push({ display: false, tex: tex.trim() });
        return `${PLACEHOLDER_PREFIX}${i}${PLACEHOLDER_SUFFIX}`;
    });

    return { text, pieces };
}

function renderKatex(tex: string, display: boolean): string {
    try {
        return katex.renderToString(tex, {
            displayMode: display,
            throwOnError: false,
            strict: 'ignore',
            trust: false,
            output: 'html',
        });
    } catch {
        const esc = tex.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return display ? `<pre class="math-fallback">${esc}</pre>` : `<code class="math-fallback">${esc}</code>`;
    }
}

function restoreMath(html: string, pieces: MathPiece[]): string {
    return html.replace(
        new RegExp(`${PLACEHOLDER_PREFIX}(\\d+)${PLACEHOLDER_SUFFIX}`, 'g'),
        (_, idx: string) => {
            const p = pieces[Number(idx)];
            if (!p) return '';
            return renderKatex(p.tex, p.display);
        },
    );
}

function sanitizeHtml(html: string): string {
    return html
        .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
        .replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, '')
        .replace(/\son\w+\s*=\s*(['"]).*?\1/gi, '')
        .replace(/\son\w+\s*=\s*[^\s>]+/gi, '')
        .replace(/javascript:/gi, '');
}

/** Markdown + KaTeX → 安全 HTML */
export function renderMarkdown(md: string): string {
    if (!md) return '';
    try {
        // 统一 CF $$$ 与多余空白
        let raw = md.replace(/\$\$\$/g, '$');
        const { text, pieces } = extractMath(raw);
        const html = marked.parse(text, { async: false }) as string;
        return sanitizeHtml(restoreMath(html, pieces));
    } catch {
        return sanitizeHtml(
            md.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>'),
        );
    }
}
