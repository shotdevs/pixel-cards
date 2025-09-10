type PixelOption = {
    name: string;
    author: string;
    thumbnailImage: string;
    progress?: number;
    startTime?: string;
    endTime?: string;
    backgroundColor?: string;
    backgroundImage?: string;
    progressColor?: string;
    progressBarColor?: string;
    nameColor?: string;
    authorColor?: string;
    timeColor?: string;
    imageDarkness?: number;
    paused?: boolean;
};
declare const Pixel: (option: PixelOption) => Promise<Buffer>;

export { Pixel, type PixelOption };
