type Props = {
  memo: string;
  onChange: (memo: string) => void;
};

export const MemoPad = ({ memo, onChange }: Props) => {
  return (
    <textarea
      value={memo}
      onChange={(e) => onChange(e.target.value)}
      rows={Math.max(5, memo.split("\n").length)}
      style={{ width: "100%" }}
    />
  );
};
