import { compareAsc, format, isSameDay, parseISO } from "date-fns";
import Chart from "./components/Chart";
import { useEffect, useState } from "react";
import api from "./services/api";

function App() {
  const [data, setData] = useState<Data[]>([]);

  useEffect(() => {
    api.get<Data[]>("").then((response) => {
      setData(response.data);
    }).catch(() => {
      setData([]);
    });
  }, [setData]);
  
  const { formattedData, medias } = data
    .map(({ day, ...data }) => ({ ...data, date: parseISO(day) }))
    .sort((a, b) => compareAsc(a.date, b.date))
    .reduce((prev, curr) => {
      const media = curr.media.toLowerCase();
      if(!prev.medias.includes(media)) prev.medias.push(media);

      if(!prev.lastDate || !isSameDay(prev.lastDate, curr.date)) {
        prev.lastDate = curr.date;
        prev.formattedData.push({
          date: format(curr.date, 'dd/MM/yyyy'),
          sent: {
            [media]: curr.sent
          },
          received: {
            [media]: curr.received
          }
        });
      } else {
        const formattedData: FormattedData = prev.formattedData[prev.formattedData.length - 1];
        prev.formattedData[prev.formattedData.length - 1] = {
          ...formattedData,
          sent: {
            ...formattedData.sent,
            [media]: curr.sent
          },
          received: {
            ...formattedData.received,
            [media]: curr.received
          }
        };
      };

      return prev;
    }, {
      formattedData: [],
      medias: []
    } as ChartData);

  return (
    <section className="min-h-screen min-w-full flex flex-col p-6 gap-6">
      <Chart type="received" keys={medias} data={formattedData}/>
      <Chart type="sent" keys={medias} data={formattedData}/>
    </section>
  )
}

export default App
