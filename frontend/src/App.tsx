import { compareAsc, format, isSameDay, parse, parseISO } from "date-fns";
import Chart from "./components/Chart";
import { useEffect } from "react";
import api from "./services/api";
import IntervalFilter from "./components/IntervalFilter";
import useData from "./store/useData";

function App() {
  const setIntervalLimits = useData((state) => state.setIntervalLimits);
  const setMedias = useData((state) => state.setMedias);
  const setData = useData((state) => state.setData);

  useEffect(() => {
    api
      .get<Data[]>("")
      .then((response) => {
        const { data, medias } = response.data
          .map(({ day, ...data }) => ({ ...data, date: parseISO(day) }))
          .sort((a, b) => compareAsc(a.date, b.date))
          .reduce(
            (prev, curr) => {
              const media = curr.media.toLowerCase();
              if (!prev.medias.includes(media)) prev.medias.push(media);

              if (!prev.lastDate || !isSameDay(prev.lastDate, curr.date)) {
                prev.lastDate = curr.date;
                prev.data.push({
                  date: format(curr.date, "dd/MM/yyyy"),
                  sent: {
                    [media]: curr.sent,
                  },
                  received: {
                    [media]: curr.received,
                  },
                });
              } else {
                const data: FormattedData = prev.data[prev.data.length - 1];
                prev.data[prev.data.length - 1] = {
                  ...data,
                  sent: {
                    ...data.sent,
                    [media]: curr.sent,
                  },
                  received: {
                    ...data.received,
                    [media]: curr.received,
                  },
                };
              }

              return prev;
            },
            {
              data: [],
              medias: [],
            } as ChartData
          );

        const firstDate = data.length > 0 ? data[0].date : undefined;
        const lastDate = data.length > 0 ? data[data.length - 1].date : undefined;

        setData(data);
        setMedias(medias);
        setIntervalLimits({
          from: firstDate
            ? parse(firstDate, "dd/MM/yyyy", new Date())
            : new Date(),
          to: lastDate ? parse(lastDate, "dd/MM/yyyy", new Date()) : new Date(),
        });
      })
      .catch(() => {
        setData([]);
        setMedias([]);
      });
  }, [setData, setMedias, setIntervalLimits]);

  return (
    <section className="min-h-screen bg-base-100 min-w-full flex flex-col p-6 gap-6 items-center">
      <IntervalFilter />
      <Chart type="received" />
      <Chart type="sent" />
    </section>
  );
};

export default App;
