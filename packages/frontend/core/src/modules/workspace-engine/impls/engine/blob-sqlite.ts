import { apis } from '@affine/electron-api';
import { assertExists } from '@blocksuite/global/utils';
import type { BlobStorage } from '@toeverything/infra';

import { bufferToBlob } from '../../utils/buffer-to-blob';

export class SqliteBlobStorage implements BlobStorage {
  constructor(private readonly workspaceId: string) {}
  name = 'sqlite';
  readonly = false;
  async get(key: string) {
    assertExists(apis);
    const buffer = await apis.db.getBlob(this.workspaceId, key);
    if (buffer) {
      return bufferToBlob(buffer);
    }
    return null;
  }
  async set(key: string, value: Blob) {
    assertExists(apis);
    await apis.db.addBlob(
      this.workspaceId,
      key,
      new Uint8Array(await value.arrayBuffer())
    );
    return key;
  }
  delete(key: string) {
    assertExists(apis);
    return apis.db.deleteBlob(this.workspaceId, key);
  }
  list() {
    assertExists(apis);
    return apis.db.getBlobKeys(this.workspaceId);
  }
}
