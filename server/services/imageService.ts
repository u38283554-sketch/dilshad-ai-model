import { NormalizedAttachment } from '../providers/AIProvider';

export class ImageService {
  private static readonly SUPPORTED_MIME_TYPES = new Set([
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp',
    'image/gif',
  ]);

  /**
   * Identifies image attachments and extracts clean Base64 data and MIME types.
   */
  public static extractImageParts(attachments?: NormalizedAttachment[]): Array<{ mimeType: string; data: string }> {
    if (!attachments || attachments.length === 0) return [];

    const imageParts: Array<{ mimeType: string; data: string }> = [];

    for (const att of attachments) {
      if (att.type === 'image' || att.mimeType?.startsWith('image/')) {
        let mimeType = att.mimeType || 'image/png';
        let rawData = att.data || '';

        // If data is in Data URL format (data:image/png;base64,xxxx), strip the prefix
        if (rawData.startsWith('data:')) {
          const match = rawData.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/);
          if (match) {
            mimeType = match[1];
            rawData = match[2];
          }
        }

        if (this.SUPPORTED_MIME_TYPES.has(mimeType.toLowerCase()) && rawData.length > 0) {
          imageParts.push({
            mimeType,
            data: rawData,
          });
        }
      }
    }

    return imageParts;
  }
}
