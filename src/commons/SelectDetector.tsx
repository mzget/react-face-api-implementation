import React from "react";
import { Select } from "antd";

const { Option } = Select;

export const SSD_MOBILENETV1 = "ssd_mobilenetv1";
export const TINY_FACE_DETECTOR = "tiny_face_detector";
type SelectDetectorProps = {
  defaultMode: string;
  handleChange: (value: string) => void;
};
export default function SelectDetector({
  handleChange,
  defaultMode
}: SelectDetectorProps) {
  return (
    <div style={{ margin: 10 }}>
      <Select
        defaultValue={defaultMode}
        style={{ width: "auto" }}
        onChange={handleChange}
      >
        <Option value={SSD_MOBILENETV1}>SSD_MOBILENETV1</Option>
        <Option value={TINY_FACE_DETECTOR}>TINY_FACE_DETECTOR</Option>
      </Select>
    </div>
  );
}
