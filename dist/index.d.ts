interface ThemeOptions {
    progress?: number;
    name?: string;
    author?: string;
    startTime?: string;
    endTime?: string;
    progressBarColor?: string;
    progressColor?: string;
    backgroundColor?: string;
    nameColor?: string;
    authorColor?: string;
    timeColor?: string;
    imageDarkness?: number;
    backgroundImage?: string;
    thumbnailImage?: string;
    menuColor?: string;
    paused?: boolean;
}

declare const Pixel: (option: ThemeOptions) => Promise<Buffer>;

export { Pixel, type ThemeOptions };
