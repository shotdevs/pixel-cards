type PixelOption = {
    name: string;
    author: string;
    thumbnailImage: string;
    progress?: number;
    startTime?: string;
    endTime?: string;
};
declare const Pixel: (option: PixelOption) => Promise<Buffer>;

export { Pixel, type PixelOption };
