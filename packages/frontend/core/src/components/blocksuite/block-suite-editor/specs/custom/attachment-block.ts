import type { BlockSpec } from '@blocksuite/block-std';
import {
  AttachmentBlockService,
  AttachmentBlockSpec,
} from '@blocksuite/blocks';
import bytes from 'bytes';

class CustomAttachmentBlockService extends AttachmentBlockService {
  override mounted(): void {
    // blocksuite default max file size is 10MB, we override it to 2GB
    // but the real place to limit blob size is CloudQuotaModal / LocalQuotaModal
    this.maxFileSize = bytes.parse('2GB');
    super.mounted();
  }
}

export const CustomAttachmentBlockSpec: BlockSpec = {
  ...AttachmentBlockSpec,
  service: CustomAttachmentBlockService,
};
