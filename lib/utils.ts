import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function renderADFContent(content: any[]): string {
  if (!Array.isArray(content)) return '';
  return content.map(node => renderADFNode(node)).join('');
}

export function renderADFNode(node: any): string {
  if (!node) return '';

  if (typeof node === 'string') return node;

  if (Array.isArray(node)) {
    return node.map(n => renderADFNode(n)).join('');
  }

  const content = node.content || [];

  switch (node.type) {
    case 'doc':
      return renderADFContent(content);
    
    case 'paragraph':
      return renderADFContent(content) + '\n';
    
    case 'text':
      let text = node.text || '';
      if (node.marks) {
        node.marks.forEach((mark: any) => {
          switch (mark.type) {
            case 'strong':
              text = `**${text}**`;
              break;
            case 'em':
              text = `*${text}*`;
              break;
            case 'code':
              text = `\`${text}\``;
              break;
          }
        });
      }
      return text;
    
    case 'bulletList':
      return content.map((item: any) => `• ${renderADFNode(item)}`).join('\n');
    
    case 'orderedList':
      return content.map((item: any, index: number) => `${index + 1}. ${renderADFNode(item)}`).join('\n');
    
    case 'listItem':
      const itemContent = renderADFContent(content);
      return itemContent.split('\n').filter(Boolean).join('\n  ');
    
    case 'heading':
      const level = node.attrs?.level || 1;
      return `${'#'.repeat(level)} ${renderADFContent(content)}\n`;
    
    case 'codeBlock':
      const language = node.attrs?.language || '';
      return `\`\`\`${language}\n${renderADFContent(content)}\`\`\`\n`;
    
    case 'blockquote':
      return content
        .map((n: any) => renderADFNode(n))
        .join('')
        .split('\n')
        .map((line: string) => `> ${line}`)
        .join('\n') + '\n';
    
    case 'hardBreak':
      return '\n';
    
    case 'rule':
      return '---\n';
    
    case 'mention':
      return `@${node.attrs?.text || ''}`;
    
    case 'inlineCard':
      return node.attrs?.url || '';
    
    case 'mediaGroup':
    case 'mediaSingle':
      return content.map((media: any) => {
        if (media.type === 'media' && media.attrs?.type === 'file') {
          return `[File: ${media.attrs.filename || 'Attachment'}]`;
        }
        return '';
      }).join('\n');
    
    default:
      return node.text || '';
  }
}

export function renderDescription(description: any): string {
  if (!description) return 'No description provided';
  
  if (typeof description === 'string') return description;
  
  try {
    if (typeof description === 'object') {
      const rendered = renderADFNode(description);
      return rendered.trim() || 'No description provided';
    }
  } catch (error) {
    console.error('Error rendering description:', error);
    return 'Error rendering description';
  }
  
  return 'No description provided';
}