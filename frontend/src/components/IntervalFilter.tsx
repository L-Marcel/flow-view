import { DayPicker } from "react-day-picker";
import useData from "../store/useData";
import { format } from "date-fns";
import { useEffect, useState } from "react";

export default function IntervalFilter() {
  const { interval, intervalLimits, setInterval } = useData();
  const [month, setMonth] = useState(intervalLimits?.to);

  useEffect(() => {
    setMonth(intervalLimits?.to);
  }, [intervalLimits?.to]);

  return (
    <>
      <button
        popoverTarget="rdp-popover"
        className="input input-border w-min"
        style={{ anchorName: "--rdp" } as React.CSSProperties}
      >
        De {format(interval?.from ?? new Date(), "dd/MM/yyyy")} até{" "}
        {format(interval?.to ?? new Date(), "dd/MM/yyyy")}
      </button>
      <div
        popover="auto"
        id="rdp-popover"
        className="dropdown dropdown-bottom dropdown-center"
        style={{ positionAnchor: "--rdp" } as React.CSSProperties}
      >
        <DayPicker
          required
          month={month}
          onMonthChange={setMonth}
          disabled={{
            after: intervalLimits?.to,
            before: intervalLimits?.from,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any}
          classNames={{
            selected: "selected",
            day_button: "day_button",
            range_end: "range_end",
            range_start: "range_start",
          }}
          className="react-day-picker"
          mode="range"
          selected={interval}
          onSelect={setInterval}
        />
      </div>
    </>
  );
}
