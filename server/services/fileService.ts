import { NormalizedAttachment } from '../providers/AIProvider';

export class FileService {
  /**
   * Formats file attachments (text, markdown, code, csv, etc.) into readable context strings for LLMs.
   */
  public static formatAttachmentContext(attachments?: NormalizedAttachment[]): string {
    if (!attachments || attachments.length === 0) return '';

    const textAttachments = attachments.filter((att) => {
      const type = att.type?.toLowerCase();
      const ext = att.name?.split('.').pop()?.toLowerCase() || '';
      return (
        type === 'txt' ||
        type === 'code' ||
        type === 'csv' ||
        type === 'docx' ||
        type === 'pdf' ||
        ['txt', 'md', 'ts', 'js', 'py', 'json', 'csv', 'sql', 'html', 'css'].includes(ext)
      );
    });

    if (textAttachments.length === 0) return '';

    return textAttachments
      .map((att) => {
        const content = att.data || '(File uploaded for context)';
        return `\n\n--- [Attached Document / File: ${att.name}] ---\n${content}\n--- [End of ${att.name}] ---\n`;
      })
      .join('\n');
  }

  /**
   * Sanitizes attachment names and types.
   */
  public static validateAttachment(att: NormalizedAttachment): boolean {
    if (!att || !att.name) return false;
    return true;
  }
}
