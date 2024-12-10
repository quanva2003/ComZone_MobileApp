export function convertToVietnameseDate(dateString) {
  const date = new Date(dateString);

  // Get the date components
  const day = date.getDate();
  const month = date.getMonth() + 1; // Months are zero-indexed
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  // Format time
  const formattedTime = `${hours}:${minutes.toString().padStart(2, "0")}`;

  // Construct the Vietnamese date string
  return ` ${formattedTime} ngày ${day
    .toString()
    .padStart(2, "0")} tháng ${month
    .toString()
    .padStart(2, "0")} năm ${year}  `;
}

// Example usage
const vietnameseDate = convertToVietnameseDate("2024-12-01T11:14:00.000Z");
console.log(vietnameseDate); // Output: "Ngày 01 tháng 12 năm 20y24, lúc 11:14"
