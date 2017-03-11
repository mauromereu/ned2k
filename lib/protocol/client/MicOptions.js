class MicOptions {
  constructor() {
    this.aichVersion = 0;
    this.unicodeSupport = 0;
    this.udpVer = 0;
    this.dataCompVer = 0;
    this.supportSecIdent = 0;
    this.sourceExchange1Ver = 0;
    this.extendedRequestsVer = 0;
    this.acceptCommentVer = 0;
    this.noViewSharedFiles = 0;
    this.multiPacket = 0;
    this.supportsPreview = 0;
  }

  intValue() {
    return (this.aichVersion << ((4 * 7) + 1)) |
      (this.unicodeSupport << 4 * 7) |
      (this.udpVer << 4 * 6) |
      (this.dataCompVer << 4 * 5) |
      (this.supportSecIdent << 4 * 4) |
      (this.sourceExchange1Ver << 4 * 3) |
      (this.extendedRequestsVer << 4 * 2) |
      (this.acceptCommentVer << 4 * 1) |
      (this.noViewSharedFiles << 1 * 2) |
      (this.multiPacket << 1 * 1) |
      (this.supportsPreview << 1 * 0);
  }

  assign(value = 0) {
    this.aichVersion = (value >> (4 * 7 + 1)) & 0x07;
    this.unicodeSupport = (value >> 4 * 7) & 0x01;
    this.udpVer = (value >> 4 * 6) & 0x0f;
    this.dataCompVer = (value >> 4 * 5) & 0x0f;
    this.supportSecIdent = (value >> 4 * 4) & 0x0f;
    this.sourceExchange1Ver = (value >> 4 * 3) & 0x0f;
    this.extendedRequestsVer = (value >> 4 * 2) & 0x0f;
    this.acceptCommentVer = (value >> 4 * 1) & 0x0f;
    this.noViewSharedFiles = (value >> 1 * 2) & 0x01;
    this.multiPacket = (value >> 1 * 1) & 0x01;
    this.supportsPreview = (value >> 1 * 0) & 0x01;
  }
};

module.exports = MicOptions;