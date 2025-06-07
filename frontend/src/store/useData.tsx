import { create } from "zustand";
import type { DateRange } from "react-day-picker";

type DataStore = {
    medias: string[];
    data: FormattedData[];
    interval?: DateRange;
    intervalLimits?: DateRange;
    setMedias: (medias: string[]) => void;
    setData: (data: FormattedData[]) => void;
    setInterval: (interval: DateRange) => void;
    setIntervalLimits: (interval: DateRange) => void;
};

const useData = create<DataStore>((set) => ({
    medias: [],
    data: [],
    setMedias: (medias: string[]) => set({ medias }),
    setData: (data: FormattedData[]) => set({ data }),
    setInterval: (interval: DateRange) => set({ interval }),
    setIntervalLimits: (interval: DateRange) => set({ intervalLimits: interval, interval }),
}));

export default useData;