export const conditionGradingScales = [
  {
    conditionName: "Hoàn hảo",
    symbol: "Hoàn hảo",
    value: 10,
    conditionState: "Hoàn hảo",
    usageLevel: "Không sử dụng",
    description:
      "Tình trạng hoàn hảo, không có khuyết điểm. Bìa sáng bóng, không xước, mép và góc sắc nét. Giấy trắng hoặc hơi ngà, không ố vàng.",
  },
  {
    conditionName: "Gần như hoàn hảo",
    symbol: "Gần hoàn hảo",
    value: 9,
    conditionState: "Gần như hoàn hảo",
    usageLevel: "Ít sử dụng",
    description:
      "Gần như hoàn hảo, nhưng có một số dấu hiệu sử dụng. Mép giấy hoặc góc có thể hơi quăn nhẹ.",
  },
  {
    conditionName: "Rất tốt",
    symbol: "Rất tốt",
    value: 8,
    conditionState: "Rất tốt",
    usageLevel: "Sử dụng cẩn thận",
    description:
      "Tình trạng rất tốt, nhưng có thể có vài lỗi nhỏ: mép bìa hơi mòn, giấy hơi ngả màu. Không ảnh hưởng đến thẩm mỹ tổng thể.",
  },
  {
    conditionName: "Tốt",
    symbol: "Tốt",
    value: 6,
    conditionState: "Tốt",
    usageLevel: "Sử dụng vừa phải",
    description:
      "Tình trạng tốt, nhưng có dấu hiệu sử dụng rõ ràng. Có thể có vết gấp nhẹ trên bìa hoặc góc, giấy ngả màu nhiều hơn.",
  },
  {
    conditionName: "Trung bình khá",
    symbol: "Trung bình khá",
    value: 5,
    conditionState: "Trung bình khá",
    usageLevel: "Sử dụng đáng kể",
    description:
      "Tình trạng trung bình, có dấu hiệu sử dụng đáng kể: mép mòn, vết nhăn, hoặc giấy hơi dính. Nội dung vẫn nguyên vẹn và rõ ràng.",
  },
  {
    conditionName: "Trung bình",
    symbol: "Trung bình",
    value: 4,
    conditionState: "Trung bình",
    usageLevel: "Sử dụng nhiều",
    description:
      "Nhiều dấu hiệu sử dụng: rách nhỏ, nếp gấp rõ, giấy ố vàng hoặc bìa mất độ sáng. Nội dung còn đầy đủ, nhưng thẩm mỹ bị ảnh hưởng.",
  },
  {
    conditionName: "Kém",
    symbol: "Kém",
    value: 2,
    conditionState: "Kém",
    usageLevel: "Sử dụng rất nhiều",
    description:
      "Hư hỏng rõ rệt: bìa bị rách, gáy lỏng lẻo, hoặc vài trang bị nhăn hoặc mất góc. Có thể có vết bút hoặc vẽ trên bìa/trang.",
  },
  {
    conditionName: "Rất kém",
    symbol: "Rất kém",
    value: 1,
    conditionState: "Rất kém",
    usageLevel: "Hư hỏng nặng",
    description:
      "Hư hỏng nghiêm trọng, có thể thiếu trang hoặc bìa bị tách rời. Nội dung vẫn đọc được nhưng tổng thể rất kém.",
  },
  {
    conditionName: "Tệ",
    symbol: "Tệ",
    value: 0,
    conditionState: "Tệ",
    usageLevel: "Hư hỏng hoàn toàn",
    description:
      "Rất tệ: bìa và trang có thể mất một phần lớn, giấy rách nát hoặc mòn. Giá trị chỉ còn ở mức lưu giữ kỷ niệm hoặc tham khảo.",
  },
];

export function getComicsCondition(level) {
  return conditionGradingScales.find((condition) => condition.value === level);
}
