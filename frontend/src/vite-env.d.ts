/// <reference types="vite/client" />

type Data = {
    day: string;
    media: string;
    sent: number;
    received: number;
};

type FormattedData = {
    date: string;
    sent: {
        [key in string]: number;
    };
    received: {
        [key in string]: number;
    };
};

type ChartData = {
    formattedData: FormattedData[];
    medias: string[];
    lastDate?: Date;
};