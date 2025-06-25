self.__uv$config = {
  prefix: "/ww/loading/",
  bare: "https://prox-ww.learnstats.xyz",
  encodeUrl: Ultraviolet.codec.xor.encode,
  decodeUrl: Ultraviolet.codec.xor.decode,
  handler: "/ww/uv.handler.js",
  client: "/ww/uv.client.js",
  bundle: "/ww/uv.bundle.js",
  config: "/ww/uv.config.js",
  sw: "/ww/uv.sw.js",
};
