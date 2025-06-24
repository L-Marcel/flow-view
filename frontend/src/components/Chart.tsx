import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import useData from "../store/useData";
import { isAfter, isBefore, isSameDay, parse } from "date-fns";
import { useEffect, useState } from "react";

interface Props {
  type: "sent" | "received";
}

const SOCIAL_MEDIA_COLORS = {
  whatsapp: "#25D366",
  messager: "#1877F2",
  instagram: "#E4405F",
  twitter: "#1DA1F2",
  linkedin: "#0A66C2",
  youtube: "#FF0000",
  pinterest: "#E60023",
  snapchat: "#FFFC00",
  tiktok: "#000000",
  telegram: "#229ED9",
  reddit: "#FF4500",
  discord: "#5865F2",
  spotify: "#1DB954",
  twitch: "#9146FF",
};

export default function Chart({ type }: Props) {
  const data = useData((state) => state.data);
  const keys = useData((state) => state.medias);
  const interval = useData((state) => state.interval);

  const [filters, setFilters] = useState<string[]>([]);

  useEffect(() => {
    setFilters(keys);
  }, [keys, setFilters]);

  const switchFilter = (filter?: string) => {
    if (!filter) return;
    const inFilter = filters.includes(filter);
    if (inFilter) removeFilter(filter);
    else addFilter(filter);
  };

  const addFilter = (filter: string) => {
    setFilters((state) => {
      const filters = [...state];
      filters.push(filter);
      return filters;
    });
  };

  const removeFilter = (filter: string) => {
    setFilters((state) => {
      let filters = [...state];
      filters = filters.filter((candidate) => candidate !== filter);
      return filters;
    });
  };

  return (
    <div className="py-4 pr-6 pl-2 bg-base-200 rounded-2xl w-full">
      <h1 className="font-semibold text-xl pl-4">{type === "sent"? "Enviando":"Recebido"}</h1>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data.filter((data) => {
            const date = parse(data.date, "dd/MM/yyyy", new Date());
            const from = interval?.from ?? new Date();
            const to = interval?.to ?? new Date();
            return (
              (isAfter(date, from) && isBefore(date, to)) ||
              isSameDay(date, from) ||
              isSameDay(date, to)
            );
          })}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend
            content={({ payload }) => {
              return (
                <ul className="flex flex-row pb-2 pt-4 justify-center gap-4 flex-wrap text-base-content">
                  {payload?.map((entry) => {
                    const actived = filters.includes(entry.value);
                    const opacity = actived ? 1 : 0.5;
                    return (
                      <li
                        key={entry.value}
                        style={
                          {
                            "--color-primary": entry.color,
                            opacity,
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          } as any
                        }
                      >
                        <button
                          onClick={() => switchFilter(entry.value)}
                          className="btn btn-sm btn-primary"
                        >
                          {entry.value}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              );
            }}
          />
          {keys.map((key) => {
            const actived = filters.includes(key);
            const opacity = actived ? 1 : 0.25;
            const colors = {
              [key]: "#000000",
              ...SOCIAL_MEDIA_COLORS,
            } as {
              [k in string]: string;
            };

            return (
              <Line
                key={key}
                type="monotone"
                name={key}
                dataKey={type + "." + key}
                stroke={colors[key]}
                opacity={opacity}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
