export const getGCalUrl = (
  title: string,
  details: string,
  gcalTimes: { start: string; end: string } | null,
  location = "Clinic Address"
) =>
  gcalTimes
    ? `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
        title
      )}&dates=${gcalTimes.start}/${gcalTimes.end}&details=${encodeURIComponent(
        details
      )}&location=${encodeURIComponent(location)}&sf=true&output=xml`
    : "#";