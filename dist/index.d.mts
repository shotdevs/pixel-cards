type PixelOption$1 = {
    name: string;
    author: string;
    thumbnailImage: string;
    progress?: number;
    startTime?: string;
    endTime?: string;
};
declare const PixelJapanese: (option: PixelOption$1) => Promise<Buffer>;

type PixelOption = {
    name: string;
    author: string;
    thumbnailImage: string;
    progress?: number;
    startTime?: string;
    endTime?: string;
};
declare const Pixel: (option: PixelOption) => Promise<Buffer>;

export { Pixel, PixelJapanese, type PixelOption };
