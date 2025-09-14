type PixelOption = {
    name: string;
    author: string;
    thumbnailImage: string;
    progress?: number;
    startTime?: string;
    endTime?: string;
    progressColor?: string;
    progressGradientEndColor?: string;
    progressBarColor?: string;
    nameColor?: string;
    authorColor?: string;
    timeColor?: string;
    imageDarkness?: number;
};
declare const Pixel: (option: PixelOption) => Promise<Buffer>;

export { Pixel, type PixelOption };
