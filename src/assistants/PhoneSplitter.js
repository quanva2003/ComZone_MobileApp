export default function PhoneSplitter(x: string): string {
  return (
    x.substring(0, 4) + " " + x.substring(4, 7) + " " + x.substring(7, x.length)
  );
}
